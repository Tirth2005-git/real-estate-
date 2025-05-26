import { useState, useEffect, useRef } from "react";
import { UpdateList } from "../redux/listingslice.jsx";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdateListing() {
  const location = useLocation();

  const index = location.state.index;

  const { currentuser } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);

  const {
    title,
    address,
    description,
    features,
    listedBy,
    specialOffer,
    price,
    propertyType,
    listingType,
    status,
  } = listings[index];

  const fileref = useRef(0);
  const [formdata, setFormData] = useState({
    title,
    description,
    features,
    price,
    specialOffer,
    status,
    propertyType,
    listingType,
    state: address.state,
    city: address.city,
    zipcode: address.zipcode,
    streetAddress: address.streetAddress,
    name: listedBy.name,
    email: listedBy.contact.email,
    phone: listedBy.contact.phone,
    newImages: [],
    imagesToDel: [],
    newimgURLs: [],
  });
  const dispatch = useDispatch();

  const [ferror, setError] = useState();
  const [updateerror, setUpdateError] = useState();
  const [uploading, setUploading] = useState("idile");
  const [update, setUpdating] = useState("idile");
  const [oldImages, setOldImages] = useState(() => [...listings[index].images]);

  useEffect(() => {
    if (uploading === "success") {
      const timer = setTimeout(() => {
        setUploading("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploading]);

  useEffect(() => {
    if (update === "success") {
      const timer = setTimeout(() => {
        setUpdating("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [update]);

  async function handleUpdate(e) {
    try {
      setUpdating("updating");
      e.preventDefault();
      if (formdata.newimgURLs.length + oldImages.length === 0) {
        setUpdateError("Atleast 1 image is required");
        setUpdating("idle");
        return;
      }
      const {
        newImages,
        imagesToDel,
        newimgURLs,
        price,
        specialOffer,
        ...rest
      } = formdata;
      const formData = new FormData();
      formData.append("text-data", JSON.stringify(rest));

      formData.append("newimgs", JSON.stringify(newimgURLs));

      formData.append("imgstodel", JSON.stringify(imagesToDel));

      formData.append("price", price);

      formData.append("listingid", JSON.stringify(listings[index]._id));

      if (!formdata.specialOffer) {
        formData.append("specialoffer", JSON.stringify(" "));
      } else {
        formData.append("specialoffer", JSON.stringify(formdata.specialOffer));
      }

      const res = await fetch(`/api/update/listing/${currentuser._id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success === false) {
        setUpdating("idle");
        setUpdateError(data.message);
        return;
      }
      setUpdating("success");
      setUpdateError(null);
      dispatch(
        UpdateList(
          listings.map((list, i) => (i != index ? list : data.updatedlist))
        )
      );
    } catch (err) {
      setUpdating("idle");
      setUpdateError(err.message);
    }
  }

  async function handleUpload() {
    try {
      setUploading("uploading");

      if (
        oldImages.length + formdata.newImages.length > 5 ||
        formdata.newImages.length == 0
      ) {
        setUploading("idle");
        setError("Invalid file quantity");
        return;
      }

      const formData = new FormData();
      formdata.newImages.forEach((file) =>
        formData.append("property-pics", file)
      );

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
      setFormData({ ...formdata, newimgURLs: data.uploadedurls });
      setUploading("success");
      setError(null);
    } catch (err) {
      setUploading("idle");
      setError(err.message);
    }
  }
  function handleNewDelete(index) {
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  }
  function handleOldDelete(index) {
    const imageToDelete = oldImages[index];

    setFormData((prev) => ({
      ...prev,
      imagesToDel: [...prev.imagesToDel, imageToDelete],
    }));

    setOldImages((prev) => prev.filter((_, i) => i !== index));
  }
  return (
    <>
      <h1 className="text-center text-black font-bold mt-4 text-xl sm:text-2xl">
        Update Your Listing
      </h1>

      <form
        className="bg-gray-200 mx-auto flex flex-col md:flex-row p-4 sm:p-6 justify-between gap-6 rounded-xl max-w-5xl mt-4"
        onSubmit={handleUpdate}
      >
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="Title"
              id="title"
              className="p-2 w-full bg-white text-black rounded-lg"
              defaultValue={title}
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
                    checked={formdata.listingType === "rent"}
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
                    checked={formdata.listingType === "sale"}
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
                          propertyType: e.target.value,
                        })
                      }
                      className="text-blue-600 focus:ring-blue-500"
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
              defaultValue={description}
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
                  defaultValue={price}
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
                  defaultValue={specialOffer}
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
                  defaultValue={features}
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
              {["Available", "Rented", "Sold", "Under Negotiations"].map(
                (status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={status}
                      name="status"
                      className="mr-2"
                      checked={formdata.status === status}
                      onChange={(e) =>
                        setFormData({
                          ...formdata,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    {status}
                  </label>
                )
              )}
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
                defaultValue={address.state}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City"
                className="p-2 bg-white text-black rounded-lg"
                id="city"
                defaultValue={address.city}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Zipcode"
                className="p-2 bg-white text-black rounded-lg"
                id="zipcode"
                defaultValue={address.zipcode}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Street Address"
                className="p-2 bg-white text-black rounded-lg sm:col-span-2"
                id="streetAddress"
                defaultValue={address.streetAddress}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
            </div>

            {/* Lister Details */}
            <label className="block text-black mb-2 mt-4">
              Details of Lister
            </label>
            <input
              type="text"
              placeholder="name"
              id="name"
              className="p-2 w-full bg-white text-black rounded-lg"
              defaultValue={listedBy.name}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="email"
              id="email"
              className="p-2 w-full bg-white text-black rounded-lg"
              defaultValue={listedBy.contact.email}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="phone"
              id="phone"
              pattern="[0-9]{10}"
                   title="Phone number must be 10 digits "
              className="p-2 w-full bg-white text-black rounded-lg"
              defaultValue={listedBy.contact.phone}
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
                  Select an image
                </label>
                <p className="text-red-500">
                  Images:{" "}
                  <span className="ml-2">
                    {oldImages.length + formdata.newImages.length}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      setFormData({
                        ...formdata,
                        newImages: Array.from(e.target.files),
                      })
                    }
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

              {formdata.newImages && formdata.newImages.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  {formdata.newImages.map((image, index) => (
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
                        onClick={() => handleNewDelete(index)}
                        className="text-red-500 text-xs font-semibold hover:text-red-600"
                      >
                        DELETE
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {oldImages && oldImages.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">
                  {oldImages.map((image, index) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                    >
                      <img
                        src={image.imageurl}
                        className="w-12 h-12 object-cover"
                        alt={`old-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleOldDelete(index)}
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
                Update
              </button>

              {update === "updating" && (
                <p className="text-green-400">Updating</p>
              )}
              {update === "success" && (
                <p className="text-green-500">Updated</p>
              )}
              {updateerror && <p className="text-red-500">{updateerror}</p>}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
export default UpdateListing;
