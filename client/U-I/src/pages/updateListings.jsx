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

  const listing = listings[index];
  const {
    title,
    location: propertyLocation,
    description,
    features,
    listedBy,
    specialOffer,
    price,
    propertyType,
    listingType,
    status,
    bhk,
    area,
    images,
  } = listing;

  const [propertyCategory, setPropertyCategory] = useState(
    ["flat", "bungalow", "villa", "studio apartment", "builder floor"].includes(
      propertyType
    )
      ? "residential"
      : "commercial"
  );

  const fileref = useRef(0);
  const [formdata, setFormData] = useState({
    title: title || "",
    description: description || "",
    features: features || [],
    price: price || "",
    specialOffer: specialOffer || "",
    status: status || "available",
    propertyType: propertyType || "",
    listingType: listingType || "",
    bhk: bhk || "",
    area: area || "",
    locality: propertyLocation?.locality || "",
    address: propertyLocation?.address || "",
    name: listedBy?.name || "",
    email: listedBy?.contact?.email || "",
    phone: listedBy?.contact?.phone || "",
    newImages: [],
    imagesToDel: [],
    newimgURLs: [],
  });

  const dispatch = useDispatch();
  const [ferror, setError] = useState();
  const [updateerror, setUpdateError] = useState();
  const [uploading, setUploading] = useState("idle");
  const [update, setUpdating] = useState("idle");
  const [oldImages, setOldImages] = useState(() => [...images]);

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
      if (Object.keys(formdata).length === 0) {
        dispatch(updatefailure("Please Enter Credentials To update"));
        return;
      }
      setUpdating("updating");
      e.preventDefault();

      const trimmedData = {};
      Object.keys(formdata).forEach((key) => {
        if (typeof formdata[key] === "string" && formdata[key] !== "") {
          trimmedData[key] = formdata[key].trim();
        } else if (Array.isArray(formdata[key])) {
          trimmedData[key] = formdata[key];
        } else {
          trimmedData[key] = formdata[key];
        }
      });

      if (trimmedData.newimgURLs.length + oldImages.length === 0) {
        setUpdateError("At least 1 image is required");
        setUpdating("idle");
        return;
      }

      if (
        trimmedData.email &&
        trimmedData.email !== listings[index].listedBy.contact.email
      ) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedData.email)) {
          setUpdateError("Please enter a valid email address");
          setUpdating("idle");
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

        const domain = trimmedData.email.split("@")[1];
        if (!allowedDomains.includes(domain)) {
          setUpdateError("Please use Gmail, Yahoo, Outlook, Hotmail, etc.");
          setUpdating("idle");
          return;
        }
      }

      if (trimmedData.phone) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(trimmedData.phone.replace(/\D/g, ""))) {
          setUpdateError("Phone number must be 10 digits");
          setUpdating("idle");
          return;
        }
      }

      if (!trimmedData.status || trimmedData.status === "") {
        trimmedData.status = "available";
      }

      setFormData(trimmedData);

      const {
        newImages,
        imagesToDel,
        newimgURLs,
        price,
        specialOffer,
        locality,
        address,
        bhk,
        area,
        ...rest
      } = trimmedData;

      const textData = {
        ...rest,
        bhk: bhk || null,
        area: area || 100,
        locality: locality || "",
        address: address || "",
      };

      const formData = new FormData();
      formData.append("text-data", JSON.stringify(textData));
      formData.append("newimgs", JSON.stringify(newimgURLs));
      formData.append("imgstodel", JSON.stringify(imagesToDel));
      formData.append("price", price);
      formData.append("listingid", JSON.stringify(listings[index]._id));
      formData.append("specialoffer", JSON.stringify(specialOffer || ""));

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
          listings.map((list, i) => (i !== index ? list : data.updatedlist))
        )
      );
    } catch (err) {
      setUpdating("idle");
      setUpdateError(err.message || "Something went wrong");
    }
  }

  async function handleUpload() {
    try {
      setUploading("uploading");

      if (
        oldImages.length + formdata.newImages.length > 5 ||
        formdata.newImages.length === 0
      ) {
        setUploading("idle");
        setError("Invalid file quanity");
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

  const residentialTypes = [
    "flat",
    "bungalow",
    "villa",
    "studio apartment",
    "builder floor",
  ];
  const commercialTypes = [
    "office space",
    "shop",
    "showroom",
    "warehouse",
    "industrial",
  ];

  const mumbaiLocalities = [
    "Andheri",
    "Bandra",
    "Borivali",
    "Dadar",
    "Goregaon",
    "Malad",
    "Powai",
    "Thane",
    "Chembur",
    "Kandivali",
    "Juhu",
    "Santacruz",
    "Lower Parel",
    "Worli",
    "Colaba",
  ];

  const residentialFeatures = [
    "Swimming Pool",
    "Gym",
    "Club House",
    "Children's Play Area",
    "24/7 Security",
    "Lift/Elevator",
    "Car Parking",
    "Garden/Lawn",
    "Intercom",
    "Wi-Fi Ready",
    "CCTV Surveillance",
    "Shopping Center Nearby",
    "School Nearby",
    "Hospital Nearby",
    "Public Transport Access",
    "Balcony/Terrace",
    "Modular Kitchen",
    "Air Conditioning",
    "Geyser",
  ];
  const commercialFeatures = [
    "24/7 Security",
    "Lift/Elevator",
    "Car Parking",
    "Wi-Fi Ready",
    "CCTV Surveillance",
    "Public Transport Access",
    "Air Conditioning",
    "Conference Room",
    "Pantry",
    "Reception Area",
    "Modular Furniture",
    "Toilets",
    "Storage Space",
    "Separate Entrance",
    "Metro Station Nearby",
    "Bank Nearby",
    "Restaurant Nearby",
  ];
  const featuresList =
    propertyCategory === "residential"
      ? residentialFeatures
      : commercialFeatures;

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
              value={formdata.title}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />

            <div className="w-full">
              <label htmlFor="listingType" className="block text-black mb-1">
                Listing Type:
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
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
                <label className="flex items-center">
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
                Property Category
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="propertyCategory"
                    value="residential"
                    checked={propertyCategory === "residential"}
                    onChange={(e) => setPropertyCategory(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Residential</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="propertyCategory"
                    value="commercial"
                    checked={propertyCategory === "commercial"}
                    onChange={(e) => setPropertyCategory(e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Commercial</span>
                </label>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="flex flex-wrap gap-4">
                {(propertyCategory === "residential"
                  ? residentialTypes
                  : commercialTypes
                ).map((type) => (
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
                    />
                    <span className="capitalize text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {propertyCategory === "residential" && (
              <div className="w-full">
                <label htmlFor="bhk" className="block text-black mb-1">
                  BHK Configuration:
                </label>
                <select
                  id="bhk"
                  className="p-2 w-full bg-white text-black rounded-lg"
                  value={formdata.bhk}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                >
                  <option value="">Select BHK</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Studio">Studio</option>
                </select>
              </div>
            )}

            <textarea
              id="description"
              placeholder="Enter description of property"
              className="p-2 w-full h-36 bg-white text-black rounded-lg resize-none"
              value={formdata.description}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            ></textarea>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="price" className="text-black mb-1">
                  Price (₹):
                </label>
                <input
                  type="number"
                  id="price"
                  className="p-2 bg-white text-black rounded-lg"
                  value={formdata.price}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="1000"
                />

                <label htmlFor="area" className="text-black mb-1">
                  Area (sq.ft):
                </label>
                <input
                  type="number"
                  id="area"
                  className="p-2 bg-white text-black rounded-lg"
                  value={formdata.area}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="100"
                />

                <label htmlFor="specialOffer" className="text-black mb-1">
                  Special Offer:
                </label>
                <textarea
                  id="specialOffer"
                  className="p-2 bg-white text-black h-24 rounded-lg resize-none"
                  value={formdata.specialOffer}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                ></textarea>
              </div>

              <div>
                <label className="text-black mb-1 block">Features:</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded">
                  {featuresList.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        checked={formdata.features.includes(feature)}
                        onChange={(e) => {
                          let newFeatures = [...formdata.features];
                          if (e.target.checked) {
                            newFeatures.push(feature);
                          } else {
                            newFeatures = newFeatures.filter(
                              (f) => f !== feature
                            );
                          }
                          setFormData({
                            ...formdata,
                            features: newFeatures,
                          });
                        }}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Selected: {formdata.features.length} features
                </p>
              </div>
            </div>

            <div className="w-full mt-2">
              <label className="block text-black mb-1">Status:</label>
              {["available", "rented", "sold", "under negotiation"].map(
                (status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 mr-4"
                  >
                    <input
                      type="radio"
                      value={status}
                      name="status"
                      className="mr-2"
                      checked={formdata.status === status}
                      onChange={(e) =>
                        setFormData({
                          ...formdata,
                          status: e.target.value,
                        })
                      }
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            <label className="block text-black mb-2">Location Details</label>
            <div className="flex flex-col gap-3">
              <select
                id="locality"
                className="p-2 bg-white text-black rounded-lg"
                value={formdata.locality}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              >
                <option value="">Select Mumbai Locality</option>
                {mumbaiLocalities.map((locality) => (
                  <option key={locality} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Complete Address"
                className="p-2 bg-white text-black rounded-lg"
                id="address"
                value={formdata.address}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
            </div>

            <label className="block text-black mb-2 mt-4">
              Contact Details
            </label>
            <input
              type="text"
              placeholder="Your Name"
              id="name"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.name}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.email}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone Number"
              id="phone"
              pattern="[0-9]{10}"
              title="Phone number must be 10 digits"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.phone}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />

            {/* Image Upload */}
            <label htmlFor="images" className="mt-3 text-black block">
              Upload Images:
              <span className="text-slate-400 ml-2">Maximum 5 images</span>
            </label>

            <div className="w-full bg-white rounded-2xl shadow-md p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <label
                  className="text-sm font-medium text-gray-700 hover:underline cursor-pointer"
                  onClick={() => fileref.current.click()}
                >
                  Select images
                </label>
                <p className="text-red-500">
                  Images:{" "}
                  <span className="ml-2">
                    {oldImages.length + formdata.newImages.length}/5
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
                    disabled={uploading === "uploading"}
                  >
                    {uploading === "uploading" ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              {uploading === "uploading" && (
                <p className="text-yellow-500 mt-2">Uploading...</p>
              )}
              {ferror && <p className="text-red-400 mt-2">{ferror}</p>}
              {uploading === "success" && (
                <p className="text-green-400 mt-2">✅ Upload successful</p>
              )}

              {formdata.newImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Images:
                  </p>
                  <div className="flex flex-col gap-2">
                    {formdata.newImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          className="w-12 h-12 object-cover rounded"
                          alt={`new-${index}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleNewDelete(index)}
                          className="text-red-500 text-xs font-semibold hover:text-red-600 px-3 py-1 bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {oldImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Existing Images:
                  </p>
                  <div className="flex flex-col gap-2">
                    {oldImages.map((image, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded-lg border border-gray-200 bg-white shadow-sm"
                      >
                        <img
                          src={image.imageurl}
                          className="w-12 h-12 object-cover rounded"
                          alt={`old-${index}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleOldDelete(index)}
                          className="text-red-500 text-xs font-semibold hover:text-red-600 px-3 py-1 bg-red-50 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-3 mt-6">
              <button
                type="submit"
                className="bg-green-800 rounded-lg w-72 p-2 text-white hover:opacity-90 transition-transform duration-150 active:scale-110 disabled:opacity-50"
                disabled={update === "updating"}
              >
                {update === "updating" ? "Updating..." : "Update Listing"}
              </button>

              {update === "success" && (
                <p className="text-green-500">
                  ✅ Listing Updated Successfully!
                </p>
              )}
              {updateerror && (
                <p className="text-red-500 text-center">{updateerror}</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default UpdateListing;
