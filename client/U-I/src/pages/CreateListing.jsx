import { useState, useEffect,useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setListing } from "../redux/listingslice.jsx";
function CreateListing() {
  const [formdata, setFormData] = useState({
    images: [],
  });
  const dispatch = useDispatch();
  const fileref = useRef(0);
  const [fileup, setFile] = useState([]);
  const [ferror, setError] = useState();
  const [Cerror, setCreateError] = useState();
  const [uploading, setUploading] = useState("idile");
  const [Cuploading, setCreateUploading] = useState("idile");
  const { currentuser } = useSelector((state) => state.user);
  useEffect(() => {
    if (uploading === "success") {
      const timer = setTimeout(() => {
        setUploading("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploading]);

  useEffect(() => {
    if (Cuploading === "success") {
      const timer = setTimeout(() => {
        setCreateUploading("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploading]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!formdata) {
        return;
      }
      if (!formdata.status) {
        formdata.status = "available";
      }
      setCreateUploading("uploading");
      const res = await fetch(`/api/list/${currentuser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formdata: { ...formdata, userref: currentuser._id },
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setCreateUploading("idle");
        setCreateError(data.message);
        return;
      }
      setCreateUploading("success");
      setCreateError(null);
      console.log(data.newlisting);

      dispatch(setListing(data.newlisting));
    } catch (err) {
      setCreateUploading("success");
      setCreateError(null);
    }
  }
  async function handleUpload() {
    try {
      setUploading("uploading");

      if (!fileup || fileup.length == 0 || fileup.length > 5) {
        setUploading("idle");
        setError("Invalid file quantity");
        return;
      }

      const formData = new FormData();
      fileup.forEach((file) => formData.append("property-pics", file));

      const res = await fetch("/api/mult/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success === false) {
        setUploading("idle");
        setError(data.message);
        return;
      }
      setFormData({ ...formdata, images: data.uploadedurls });
      setUploading("success");
      setError(null);
    } catch (err) {
      setUploading("idle");
      setError(err.message);
    }
  }
  function handleDelete(index) {
    setFile(fileup.filter((image, i) => i != index));
  }
  const { listings } = useSelector((state) => state.listings);

  return (
    <>
      <h1 className="text-center text-black font-bold mt-4 sm:text-2xl">
        Create Listing
      </h1>
      {listings.length > 0 ? (
        <p className="text-green-500 text-2xl font-bold flex justify-center mt-3">
          View Your Existing Listings{" "}
          <NavLink
            to="/user-listings"
            className="text-green-700 hover:underline ml-2"
          >
            Here
          </NavLink>
        </p>
      ) : null}
      <form
        className="bg-gray-200 mx-auto flex p-5 justify-between gap-6 rounded-xl max-w-4xl mt-3"
        onSubmit={handleSubmit}
      >
        <div className="w-1/2">
          <div className="flex flex-col gap-4 p-4  w-full">
            <div className="w-full">
              <input
                type="text"
                placeholder="Title"
                id="title"
                className="p-2 w-full bg-white text-black rounded-lg"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
            </div>

            <div className="w-full">
              <label htmlFor="listingType" className="block text-black mb-1">
                Listing Type :
              </label>
              <input
                type="radio"
                value="rent"
                id="listingType"
                name="listing-type"
                className="text-2xl mr-3"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></input>
              Rent
              <input
                type="radio"
                value="sale"
                id="listingType"
                name="listing-type"
                className="text-2xl ml-3 mr-3"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></input>
              Sale
            </div>

            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="flex gap-4">
                {["villa", "bungalow", "flat"].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="propertyType"
                      id="propertyType"
                      value={type}
                      checked={formdata.propertyType === type}
                      onChange={(e) =>
                        setFormData({
                          ...formdata,
                          [e.target.id]: e.target.value,
                        })
                      }
                      className="text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="capitalize text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full">
              <textarea
                id="description"
                placeholder="Enter description of property"
                className="p-2 w-full h-40 bg-white text-black rounded-lg resize-none"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-9">
              <div className="flex flex-col gap-2">
                <div>
                  <label htmlFor="price" className="block text-black mb-1">
                    Price :
                  </label>
                  <input
                    type="number"
                    id="price"
                    className="p-2 bg-white text-black rounded-lg  "
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        [e.target.id]: e.target.value,
                      })
                    }
                    min="1000"
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="specialOffer"
                    className=" block text-black mb-1"
                  >
                    Special Offer :
                  </label>
                  <textarea
                    id="specialOffer"
                    className="p-2 bg-white text-black  h-32  rounded-lg resize-none"
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        [e.target.id]: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="features"
                  className="p-2  bg-white text-black   h-36 w-44 rounded-lg resize-none"
                  id="features"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="status" className="block text-black mb-1">
                Status:
              </label>
              <input
                type="radio"
                value="Available"
                name="status"
                className="text-2xl mr-3"
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.name]: e.target.value })
                }
                checked
                required
              />
              Available
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="flex flex-col gap-4 p-4  w-full">
            <div className="w-full">
              <label className="block text-black mb-2">Address</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="State"
                  className="p-2 bg-white text-black rounded-lg"
                  id="state"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  className="p-2 bg-white text-black rounded-lg"
                  id="city"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Zipcode"
                  className="p-2 bg-white text-black rounded-lg"
                  id="zipcode"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Street Address"
                  className="p-2 bg-white text-black rounded-lg col-span-2"
                  id="streetAddress"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="w-full flex flex-col gap-3">
              <label className="block text-black mb-2">Details of Lister</label>
              <input
                type="text"
                placeholder="name"
                id="name"
                className="p-2 w-full bg-white text-black rounded-lg"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></input>
              <input
                type="email"
                placeholder="email"
                id="email"
                className="p-2 w-full bg-white text-black rounded-lg"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></input>
              <input
                type="tel"
                placeholder="phone"
                id="phone"
                className="p-2 w-full bg-white text-black rounded-lg"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              ></input>
              <label htmlFor="images" className="mt-3">
                <span className="text-black block">
                  Upload your Images:
                  <span className="text-slate-400 mr-1.5">Only 5 images</span>
                </span>
              </label>
              <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
                <div className="flex justify-between">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-2 hover:underline"
                    onClick={() => fileref.current.click()}
                  >
                    Upload an image
                  </label>
                  <p className="text-red-500">
                    Images:
                    <span className="ml-2">{fileup.length}</span>
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      id="images"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFile(Array.from(e.target.files))}
                      multiple
                      name="property-pics"
                      ref={fileref}
                    />

                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700
                     text-white text-sm font-semibold py-2 px-4 rounded-md transition duration-200"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>

                {uploading === "uploading" ? (
                  <p className="text-yellow-500">Uploading...</p>
                ) : ferror ? (
                  <p className="text-red-400">{ferror}</p>
                ) : uploading === "success" ? (
                  <p className="text-green-400">✅ Upload successful</p>
                ) : null}
                {fileup && fileup.length > 0 && (
                  <div className="flex flex-col gap-4 mt-4">
                    {fileup.map((image, index) => (
                      <div
                        key={index}
                        className="flex justify-between p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          className="w-12 h-12"
                        ></img>
                        <button
                          type="button"
                          onClick={() => handleDelete(index)}
                          className="mt-1 text-red-500 text-xs font-semibold hover:text-red-600 transition"
                        >
                          DELETE
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="submit"
                  className="bg-green-800 rounded-lg w-72 p-2 mt-2 text-white hover:opacity-90 transition-transform duration-150 active:scale-110"
                >
                  Submit
                </button>
                {Cuploading === "uploading" ? (
                  <p className="text-green-400">Creating</p>
                ) : Cuploading === "success" ? (
                  <p className="text-green-500">Uploaded</p>
                ) : null}

                {Cerror && <p className="text-red-500">{Cerror}</p>}
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default CreateListing;
