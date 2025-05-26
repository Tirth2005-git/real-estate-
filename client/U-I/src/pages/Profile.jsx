import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { clearListings } from "../redux/listingslice.jsx";
import { clearProperties } from "../redux/propertiesSlice.jsx";
import {
  updatestart,
  updatesucccess,
  updatefailure,
  deleteerror,
  deletesuccess,
} from "../redux/userslice.jsx";
import { Link, NavLink } from "react-router-dom";

function Profile() {
  const fileref = useRef();
  const [fileup, setFile] = useState(0);
  const [uploading, setUploading] = useState("idile");
  const [deleting, setdeleting] = useState(false);
  const [ferror, setError] = useState();
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const { currentuser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (uploading === "success") {
      const timer = setTimeout(() => {
        setUploading("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploading]);
  useEffect(() => {
    if (success === true) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const dispatch = useDispatch();

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
        avatar: data.url,
        imageid: data.imageid,
      });
      setUploading("success");
      setError(false);
    } catch (err) {
      setError(err.message);
      setUploading("idle");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      dispatch(updatestart());

      const res = await fetch(`/api/update/${currentuser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updatefailure(data.message));
        return;
      }

      setSuccess(true);
      dispatch(updatesucccess(data.user));
      setFormData({});
    } catch (err) {
      dispatch(updatefailure(err.message));
    }
  }
  useEffect(() => {
    if (fileup) {
      handleUpload();
    }
  }, [fileup]);

  async function handledelete() {
    try {
      setdeleting(true);
      const res = await fetch(`/api/delete/${currentuser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteerror(data.message));
        setdeleting(false);
        return;
      }

      dispatch(deletesuccess());
      dispatch(clearListings());
      dispatch(clearProperties());
      setdeleting(false);
    } catch (err) {
      setdeleting(false);
      dispatch(deleteerror(err.message));
    }
  }
  async function handlesingout() {
    try {
      const res = await fetch(`/api/signout`);
      const data = await res.json();
      console.log("clicked");

      if (data.success === false) {
        dispatch(deleteerror(data.message));
        return;
      }

      dispatch(deletesuccess());
      dispatch(clearListings());
      dispatch(clearProperties());
    } catch (err) {
      dispatch(deleteerror(err.message));
    }
  }
  return (
    <>
      <div className="p-4 mx-auto w-full max-w-md bg-gray-100 mt-6 shadow-lg rounded-md">
        <h1 className="text-slate-900 text-center text-2xl sm:text-3xl font-bold">
          Profile
        </h1>

        <form
          className="flex flex-col gap-4 items-center mt-6"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileref}
            encType="multipart/form-data"
            name="pfp-pic"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <img
            src={currentuser.pfp}
            alt="Pfp"
            className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-full cursor-pointer object-cover hover:opacity-80 transition"
            onClick={() => fileref.current.click()}
          />

          {uploading === "uploading" ? (
            <p className="text-yellow-500">Uploading...</p>
          ) : ferror ? (
            <p className="text-red-500">{ferror}</p>
          ) : uploading === "success" ? (
            <p className="text-green-500">
              ✅ Upload successful, submit to update
            </p>
          ) : null}

          <input
            type="text"
            defaultValue={currentuser.username}
            placeholder="Username"
            id="username"
            className="bg-gray-200 rounded-md w-full max-w-sm p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />
          <input
            type="email"
            defaultValue={currentuser.email}
            placeholder="Email"
            id="email"
            className="bg-gray-200 rounded-md w-full max-w-sm p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            className="bg-gray-200 rounded-md w-full max-w-sm p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          />

          <button className="bg-gray-700 rounded-md w-full max-w-sm p-2 mt-2 text-white hover:opacity-90">
            {loading ? "Updating..." : "Update"}
          </button>

          <Link to="/create-listing" className="w-full max-w-sm">
            <button className="bg-green-700 w-full rounded-md p-2 mt-2 text-white hover:opacity-90">
              Create Listing
            </button>
          </Link>

          <div className="w-full max-w-sm mt-2 text-sm">
            {error ? (
              <p className="text-red-500 mb-1">{error}</p>
            ) : success ? (
              <p className="text-green-500 mb-1">✅ Update successful</p>
            ) : null}

            <div className="flex justify-between text-red-700">
              <span
                className="cursor-pointer active:scale-95"
                onClick={handledelete}
              >
                {deleting ? "Deleting" : "Delete Account"}
              </span>
              <span
                className="cursor-pointer active:scale-95"
                onClick={handlesingout}
              >
                Sign Out
              </span>
            </div>

            <NavLink
              className="flex justify-center text-green-600 mt-3 text-base hover:underline"
              to="/user-listings"
            >
              View Your Listings
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
