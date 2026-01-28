import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  updatestart,
  updatesucccess,
  updatefailure,
  deletesuccess,
} from "../redux/userslice.jsx";
import { NavLink } from "react-router-dom";
import { clearAds } from "../redux/adsslice.jsx";
import { clearListings } from "../redux/listingslice.jsx";

function Profile() {
  const mumbaiLocalities = [
    "Andheri",
    "Bandra",
    "Borivali",
    "Dadar",
    "Goregaon",
    "Malad",
    "Powai",
    "Thane",
  ];
  const fileref = useRef();
  const dispatch = useDispatch();

  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [deleting, setdeleting] = useState(false);
  const [fileup, setFile] = useState(null);
  const [uploading, setUploading] = useState("idle");
  const [ferror, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  useEffect(() => {
    if (ferror) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [ferror]);

  useEffect(() => {
    if (uploading == "success") {
      const timer = setTimeout(() => {
        setUploading("idle");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [uploading]);
  async function handleUpload() {
    try {
      setUploading("uploading");
      const formdata = new FormData();
      formdata.append("pfp-pic", fileup);

      const res = await fetch("/api/pfp/upload", {
        method: "POST",
        body: formdata,
      });
      const data = await res.json();
      if (data.success === false) {
        setUploading("idile");
        setError(data.message);
        return;
      }

      setFormData({
        ...formData,
        pfp: data.url,
        pfpid: data.imageid,
      });
      setUploading("success");
      setError(false);
    } catch (err) {
      setError(err.message);
      setUploading("idle");
    }
  }

  useEffect(() => {
    if (fileup) handleUpload();
  }, [fileup]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      dispatch(updatefailure("Please Enter Credentials To update"));
      return;
    }

    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.in",
      "rediffmail.com",
      "icloud.com",
      "protonmail.com",
      "aol.com",
      "zoho.com",
      "mail.com",
      "gmail.co.in",
    ];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personalContactValue) {
      const trimmedEmail = formData.personalContactValue.trim().toLowerCase();

      if (!emailRegex.test(trimmedEmail)) {
        dispatch(updatefailure("Please enter a valid email address"));
        return;
      }

      const domain = trimmedEmail.split("@")[1];
      if (!allowedDomains.includes(domain)) {
        dispatch(
          updatefailure(
            "Please use a supported email domain (Gmail, Yahoo, Outlook, etc.)",
          ),
        );
        return;
      }

      formData.personalContactValue = trimmedEmail;
    }

    if (formData.companyContactValue) {
      console.log(formData.companyContactValue);

      const trimmedCompanyEmail = formData.companyContactValue
        .trim()
        .toLowerCase();

      if (!emailRegex.test(trimmedCompanyEmail)) {
        dispatch(updatefailure("Please enter a valid company email"));
        return;
      }
      const domain = trimmedCompanyEmail.split("@")[1];
      if (!allowedDomains.includes(domain)) {
        dispatch(
          updatefailure(
            "Please use a supported email domain (Gmail, Yahoo, Outlook, etc.)",
          ),
        );
        return;
      }
      formData.companyContactValue = trimmedCompanyEmail;
    }

    if (currentuser.role === "dealer" && formData.localities) {
      if (formData.localities.length === 0) {
        dispatch(updatefailure("Dealers must select at least one locality"));
        return;
      }
    }

    if (formData.username) {
      const trimmedUsername = formData.username.trim();
      if (!trimmedUsername) {
        dispatch(updatefailure("Username must be proper"));
        return;
      }
      if (trimmedUsername.length < 3) {
        dispatch(updatefailure("Username must be more than 3 characters"));
        return;
      }
      formData.username = trimmedUsername;
    }

    if (
      formData.companyName ||
      formData.companyAddress ||
      formData.companyContactValue
    ) {
      if (
        (formData.companyName || currentuser.companyName) &&
        !(formData.companyAddress || currentuser.companyAddress)
      ) {
        dispatch(
          updatefailure(
            "Company address is required when company name is provided",
          ),
        );
        return;
      }
    }

    try {
      dispatch(updatestart());
      console.log("Sending update data:", formData);

      const res = await fetch(`/api/update/${currentuser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updatefailure(data.message));
        return;
      }

      dispatch(updatesucccess(data.user));
      setFormData({});
      setSuccess(true);
    } catch (err) {
      dispatch(updatefailure(err.message));
    }
  }

  async function handlesignout() {
    await fetch("/api/signout");
    dispatch(deletesuccess());
    dispatch(clearAds());
    dispatch(clearListings());
    dispatch(clearProperties());
  }
  async function handledelete() {
    try {
      setdeleting(true);

      const res = await fetch(`/api/delete/${currentuser._id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        dispatch(deleteerror(data.message));
        setdeleting(false);
        return;
      }

      dispatch(deletesuccess());

      if (currentuser.role === "builder") {
        dispatch(clearAds());
      } else {
        dispatch(clearListings());
        dispatch(clearProperties());
      }

      setdeleting(false);
    } catch (err) {
      setdeleting(false);
      dispatch(deleteerror(err.message));
    }
  }

  return (
    <div className="p-4 mx-auto max-w-md bg-gray-100 mt-6 rounded-md shadow">
      <h1 className="text-center text-2xl font-bold">Profile</h1>

      <form
        className="flex flex-col gap-4 items-center mt-6"
        onSubmit={handleSubmit}
      >
        <input
          type="file"
          hidden
          ref={fileref}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          src={currentuser.pfp}
          alt="pfp"
          className="h-20 w-20 rounded-full object-cover cursor-pointer"
          onClick={() => fileref.current.click()}
        />
        {uploading === "uploading" && (
          <p className="text-yellow-600">Uploading...</p>
        )}
        {uploading === "success" && (
          <p className="text-green-600">Upload successful</p>
        )}
        {ferror && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{ferror}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        )}

        <input
          type="text"
          defaultValue={currentuser.username}
          className="bg-gray-200 w-full p-2 rounded"
          onChange={(e) =>
            setFormData((p) => ({ ...p, username: e.target.value }))
          }
        />

        {currentuser.personalContactValue && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Personal Email</label>
            <input
              type="email"
              defaultValue={currentuser.personalContactValue}
              className="bg-gray-200 w-full p-2 rounded"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  personalContactValue: e.target.value,
                }))
              }
            />
          </div>
        )}

        {currentuser.companyContactValue && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Company Email</label>
            <input
              type="email"
              defaultValue={currentuser.companyContactValue}
              className="bg-gray-200 w-full p-2 rounded"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  companyContactValue: e.target.value,
                }))
              }
            />
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          className="bg-gray-200 w-full p-2 rounded"
          onChange={(e) =>
            setFormData((p) => ({ ...p, password: e.target.value }))
          }
        />

        {currentuser.role === "dealer" && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Select Localities</label>
            <select
              multiple
              defaultValue={currentuser.localities || []}
              className="bg-gray-200 w-full p-2 rounded h-32"
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value,
                );
                setFormData((p) => ({
                  ...p,
                  localities: selected,
                }));
              }}
            >
              {mumbaiLocalities.map((locality) => (
                <option key={locality} value={locality}>
                  {locality}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              Hold Ctrl/Cmd to select multiple
            </p>
          </div>
        )}

        {currentuser.companyName && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Company Name</label>
            <input
              type="text"
              defaultValue={currentuser.companyName}
              className="bg-gray-200 w-full p-2 rounded"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  companyName: e.target.value,
                }))
              }
            />
          </div>
        )}

        {currentuser.companyAddress && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Company Address</label>
            <input
              type="text"
              defaultValue={currentuser.companyAddress}
              className="bg-gray-200 w-full p-2 rounded"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  companyAddress: e.target.value,
                }))
              }
            />
          </div>
        )}

        {currentuser.companyDescription && (
          <div className="w-full">
            <label className="text-sm text-gray-600">Company Description</label>
            <textarea
              defaultValue={currentuser.companyDescription}
              className="bg-gray-200 w-full p-2 rounded"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  companyDescription: e.target.value,
                }))
              }
              rows="3"
            />
          </div>
        )}

        <div className="w-full text-sm text-gray-600 bg-gray-200 p-2 rounded">
          <p>
            <strong>Account Type:</strong> {currentuser.role}
            {currentuser.dealerType && ` (${currentuser.dealerType})`}
          </p>
        </div>

        <button className="bg-gray-700 text-white w-full p-2 rounded">
          {loading ? "Updating..." : "Update"}
        </button>

        {success && <p className="text-green-600 text-sm">Profile updated</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-between items-center border-t border-gray-300 pt-4 mt-4">
          <span
            className="cursor-pointer text-red-700 hover:text-red-800 hover:underline active:scale-95 transition-colors px-3 py-1 rounded hover:bg-red-50"
            onClick={handledelete}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </span>
          <div className="h-6 w-px bg-gray-300"></div>
          <span
            className="cursor-pointer text-red-700 hover:text-red-800 hover:underline active:scale-95 transition-colors px-3 py-1 rounded hover:bg-red-50"
            onClick={handlesignout}
          >
            Sign Out
          </span>
        </div>

        {currentuser?.role !== "builder" ? (
          <NavLink
            to="/user-listings"
            className="text-green-600 text-sm hover:underline"
          >
            View your listings
          </NavLink>
        ) : (
          <NavLink
            to="/builder-ads"
            className="text-blue-600 text-sm hover:underline"
          >
            View your ads
          </NavLink>
        )}
      </form>
    </div>
  );
}

export default Profile;
