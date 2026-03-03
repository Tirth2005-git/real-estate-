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
import { clearProperties } from "../redux/propertiesSlice.jsx";
import Select from "react-select";
import { clearDealerProfile } from "../redux/dealerProfileSlice.jsx";

function Profile() {
  const PROPERTY_TYPES = [
    "Flat",
    "Bungalow",
    "Villa",
    "Studio Apartment",
    "Builder Floor",
    "Office Space",
    "Shop",
    "Showroom",
    "Warehouse",
    "Industrial",
  ];

  const LISTING_TYPES = ["rent", "sale"];

  const mumbaiLocalities = [
    "colaba",
    "nariman point",
    "marine lines",
    "churchgate",
    "fort",
    "cuffe parade",
    "malabar hill",
    "walkeshwar",
    "breach candy",
    "tardeo",
    "haji ali",
    "worli",
    "lower parel",
    "prabhadevi",
    "dadar",
    "mahim",
    "matunga",
    "sion",

    "bandra",
    "khar",
    "santacruz",
    "vile parle",
    "andheri",
    "jogeshwari",
    "goregaon",
    "malad",
    "kandivali",
    "borivali",
    "dahisar",

    "kurla",
    "vidyavihar",
    "ghatkopar",
    "vikroli",
    "bhandup",
    "mulund",
    "thane",
    "kalyan",
    "dombivli",
    "ambernath",
    "badlapur",

    "mankhurd",
    "govandi",
    "chembur",
    "tilak nagar",
    "koperkhairane",
    "navi mumbai",
    "nerul",
    "vashi",
    "sanpada",
    "seawoods",
    "belapur",
    "kharghar",
    "panvel",

    "byculla",
    "mazgaon",
    "parel",
    "lalbaug",
    "chinchpokli",
    "sewri",
    "wadala",
    "sion",
    "king circle",
    "mumbai central",
    "grant road",
    "charni road",
    "matunga west",
    "dadar west",
    "prabhadevi west",
    "dadar east",
    "parel east",
    "mahalakshmi",
    "mahim west",
    "bandra west",
    "bandra east",
    "khar west",
    "khar east",
    "santacruz east",
    "santacruz west",
    "vile parle east",
    "vile parle west",
    "andheri east",
    "andheri west",
    "jogeshwari east",
    "jogeshwari west",
    "goregaon east",
    "goregaon west",
    "malad east",
    "malad west",
    "kandivali east",
    "kandivali west",
    "borivali east",
    "borivali west",
    "dahisar east",
    "dahisar west",
    "mira road",
    "bhayandar",
    "naigaon",
    "vasai",
    "virar",
  ];
  const localityOptions = mumbaiLocalities.map((l) => ({
    value: l,
    label: l,
  }));

  const fileref = useRef();
  const dispatch = useDispatch();

  const { currentuser, loading, error } = useSelector((state) => state.user);
  const [deleting, setdeleting] = useState(false);
  const [fileup, setFile] = useState(null);
  const [uploading, setUploading] = useState("idle");
  const [ferror, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [notificationPrefs, setNotificationPrefs] = useState({
    localities: currentuser.notificationPreferences?.localities || [],
    propertyTypes: currentuser.notificationPreferences?.propertyTypes || [],
    listingTypes: currentuser.notificationPreferences?.listingTypes || [],
  });

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
    const cleanPayload = {};
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      if (value !== null && value !== undefined) {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          Array.isArray(value)
        ) {
          cleanPayload[key] = value;
        }
      }
    });
    const payload = {
      ...cleanPayload,
    };

    if (currentuser.role !== "builder") {
      payload.notificationPreferences = {
        localities: notificationPrefs.localities || [],
        propertyTypes: notificationPrefs.propertyTypes || [],
        listingTypes: notificationPrefs.listingTypes || [],
      };
    }

    const hasProfileUpdates = Object.keys(formData).length > 0;

    const prefs = notificationPrefs || {};

    const allEmpty =
      (!prefs.localities || prefs.localities.length === 0) &&
      (!prefs.propertyTypes || prefs.propertyTypes.length === 0) &&
      (!prefs.listingTypes || prefs.listingTypes.length === 0);

    const hasNotificationUpdates =
      currentuser.role !== "builder" &&
      JSON.stringify(prefs) !==
        JSON.stringify(currentuser.notificationPreferences || {});

    if (!hasProfileUpdates && !hasNotificationUpdates) {
      dispatch(updatefailure("Nothing to update"));
      return;
    }
    if (hasNotificationUpdates && !allEmpty) {
      if (!prefs.localities || prefs.localities.length === 0) {
        dispatch(
          updatefailure(
            "Please select at least one locality to enable notifications",
          ),
        );
        return;
      }
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

      payload.personalContactValue = trimmedEmail;
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
      payload.companyContactValue = trimmedCompanyEmail;
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
      payload.username = trimmedUsername;
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

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      const res = await fetch(`/api/update/${currentuser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        dispatch(updatefailure(data.message));
        return;
      }
      console.log(payload);
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
    dispatch(clearDealerProfile());
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
        dispatch(clearDealerProfile());
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
            <Select
              isMulti
              options={localityOptions}
              defaultValue={localityOptions.filter((opt) =>
                currentuser.localities?.includes(opt.value),
              )}
              placeholder="Search & select localities..."
              className="w-full"
              onChange={(selected) => {
                setFormData((p) => ({
                  ...p,
                  localities: selected.map((s) => s.value),
                }));
              }}
            />
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
        {currentuser.role != "builder" && (
          <div className="w-full border-t border-gray-300 pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-2">
              Notification Preferences
            </h2>

            <div className="mb-4">
              <label className="text-sm text-gray-600">
                Preferred Localities
              </label>
              <Select
                isMulti
                options={localityOptions}
                defaultValue={localityOptions.filter((opt) =>
                  currentuser.notificationPreferences?.localities?.includes(
                    opt.value,
                  ),
                )}
                placeholder="Select localities for notifications"
                className="w-full"
                onChange={(selected) => {
                  const localities = selected
                    ? selected.map((s) => s.value)
                    : [];
                  setNotificationPrefs((p) => ({
                    ...p,
                    localities: localities,
                  }));
                }}
              />
            </div>

            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-1">
                Listing Type
              </label>
              <div className="flex gap-4">
                {LISTING_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={currentuser.notificationPreferences?.listingTypes?.includes(
                        type.toLowerCase(),
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setNotificationPrefs((p) => {
                          const currentTypes = p.listingTypes || [];
                          let newTypes;

                          if (isChecked) {
                            newTypes = [...currentTypes, type.toLowerCase()];
                          } else {
                            newTypes = currentTypes.filter(
                              (t) => t !== type.toLowerCase(),
                            );
                          }

                          return {
                            ...p,
                            listingTypes: newTypes,
                          };
                        });
                      }}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PROPERTY_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      defaultChecked={currentuser.notificationPreferences?.propertyTypes?.includes(
                        type.toLowerCase(),
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setNotificationPrefs((p) => {
                          const currentTypes = p.propertyTypes || [];
                          let newTypes;

                          if (isChecked) {
                            const value = type.toLowerCase();
                            newTypes = [...currentTypes, value];
                          } else {
                            newTypes = currentTypes.filter(
                              (t) => t !== type.toLowerCase(),
                            );
                          }

                          return {
                            ...p,
                            propertyTypes: newTypes,
                          };
                        });
                      }}
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
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
