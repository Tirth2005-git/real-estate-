import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { clearListings } from "../redux/listingslice.jsx";
import {
  updatestart,
  updatesucccess,
  updatefailure,
  deleteerror,
  deletesuccess,
} from "../redux/userslice.jsx";
import { Link, useNavigate, NavLink } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const fileref = useRef();
  const [fileup, setFile] = useState(0);
  const [uploading, setUploading] = useState("idile");
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
      }

      setFormData({
        ...formData,
        avatar: data.url,
        imageid: data.imageid,
      });
      setUploading("success");
    } catch (err) {
      setError(err.message);
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
      const res = await fetch(`/api/delete/${currentuser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteerror(data.message));
        return;
      }
      console.log(data.success);
      dispatch(deletesuccess());
      dispatch(clearListings());
    } catch (err) {
      dispatch(deleteerror(err.message));
    }
  }
  async function handlesingout() {
    try {
      const res = await fetch(`/api/signout`);
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteerror(data.message));
        return;
      }

      dispatch(deletesuccess());
      dispatch(clearListings());
    } catch (err) {
      dispatch(deleteerror(err.message));
    }
  }
  return (
    <>
      <div className="p-3 mx-auto max-w-lg  bg-gray-100 mt-4  shadow-lg rounded-md">
        <h1 className="text-slate-900 text-center text-3xl font-bold mt-4">
          Profile
        </h1>
        {}
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
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          ></input>
          <img
            src={currentuser.pfp}
            alt="Pfp"
            className="h-7 w-6 sm:h-20 sm:w-20 rounded-full self-center cursor-pointer"
            onClick={() => fileref.current.click()}
          ></img>
          {uploading === "uploading" ? (
            <p className="text-yellow-500">Uploading...</p>
          ) : ferror ? (
            <p className="text-red-400">{ferror}</p>
          ) : uploading === "success" ? (
            <p className="text-green-400">
              ✅ Upload successful ,submit to update
            </p>
          ) : null}

          <input
            type="text"
            defaultValue={currentuser.username}
            placeholder="username"
            id="username"
            className="bg-gray-200 rounded-lg w-72 p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          ></input>
          <input
            type="email"
            defaultValue={currentuser.email}
            placeholder="email"
            id="email"
            className="bg-gray-200 rounded-lg w-72 p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          ></input>
          <input
            type="password"
            placeholder="password"
            id="password"
            className="bg-gray-200 rounded-lg w-72 p-2"
            onChange={(e) =>
              setFormData({ ...formData, [e.target.id]: e.target.value })
            }
          ></input>
          <button className="bg-gray-400 rounded-lg w-72 p-2 mt-3 text-gray-900 hover:opacity-90">
            {loading ? (
              <p className="text-white">Updating...</p>
            ) : (
              <p className="text-white">Update</p>
            )}
          </button>
          <Link to="/create-listing">
            <button className="bg-green-800 rounded-lg w-72 p-2 mt-2 text-white hover:opacity-90">
              Create Listing
            </button>
          </Link>

          <div className="w-72 mt-2 text-sm">
            {error ? (
              <p className="text-red-500 mb-1">{error}</p>
            ) : success ? (
              <p className="text-green-400 mb-1">✅ Update successful</p>
            ) : null}

            <div className="flex justify-between text-red-700 ">
              <span
                className="cursor-pointer active:scale-50"
                onClick={handledelete}
              >
                Delete Account
              </span>
              <span
                className="cursor-pointer active:scale-50"
                onClick={handlesingout}
              >
                Sign Out
              </span>
            </div>
            <NavLink
              className="flex text-green-500 justify-center mt-3 text-lg cursor-pointer active:scale-50"
              to="/user-listings"
            >
              View Your listings
            </NavLink>
          </div>
        </form>
      </div>
    </>
  );
}

export default Profile;
