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
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  useEffect(() => {
    setSelectedFeatures(listing.features || []);
  }, [listing._id]);

  const propertyCategory = [
    "flat",
    "bungalow",
    "villa",
    "studio apartment",
    "builder floor",
  ].includes(propertyType)
    ? "residential"
    : "commercial";

  const fileref = useRef(0);
  const [formdata, setFormData] = useState({});

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
      e.preventDefault();
      const cleanedFormData = {};
      Object.keys(formdata).forEach((key) => {
        const value = formdata[key];

        if (typeof value === "string") {
          const trimmed = value.trim();
          if (trimmed !== "") {
            cleanedFormData[key] = trimmed;
          }
        } else if (Array.isArray(value)) {
          if (value.length > 0) {
            cleanedFormData[key] = value;
          }
        } else if (value !== null && value !== undefined) {
          cleanedFormData[key] = value;
        }
      });
      const specialOfferChanged =
        (formdata.specialOffer ?? "").trim() !==
        (listing.specialOffer ?? "").trim();

      const hasTextChanges = Object.keys(cleanedFormData).length > 0;
      const hasFeatureChanges =
        selectedFeatures.length !== listing.features.length ||
        !selectedFeatures.every((f) => listing.features.includes(f));

      const hasImageChanges =
        (formdata.newImages && formdata.newImages.length > 0) ||
        (formdata.newimgURLs && formdata.newimgURLs.length > 0) ||
        (formdata.imagesToDel && formdata.imagesToDel.length > 0);

      if (
        !hasTextChanges &&
        !hasFeatureChanges &&
        !hasImageChanges &&
        !specialOfferChanged
      ) {
        setUpdateError("No changes detected");
        return;
      }

      setUpdating("updating");

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

      const totalImages =
        (trimmedData.newimgURLs?.length || 0) + oldImages.length;
      if (totalImages === 0) {
        setUpdateError("At least 1 image is required");
        setUpdating("idle");
        return;
      }

      if (trimmedData.email && trimmedData.email !== listedBy?.contact?.email) {
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
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(trimmedData.phone.replace(/\D/g, ""))) {
          setUpdateError("Proper Indian Phone numer is required");
          setUpdating("idle");
          return;
        }
      }

      const {
        newImages,
        imagesToDel,
        newimgURLs,
        price,
        specialOffer,
        address,
        area,
        ...rest
      } = trimmedData;
      const payloadFeatures = selectedFeatures;

      const textData = {
        ...rest,
        features: payloadFeatures,
        area: area || listing.area,
        address: address || listing.location?.address || "",
        price: price || listing.price,

        ...(formdata.hasOwnProperty("specialOffer") && {
          specialOffer: (formdata.specialOffer ?? "").trim(),
        }),
      };

      const formData = new FormData();
      formData.append("text-data", JSON.stringify(textData));
      formData.append("newimgs", JSON.stringify(newimgURLs || []));
      formData.append("imgstodel", JSON.stringify(imagesToDel || []));
      formData.append("price", price || listing.price);
      formData.append("listingid", listing._id);

      console.log("Frontend sending:", {
        textData,
        price: price || listing.price,
        specialOffer: specialOffer || "",
      });

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
          listings.map((list, i) => (i !== index ? list : data.updatedlist)),
        ),
      );
    } catch (err) {
      setUpdating("idle");
      setUpdateError(err.message || "Something went wrong");
    }
  }

  async function handleUpload() {
    try {
      const totalCurrentImages =
        oldImages.length + (formdata.newImages?.length || 0);

      if (totalCurrentImages > 5) {
        setUploading("idle");
        setError("Maximum 5 images allowed");
        return;
      }

      if (formdata.newImages.length === 0) {
        setUploading("idle");
        setError("Please select images to upload");
        return;
      }

      setUploading("uploading");

      const formData = new FormData();
      formdata.newImages.forEach((file) =>
        formData.append("property-pics", file),
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

      setFormData({
        ...formdata,
        newimgURLs: [...(formdata.newimgURLs || []), ...data.uploadedurls],
        newImages: [], // Clear after successful upload
      });
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
      newImages: (prev.newImages || []).filter((_, i) => i !== index),
    }));
  }

  function handleOldDelete(index) {
    const imageToDelete = oldImages[index];

    setFormData((prev) => ({
      ...prev,
      imagesToDel: [...(prev.imagesToDel || []), imageToDelete],
    }));

    setOldImages((prev) => prev.filter((_, i) => i !== index));
  }

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
    <div className="max-w-6xl mx-auto p-4 pt-24">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">
        Update Your Listing
      </h1>

      <form
        className="bg-white shadow-lg rounded-xl p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
        onSubmit={handleUpdate}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter property title"
              id="title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              defaultValue={title}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
              required
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-700">Locked Information</h3>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Listing Type
              </label>
              <div className="flex gap-6">
                <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  {listingType}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Property Category
              </label>
              <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg capitalize">
                {propertyCategory}
              </span>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Property Type
              </label>
              <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg capitalize">
                {propertyType}
              </span>
            </div>

            {propertyCategory === "residential" && (
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  BHK Configuration
                </label>
                <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
                  {bhk || "Not specified"}
                </span>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Locality
              </label>
              <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg capitalize">
                {propertyLocation.locality}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              placeholder="Describe your property in detail..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 resize-none"
              defaultValue={description}
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  defaultValue={price}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (sq.ft) *
                </label>
                <input
                  type="number"
                  id="area"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  defaultValue={area}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Offer
              </label>
              <textarea
                id="specialOffer"
                value={formdata.specialOffer ?? specialOffer ?? ""}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 resize-none"
                onChange={(e) =>
                  setFormData((p) => ({ ...p, specialOffer: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Features
            </label>
            <div className="border border-gray-300 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {featuresList.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature)}
                      onChange={(e) => {
                        setSelectedFeatures((prev) =>
                          e.target.checked
                            ? [...prev, feature]
                            : prev.filter((f) => f !== feature),
                        );
                      }}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {selectedFeatures.length} features
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <div className="flex flex-wrap gap-3">
              {["available", "rented", "sold", "under negotiation"].map(
                (stat) => (
                  <label key={stat} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={stat}
                      name="status"
                      checked={(formdata.status ?? status) === stat}
                      onChange={(e) =>
                        setFormData({ ...formdata, status: e.target.value })
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="capitalize text-gray-700">{stat}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Contact Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                id="name"
                defaultValue={listedBy?.name}
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  defaultValue={listedBy?.contact?.email}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="10-digit number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  defaultValue={listedBy?.contact?.phone}
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complete Address *
            </label>
            <textarea
              id="address"
              placeholder="Enter full address including landmark, street, etc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24 resize-none"
              defaultValue={propertyLocation.address}
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">
                Images ({oldImages.length + (formdata.newimgURLs?.length || 0)}
                /5)
              </label>
              <span className="text-xs text-gray-500">
                At least 1 image required
              </span>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => fileref.current.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Add Images
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={
                    uploading === "uploading" || !formdata.newImages?.length
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading === "uploading" ? "Uploading..." : "Upload Images"}
                </button>
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files);
                  const totalAfterNew =
                    oldImages.length +
                    (formdata.newimgURLs?.length || 0) +
                    files.length;

                  if (totalAfterNew > 5) {
                    setError(
                      `Maximum 5 images allowed. You have ${oldImages.length + (formdata.newimgURLs?.length || 0)} existing.`,
                    );
                    return;
                  }

                  setFormData({
                    ...formdata,
                    newImages: [...(formdata.newImages || []), ...files],
                  });
                }}
                multiple
                ref={fileref}
              />

              {ferror && <p className="text-red-500 text-sm mb-2">{ferror}</p>}
              {uploading === "success" && (
                <p className="text-green-500 text-sm mb-2">
                  ✅ Upload successful
                </p>
              )}

              <div className="space-y-3">
                {oldImages.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Existing Images
                    </p>
                    <div className="space-y-2">
                      {oldImages.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={image.imageurl}
                              alt={`existing-${index}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-sm text-gray-600">
                              Existing image {index + 1}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOldDelete(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formdata.newImages?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      New Images to Upload
                    </p>
                    <div className="space-y-2">
                      {formdata.newImages?.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-blue-50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`new-${index}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-sm text-gray-600">
                              {image.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleNewDelete(index)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 bg-red-50 rounded"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formdata.newimgURLs && formdata.newimgURLs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Newly Uploaded Images
                    </p>
                    <div className="space-y-2">
                      {formdata.newimgURLs.map((image, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-green-50 rounded"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={image.imageurl}
                              alt={`uploaded-${index}`}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <span className="text-sm text-gray-600">
                              Uploaded image {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={update === "updating"}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {update === "updating" ? "Updating..." : "Update Listing"}
            </button>

            {update === "success" && (
              <p className="text-green-600 text-center mt-2">
                ✅ Listing updated successfully!
              </p>
            )}
            {updateerror && (
              <p className="text-red-500 text-center mt-2">{updateerror}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default UpdateListing;
