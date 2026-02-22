import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { setListing } from "../redux/listingslice.jsx";
import Select from "react-select";

function CreateListing() {
  const [propertyCategory, setPropertyCategory] = useState("residential");
  const [formdata, setFormData] = useState({
    images: [],
    features: [],
  });
  const dispatch = useDispatch();
  const fileref = useRef(0);
  const [fileup, setFile] = useState([]);
  const [ferror, setError] = useState();
  const [Cerror, setCreateError] = useState();
  const [uploading, setUploading] = useState("idle");
  const [Cuploading, setCreateUploading] = useState("idle");
  const { currentuser } = useSelector((state) => state.user);

  useEffect(() => {
    if (currentuser) {
      setFormData((prev) => ({
        ...prev,
        name: currentuser.username,
        email:
          currentuser.personalContactValue ||
          currentuser.companyContactValue ||
          "",
        phone: "",
        role: currentuser.role,
      }));
    }
  }, [currentuser]);

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
  }, [Cuploading]);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const trimmedData = {};
      Object.keys(formdata).forEach((key) => {
        if (typeof formdata[key] === "string") {
          trimmedData[key] = formdata[key].trim();
        } else {
          trimmedData[key] = formdata[key];
        }
      });

      const requiredFields = [
        "title",
        "listingType",
        "propertyType",
        "description",
        "price",
        "area",
        "locality",
        "address",
        "name",
        "email",
        "phone",
      ];

      if (propertyCategory === "residential") {
        requiredFields.push("bhk");
      }

      for (let field of requiredFields) {
        if (!trimmedData[field] || trimmedData[field] === "") {
          setCreateError(`${field.replace(/([A-Z])/g, " $1")} is required`);
          return;
        }
      }

      if (!trimmedData.images || trimmedData.images.length === 0) {
        setCreateError("At least 1 image is required");
        return;
      }

      if (trimmedData.email) {
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
        if (!emailRegex.test(trimmedData.email)) {
          setCreateError("Please enter a valid email address");
          return;
        }
        const domain = trimmedData.email.split("@")[1];

        if (!allowedDomains.includes(domain)) {
          setCreateError("Please enter a valid email domain");
          return;
        }
      }

      if (trimmedData.phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(trimmedData.phone.replace(/\D/g, ""))) {
          setCreateError("Proper Indian Phone number is required");
          return;
        }
      }

      setFormData(trimmedData);

      trimmedData.bhk = trimmedData.bhk || null;
      trimmedData.area = Number(trimmedData.area);
      trimmedData.price = Number(trimmedData.price);
      trimmedData.status = trimmedData.status || "available";
      trimmedData.features = trimmedData.features || [];
      trimmedData.specialOffer = trimmedData.specialOffer || "";

      trimmedData.location = {
        locality: trimmedData.locality,
        address: trimmedData.address,
      };

      trimmedData.listedBy = {
        userId: currentuser._id,
        role: currentuser.role,
        ...(currentuser.role === "dealer" && {
          dealerType: currentuser.dealerType,
        }),
        ...(currentuser.role === "dealer" && currentuser.dealerType === "agency"
          ? {
              companyName: currentuser.companyName || "",
            }
          : {}),
        name: trimmedData.name,
        contact: {
          phone: trimmedData.phone,
          email: trimmedData.email,
        },
      };

      trimmedData.userref = currentuser._id;

      delete trimmedData.name;
      delete trimmedData.email;
      delete trimmedData.phone;
      delete trimmedData.locality;
      delete trimmedData.address;

      setCreateUploading("uploading");

      const res = await fetch(`/api/list/${currentuser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedData),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.message || "Failed to create listing");
        setCreateUploading("idle");
        return;
      }

      setCreateUploading("success");
      setCreateError(null);
      dispatch(setListing(data.newlisting));
      setFormData({
        images: [],
        features: [],
      });
      setTimeout(() => {
        navigate("/listing", {
          state: data.newlisting,
        });
      }, 600);
    } catch (err) {
      setCreateError(err.message || "Something went wrong");
    }
  }

  async function handleUpload() {
    try {
      setUploading("uploading");

      if (!fileup || fileup.length === 0 || fileup.length > 5) {
        setUploading("idle");
        setError("Please select 1-5 images");
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
      setError(err.message);
      setUploading("idle");
    }
  }

  function handleDelete(index) {
    setFile(fileup.filter((image, i) => i !== index));
  }

  const { listings } = useSelector((state) => state.listings);
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

  const residentialTypes = [
    "Flat",
    "Bungalow",
    "Villa",
    "Studio Apartment",
    "Builder Floor",
  ];
  const commercialTypes = [
    "Office Space",
    "Shop",
    "Showroom",
    "Warehouse",
    "Industrial",
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
                <label className="flex items-center">
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
                      value={type.toLowerCase().replace(" ", "-")}
                      checked={
                        formdata.propertyType ===
                        type.toLowerCase().replace(" ", "-")
                      }
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

            {/* BHK (Residential only) */}
            {propertyCategory === "residential" && (
              <div className="w-full">
                <label htmlFor="bhk" className="block text-black mb-1">
                  BHK Configuration:
                </label>
                <select
                  id="bhk"
                  className="p-2 w-full bg-white text-black rounded-lg"
                  required
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
              required
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
                  required
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                  min="5000"
                  step="1000"
                />

                <label htmlFor="area" className="text-black mb-1">
                  Built-up Area (sq.ft):
                </label>
                <input
                  type="number"
                  id="area"
                  className="p-2 bg-white text-black rounded-lg"
                  required
                  min="150"
                  step="10"
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                />

                <label htmlFor="specialOffer" className="text-black mb-1">
                  Special Offer:
                </label>
                <textarea
                  id="specialOffer"
                  className="p-2 bg-white text-black h-24 rounded-lg resize-none"
                  onChange={(e) =>
                    setFormData({ ...formdata, [e.target.id]: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="w-full">
                <label className="block text-black mb-2">
                  Select Features:
                </label>
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
                          if (e.target.checked) {
                            setFormData({
                              ...formdata,
                              features: [...formdata.features, feature],
                            });
                          } else {
                            setFormData({
                              ...formdata,
                              features: formdata.features.filter(
                                (f) => f !== feature,
                              ),
                            });
                          }
                        }}
                        className="text-blue-600"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full mt-2">
              <label htmlFor="status" className="block text-black mb-1">
                Status:
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="available"
                  name="status"
                  className="mr-2"
                  onChange={(e) =>
                    setFormData({
                      ...formdata,
                      [e.target.name]: e.target.value,
                    })
                  }
                  checked
                  required
                />
                Available
              </label>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-col gap-4 w-full">
            <label className="block text-black mb-2">Location Details</label>
            <div className="flex flex-col gap-3">
              <div className="w-full">
                <label className="block text-black mb-1">Locality</label>
                <Select
                  options={localityOptions}
                  placeholder="Search & select locality..."
                  className="text-black"
                  onChange={(opt) =>
                    setFormData({ ...formdata, locality: opt?.value || "" })
                  }
                />
              </div>

              <input
                type="text"
                placeholder="Complete Address"
                className="p-2 bg-white text-black rounded-lg"
                id="address"
                required
                onChange={(e) =>
                  setFormData({ ...formdata, [e.target.id]: e.target.value })
                }
              />
            </div>

            <label className="block text-black mb-2 mt-4">
              Your Contact Details
            </label>
            <input
              type="text"
              placeholder="Your Name"
              id="name"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.name || ""}
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              id="email"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.email || ""}
              required
              onChange={(e) =>
                setFormData({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Phone Number"
              id="phone"
              className="p-2 w-full bg-white text-black rounded-lg"
              value={formdata.phone || ""}
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
                  Select images
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
                    disabled={uploading === "uploading"}
                  >
                    Upload
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
                disabled={Cuploading === "uploading"}
              >
                {Cuploading === "uploading"
                  ? "Creating Listing..."
                  : "Submit Listing"}
              </button>

              {Cuploading === "success" && (
                <p className="text-green-500">
                  ✅ Listing Created Successfully!
                </p>
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
