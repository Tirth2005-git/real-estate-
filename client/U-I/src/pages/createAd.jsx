import { useState } from "react";
import { FaTrash, FaFilePdf, FaPlus, FaMinus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addAd } from "../redux/adsslice.jsx";
import Select from "react-select";

function CreateAdvertisement() {
  const { currentuser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
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

  const residentialUnitTypes = [
    "1 BHK",
    "2 BHK",
    "3 BHK",
    "4 BHK",
    "Bungalow",
    "Villa",
    "Studio Apartment",
    "Builder Floor",
  ];

  const commercialUnitTypes = [
    "Office Space",
    "Shop",
    "Showroom",
    "Warehouse",
    "Industrial",
  ];

  const residentialAmenities = [
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

  const commercialAmenities = [
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

  const [selectedPdf, setSelectedPdf] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    location: "",
    projectType: "Residential",

    unitTypes: [],
    priceRange: { min: "", max: "" },
    areaRange: { min: "", max: "" },
    possessionDate: "",
    reraRegistered: false,
    reraNumber: "",

    amenities: [],

    images: [],
    brochure: "",

    projectContacts: [{ name: "", phone: "", email: "" }],
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fuploading, setFUploading] = useState(false);
  const [ferror, setFerror] = useState("");
  const [Pdfuploading, setPdfUploading] = useState(false);
  const [pdferror, setPdferror] = useState("");
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };
  const handlePdfSelect = (e) => {
    const file = e.target.files[0];
    setPdferror(""); // clear previous PDF errors

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setPdferror("PDF must be under 10MB");
      return;
    }

    setSelectedPdf(file);
  };

  const removeSelectedPdf = () => {
    setSelectedPdf(null);
  };
  const getAmenities = () => {
    return formData.projectType === "Commercial"
      ? commercialAmenities
      : residentialAmenities;
  };

  const getUnitTypes = () => {
    return formData.projectType === "Commercial"
      ? commercialUnitTypes
      : residentialUnitTypes;
  };

  const handleProjectTypeChange = (type) => {
    setFormData({
      ...formData,
      projectType: type,
      unitTypes: [],
      amenities: [],
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: { ...formData[parent], [field]: value },
    });

    if (errors[`${parent}.${field}`] || errors[parent]) {
      const newErrors = { ...errors };
      delete newErrors[`${parent}.${field}`];
      delete newErrors[parent];
      setErrors(newErrors);
    }
  };

  const toggleUnitType = (type) => {
    const updated = formData.unitTypes.includes(type)
      ? formData.unitTypes.filter((t) => t !== type)
      : [...formData.unitTypes, type];
    setFormData({ ...formData, unitTypes: updated });
    if (errors.unitTypes) {
      const newErrors = { ...errors };
      delete newErrors.unitTypes;
      setErrors(newErrors);
    }
  };

  const toggleAmenity = (amenity) => {
    const updated = formData.amenities.includes(amenity)
      ? formData.amenities.filter((a) => a !== amenity)
      : [...formData.amenities, amenity];
    setFormData({ ...formData, amenities: updated });
  };
  const updateContact = (index, field, value) => {
    const updated = [...formData.projectContacts];
    updated[index][field] = value;
    setFormData({ ...formData, projectContacts: updated });

    const errorKey = `contact${field.charAt(0).toUpperCase() + field.slice(1)}_${index}`;
    if (errors[errorKey]) {
      const newErrors = { ...errors };
      delete newErrors[errorKey];
      setErrors(newErrors);
    }
  };

  const addContact = () => {
    setFormData({
      ...formData,
      projectContacts: [
        ...formData.projectContacts,
        { name: "", phone: "", email: "" },
      ],
    });
  };
  const removeContact = (index) => {
    if (formData.projectContacts.length > 1) {
      const updated = formData.projectContacts.filter((_, i) => i !== index);
      setFormData({ ...formData, projectContacts: updated });

      const newErrors = { ...errors };
      Object.keys(newErrors).forEach((key) => {
        if (key.includes(`_${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  async function handleImageUpload() {
    const files = selectedFiles;

    if (formData.images.length + files.length > 5) {
      setFerror("Maximum 5 images allowed");
      return;
    }

    const invalidFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) return true;
      if (file.size > 2 * 1024 * 1024) return true;
      return false;
    });

    if (invalidFiles.length > 0) {
      setFerror("Some files are invalid (max 2MB, JPG/PNG/WEBP only)");
      return;
    }

    setFUploading(true);
    setFerror("");

    try {
      const formDataToSend = new FormData();
      files.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await fetch("/api/ads/upload-images", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      const uploadedUrls = data.uploadedurls || [];

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      setSelectedFiles([]);
      setFerror("");

      if (errors.images) {
        const newErrors = { ...errors };
        delete newErrors.images;
        setErrors(newErrors);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFerror(error.message || "Failed to upload images. Please try again.");
    } finally {
      setFUploading(false);
    }
  }

  async function handlePdfUpload() {
    const file = selectedPdf;
    setPdferror("");

    if (!file) {
      setPdferror("Please select a PDF first");
      return;
    }

    if (file.type !== "application/pdf") {
      setPdferror("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setPdferror("PDF must be less than 10MB");
      return;
    }

    setPdfUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("brochure", file);

      const response = await fetch("/api/ads/upload-pdf", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "PDF upload failed");
      }

      const pdfUrl = data.uploadedurls;

      setFormData((prev) => ({
        ...prev,
        brochure: pdfUrl,
      }));

      setSelectedPdf(null);
      setPdferror(""); // clear error on success
    } catch (error) {
      console.error("PDF upload error:", error);
      setPdferror(error.message || "Failed to upload PDF");
    } finally {
      setPdfUploading(false);
    }
  }

  const isEmpty = (v) => !v || !v.toString().trim();

  const isValidEmail = (email) => {
    const cleaned = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(cleaned)) return false;

    const domain = cleaned.split("@")[1];
    return allowedDomains.includes(domain);
  };

  const isValidIndianPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return /^[6-9]\d{9}$/.test(cleaned);
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (uploading) return;

    setSubmitError("");
    if (isEmpty(formData.projectName))
      return setSubmitError("Project name is required");
    if (formData.description.trim().length < 50)
      return setSubmitError("Description of atleast length 50 is  required");
    if (isEmpty(formData.location))
      return setSubmitError("Location is required");

    if (formData.unitTypes.length === 0)
      return setSubmitError("Select at least one unit type");

    if (!formData.priceRange.min || !formData.priceRange.max)
      return setSubmitError("Price range is required");

    if (!formData.areaRange.min || !formData.areaRange.max)
      return setSubmitError("Area range is required");
    if (Number(formData.priceRange.min) > Number(formData.priceRange.max))
      return setSubmitError("Min price cannot be greater than max price");

    if (Number(formData.areaRange.min) > Number(formData.areaRange.max))
      return setSubmitError("Min area cannot be greater than max area");

    if (!formData.possessionDate)
      return setSubmitError("Possession date is required");

    if (formData.reraRegistered && isEmpty(formData.reraNumber))
      return setSubmitError("RERA number is required");

    if (formData.images.length < 3)
      return setSubmitError("Upload at least 3 images");

    if (formData.images.length > 5)
      return setSubmitError("Maximum 5 images allowed");

    if (!formData.projectContacts || formData.projectContacts.length === 0)
      return setSubmitError("At least one contact is required");
    if (!formData.brochure) {
      setSubmitError("Project brochure (PDF) is required before submitting.");
      return;
    }

    for (let i = 0; i < formData.projectContacts.length; i++) {
      const c = formData.projectContacts[i];

      if (isEmpty(c.name))
        return setSubmitError(`Contact ${i + 1}: Name is required`);

      if (!isValidIndianPhone(c.phone))
        return setSubmitError(`Contact ${i + 1}: Enter valid Indian phone`);

      if (!isValidEmail(c.email))
        return setSubmitError(
          `Contact ${i + 1}: Enter valid email or valid domain`,
        );
    }

    const finalData = {
      ...formData,
      projectName: formData.projectName.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      reraNumber: formData.reraNumber ? formData.reraNumber.trim() : "",
      priceRange: {
        min: Number(formData.priceRange.min),
        max: Number(formData.priceRange.max),
      },
      areaRange: {
        min: Number(formData.areaRange.min),
        max: Number(formData.areaRange.max),
      },
      brochure: formData.brochure || null,
      projectContacts: formData.projectContacts.map((c) => ({
        name: c.name.trim(),
        phone: c.phone.replace(/\D/g, ""),
        email: c.email.trim(),
      })),
    };

    setUploading(true);
    setSubmitError("");
    try {
      const response = await fetch(`/api/ads/create/${currentuser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create ad");

      dispatch(addAd(data.advertisement));

      alert("Advertisement submitted successfully!");
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Submission failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <h1 className="text-center text-black font-bold mt-4 text-xl sm:text-2xl">
        Create Advertisement
      </h1>

      <form
        className="bg-gray-200 mx-auto flex flex-col md:flex-row p-4 sm:p-6 justify-between gap-6 rounded-xl max-w-5xl mt-4"
        onSubmit={handleSubmit}
      >
        {/* LEFT COLUMN */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            {/* Project Name */}
            <input
              type="text"
              placeholder="Project Name *"
              value={formData.projectName}
              onChange={(e) => handleInputChange("projectName", e.target.value)}
              className="p-2 w-full bg-white text-black rounded-lg"
            />
            {errors.projectName && (
              <p className="text-red-500 text-sm -mt-2">{errors.projectName}</p>
            )}

            {/* Project Type */}
            <div className="w-full">
              <label className="block text-black mb-1">Project Type *</label>
              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => handleProjectTypeChange("Residential")}
                  className={`px-4 py-2 rounded-lg ${
                    formData.projectType === "Residential"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => handleProjectTypeChange("Commercial")}
                  className={`px-4 py-2 rounded-lg ${
                    formData.projectType === "Commercial"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="w-full">
              <label className="block text-black mb-1">
                Location (Mumbai) *
              </label>
              <Select
                options={localityOptions}
                placeholder="Search & select a locality..."
                value={
                  formData.location
                    ? { value: formData.location, label: formData.location }
                    : null
                }
                onChange={(opt) =>
                  handleInputChange("location", opt?.value || "")
                }
                className="text-black"
                classNamePrefix="react-select"
              />

              {errors.location && (
                <p className="text-red-500 text-sm -mt-2">{errors.location}</p>
              )}
            </div>

            {/* Description */}
            <div className="w-full">
              <label className="block text-black mb-1">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="p-2 w-full bg-white text-black rounded-lg resize-none"
                placeholder="Describe your project..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm -mt-2">
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Minimum 50 characters ({formData.description.trim().length}/50)
              </p>
            </div>

            {/* Unit Types */}
            <div className="w-full">
              <label className="block text-black mb-2">
                {formData.projectType === "Commercial"
                  ? "Commercial Unit Types *"
                  : "Residential Unit Types *"}
              </label>
              <div className="flex flex-wrap gap-2">
                {getUnitTypes().map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => toggleUnitType(type)}
                    className={`px-3 py-1 rounded border ${
                      formData.unitTypes.includes(type)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.unitTypes && (
                <p className="text-red-500 text-sm mt-1">{errors.unitTypes}</p>
              )}
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black mb-1">Min Price (₹) *</label>
                <input
                  type="number"
                  placeholder="Min"
                  value={formData.priceRange.min}
                  onChange={(e) =>
                    handleNestedChange("priceRange", "min", e.target.value)
                  }
                  className="p-2 w-full bg-white text-black rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-black mb-1">Max Price (₹) *</label>
                <input
                  type="number"
                  placeholder="Max"
                  value={formData.priceRange.max}
                  onChange={(e) =>
                    handleNestedChange("priceRange", "max", e.target.value)
                  }
                  className="p-2 w-full bg-white text-black rounded-lg"
                  min="1"
                />
              </div>
            </div>
            {errors.priceRange && (
              <p className="text-red-500 text-sm -mt-2">{errors.priceRange}</p>
            )}

            {/* Area Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-black mb-1">
                  Min Area (sq ft) *
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={formData.areaRange.min}
                  onChange={(e) =>
                    handleNestedChange("areaRange", "min", e.target.value)
                  }
                  className="p-2 w-full bg-white text-black rounded-lg"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-black mb-1">
                  Max Area (sq ft) *
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={formData.areaRange.max}
                  onChange={(e) =>
                    handleNestedChange("areaRange", "max", e.target.value)
                  }
                  className="p-2 w-full bg-white text-black rounded-lg"
                  min="1"
                />
              </div>
            </div>
            {errors.areaRange && (
              <p className="text-red-500 text-sm -mt-2">{errors.areaRange}</p>
            )}

            {/* RERA */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reraRegistered"
                checked={formData.reraRegistered}
                onChange={(e) =>
                  handleInputChange("reraRegistered", e.target.checked)
                }
                className="h-4 w-4"
              />
              <label htmlFor="reraRegistered" className="text-black">
                RERA Registered
              </label>
            </div>

            {formData.reraRegistered && (
              <div>
                <label className="block text-black mb-1">RERA Number *</label>
                <input
                  type="text"
                  placeholder="RERA Number"
                  value={formData.reraNumber}
                  onChange={(e) =>
                    handleInputChange("reraNumber", e.target.value)
                  }
                  className="p-2 w-full bg-white text-black rounded-lg"
                />
                {errors.reraNumber && (
                  <p className="text-red-500 text-sm -mt-2">
                    {errors.reraNumber}
                  </p>
                )}
              </div>
            )}

            {/* Possession Date */}
            <div>
              <label className="block text-black mb-1">Possession Date</label>
              <input
                type="date"
                value={formData.possessionDate}
                onChange={(e) =>
                  handleInputChange("possessionDate", e.target.value)
                }
                className="p-2 w-full bg-white text-black rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            {/* Amenities */}
            <div className="w-full">
              <label className="block text-black mb-2">
                {formData.projectType} Amenities (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded">
                {getAmenities().map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="text-blue-600"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div className="w-full">
              <label className="block text-black mb-2">
                Project Images * (Minimum 3)
              </label>
              <div className="bg-white rounded-2xl shadow-md p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={fuploading || formData.images.length >= 5}
                    className="hidden"
                    id="imageInput"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm"
                  >
                    Select Images
                  </button>
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={fuploading || selectedFiles.length === 0}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                  >
                    {fuploading ? "Uploading..." : "Upload Images"}
                  </button>
                </div>

                {ferror && <p className="text-red-400 mt-2">{ferror}</p>}

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                  <div className="flex flex-col gap-2 mt-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border rounded"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-12 h-12 object-cover"
                          alt={`upload-${index}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="text-red-500"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Uploaded Images */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Uploaded: {formData.images.length}/5 images
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={img.imageurl}
                            alt={`uploaded-${index}`}
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Upload */}
            <div className="w-full">
              <label className="block text-black mb-2">
                Project Brochure (Optional)
              </label>
              <div className="bg-white rounded-2xl shadow-md p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfSelect}
                    className="hidden"
                    id="pdfInput"
                    disabled={!!formData.brochure}
                  />

                  <button
                    type="button"
                    onClick={() => document.getElementById("pdfInput").click()}
                    className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-md text-sm"
                  >
                    Select PDF
                  </button>
                  <button
                    type="button"
                    onClick={handlePdfUpload}
                    disabled={!selectedPdf || Pdfuploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
                  >
                    {Pdfuploading ? "Uploading..." : "Upload PDF"}
                  </button>
                </div>
                {pdferror && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {pdferror}
                  </p>
                )}
                {selectedPdf && (
                  <div className="flex items-center justify-between p-3 border rounded-lg mt-4">
                    <div className="flex items-center gap-2">
                      <FaFilePdf className="text-red-500" />
                      <span className="text-sm">{selectedPdf.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeSelectedPdf}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Project Contacts */}
            <div className="w-full">
              <label className="block text-black mb-2">Contact Persons *</label>
              {formData.projectContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg mb-4 border"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Contact Person {index + 1}</h3>
                    {formData.projectContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="text-red-500"
                      >
                        <FaMinus />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name *"
                      value={contact.name}
                      onChange={(e) =>
                        updateContact(index, "name", e.target.value)
                      }
                      className="p-2 w-full bg-gray-100 text-black rounded-lg"
                    />
                    {errors[`contactName_${index}`] && (
                      <p className="text-red-500 text-sm -mt-2">
                        {errors[`contactName_${index}`]}
                      </p>
                    )}

                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={contact.phone}
                      onChange={(e) =>
                        updateContact(index, "phone", e.target.value)
                      }
                      className="p-2 w-full bg-gray-100 text-black rounded-lg"
                      maxLength="10"
                    />
                    {errors[`contactPhone_${index}`] && (
                      <p className="text-red-500 text-sm -mt-2">
                        {errors[`contactPhone_${index}`]}
                      </p>
                    )}

                    <input
                      type="email"
                      placeholder="Email "
                      value={contact.email}
                      onChange={(e) =>
                        updateContact(index, "email", e.target.value)
                      }
                      className="p-2 w-full bg-gray-100 text-black rounded-lg"
                    />
                    {errors[`contactEmail_${index}`] && (
                      <p className="text-red-500 text-sm -mt-2">
                        {errors[`contactEmail_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addContact}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaPlus className="mr-2" />
                Add Another Contact
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col items-center gap-3 mt-6">
              {submitError && (
                <p className="text-red-500 text-center">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="bg-green-800 rounded-lg w-72 p-3 text-white hover:opacity-90 font-medium disabled:opacity-50"
              >
                {uploading ? "Publishing..." : "Publish Advertisement"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default CreateAdvertisement;
