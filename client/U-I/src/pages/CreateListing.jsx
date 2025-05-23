import { useState, useEffect, useRef } from "react";
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
      if (formdata.images.length === 0) {
        setCreateError("Atleast 1 image required");
        setCreateUploading("idle");
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

      dispatch(setListing(data.newlisting));
    } catch (err) {
      setCreateUploading("idle");
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
      <h1 className="text-center text-black font-bold mt-4 text-xl sm:text-2xl">
        Create Listing
      </h1>
      {listings.length > 0 && (
        <p className="text-green-500 text-lg sm:text-2xl font-bold flex justify-center mt-3 text-center px-2">
          View Your Existing Listings{" "}
          <NavLink
            to="/user-listings"
            className="text-green-700 hover:underline ml-2"
          >
            Here
          </NavLink>
        </p>
      )}
      <form
        className="bg-gray-200 mx-auto flex flex-col md:flex-row p-4 sm:p-6 justify-between gap-6 rounded-xl max-w-5xl mt-4"
        onSubmit={handleSubmit}
      >
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
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

            <div className="w-full">
              <label htmlFor="listingType" className="block text-black mb-1">
                Listing Type :
              </label>
              <div className="flex flex-wrap gap-4">
                <label>
                  <input
                    type="radio"
                    value="rent"
                    id="listingType"
                    name="listing-type"
                    className="mr-2"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        [e.target.id]: e.target.value,
                      })
                    }
                  />
                  Rent
                </label>
                <label>
                  <input
                    type="radio"
                    value="sale"
                    id="listingType"
                    name="listing-type"
                    className="mr-2"
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        [e.target.id]: e.target.value,
                      })
                    }
                  />
                  Sale
                </label>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="flex flex-wrap gap-4">
                {["villa", "bungalow", "flat", "office space"].map((type) => (
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

            <textarea
              id="description"
              placeholder="Enter description of property"
              className="p-2 w-full h-36 bg-white text-black rounded-lg resize-none"
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            ></textarea>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-black mb-1">
                  Price :
                </label>
                <input
                  type="number"
                  id="price"
                  className="p-2 bg-white text-black rounded-lg"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="1000"
                />
                <label htmlFor="specialOffer" className="text-black mb-1">
                  Special Offer :
                </label>
                <textarea
                  id="specialOffer"
                  className="p-2 bg-white text-black h-24 rounded-lg resize-none"
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label htmlFor="features" className="text-black mb-1 block">
                  Features:
                </label>
                <textarea
                  placeholder="features"
                  className="p-2 bg-white text-black h-28 w-full rounded-lg resize-none"
                  id="features"
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="w-full mt-2">
              <label htmlFor="status" className="block text-black mb-1">
                Status:
              </label>
              <input
                type="radio"
                value="Available"
                name="status"
                className="mr-2"
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

        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            <label className="block text-black mb-2">Address</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="p-2 bg-white text-black rounded-lg sm:col-span-2"
                id="streetAddress"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
            </div>

            <label className="block text-black mb-2 mt-4">
              Details of Lister
            </label>
            <input
              type="text"
              placeholder="name"
              id="name"
              className="p-2 w-full bg-white text-black rounded-lg"
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              className="p-2 w-full bg-white text-black rounded-lg"
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="phone"
              id="phone"
              className="p-2 w-full bg-white text-black rounded-lg"
              pattern="[0-9]{10}"
              required
              title="Phone number must be 10 digits"
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />

            <label htmlFor="images" className="mt-3 text-black block">
              Upload your Images:
              <span className="text-slate-400 ml-2">Only 5 images</span>
            </label>

            <div className="w-full bg-white rounded-2xl shadow-md p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label
                  className="text-sm font-medium text-gray-700 hover:underline cursor-pointer"
                  onClick={() => fileref.current.click()}
                >
                  Upload an image
                </label>
                <p className="text-red-500">
                  Images: <span className="ml-2">{fileup.length}</span>
                </p>
                <div className="flex items-center gap-2">
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
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {uploading === "uploading" && (
                <p className="text-yellow-500">Uploading...</p>
              )}
              {ferror && <p className="text-red-400">{ferror}</p>}
              {uploading === "success" && (
                <p className="text-green-400">✅ Upload successful</p>
              )}

              {fileup.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  {fileup.map((image, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-12 h-12 object-cover"
                        alt={`upload-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="text-red-500 text-xs font-semibold hover:text-red-600"
                      >
                        DELETE
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 mt-6">
              <button
                type="submit"
                className="bg-green-800 rounded-lg w-72 p-2 text-white hover:opacity-90 transition-transform duration-150 active:scale-110"
              >
                Submit
              </button>

              {Cuploading === "uploading" && (
                <p className="text-green-400">Creating</p>
              )}
              {Cuploading === "success" && (
                <p className="text-green-500">Uploaded</p>
              )}
              {Cerror && <p className="text-red-500">{Cerror}</p>}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default CreateListing;
