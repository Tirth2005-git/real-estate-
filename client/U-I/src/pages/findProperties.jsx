import { useSelector, useDispatch } from "react-redux";
import { setVisbility } from "../redux/formslice.jsx";
import { setproperties } from "../redux/propertiesSlice.jsx";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAds } from "../redux/adsslice.jsx";
import Select from "react-select";

function FindProperties() {
  const { ads } = useSelector((state) => state.ads);

  const [formdata, setformdata] = useState({
    listingTypes: [],
    propertyCategory: "",
    propertyType: "",
    bhks: [],
    locality: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    listedByRoles: [],
    dealerTypes: [],
    Features: [],
  });

  const [searching, setSearching] = useState(false);
  const [searcherror, setSeacrhError] = useState(false);
  const { showForm } = useSelector((state) => state.formToggle);
  const { properties } = useSelector((state) => state.properties);
  const navigate = useNavigate();
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
    value: l.toLowerCase(),
    label: l,
  }));

  function handleview(index) {
    navigate("/listing", { state: properties[index] });
  }
  function handleadview(index) {
    navigate("/ad", { state: ads[index] });
  }

  useEffect(() => {
    dispatch(setVisbility());
  }, [properties, dispatch]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();

      const { locality, propertyType } = formdata;

      if (!locality?.trim()) {
        setSeacrhError("Please select a locality");
        return;
      }

      if (!propertyType?.trim()) {
        setSeacrhError("Please select a property type");
        return;
      }

      setSearching(true);
      setSeacrhError(false);

      const rawParams = {
        locality: formdata.locality,
        propertyCategory: formdata.propertyCategory,
        propertyType: formdata.propertyType,
        listingTypes: formdata.listingTypes,
        bhks: formdata.bhks,
        listedByRoles: formdata.listedByRoles,
        dealerTypes: formdata.dealerTypes,
        minPrice: formdata.minPrice,
        maxPrice: formdata.maxPrice,
        minArea: formdata.minArea,
        maxArea: formdata.maxArea,
        Features: formdata.Features,
      };

      const searchParams = {};
      Object.entries(rawParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (Array.isArray(value) && value.length) {
          searchParams[key] = value;
        } else if (
          key === "minPrice" ||
          key === "maxPrice" ||
          key === "minArea" ||
          key === "maxArea"
        ) {
          searchParams[key] = Number(value);
        } else if (typeof value === "string") {
          searchParams[key] = value.trim().toLowerCase();
        }
      });

      const res = await fetch("/api/browse/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchParams),
      });

      if (!res.ok) {
        const data = await res.json();
        setSeacrhError(data.message || "Search failed");
        setSearching(false);
        return;
      }

      const data = await res.json();

      if (
        (!data.listings || data.listings.length === 0) &&
        (!data.ads || data.ads.length === 0)
      ) {
        setSeacrhError("No properties or ads found for this area");
        setSearching(false);
        return;
      }

      dispatch(setproperties(data.listings || []));
      dispatch(setAds(data.ads || []));

      setSearching(false);
      setSeacrhError(false);
    
    } catch (err) {
      setSearching(false);
      setSeacrhError(err.message || "Search failed");
    }
  }

  return (
    <>
      <form
        className={`w-full max-w-4xl bg-gray-200 rounded-xl p-5 z-30 flex flex-col lg:flex-row gap-6 fixed left-1/2 -translate-x-1/2 transition-all duration-500 ${
          showForm ? "top-10" : "-top-full"
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <label className="block font-medium text-gray-700 mb-2">
            Listing Type
          </label>
          <div className="flex flex-wrap gap-3 mb-4">
            {["rent", "sale"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formdata.listingTypes.includes(type)}
                  onChange={(e) => {
                    setformdata((prev) => {
                      const updated = prev.listingTypes.includes(type)
                        ? prev.listingTypes.filter((t) => t !== type)
                        : [...prev.listingTypes, type];

                      return { ...prev, listingTypes: updated };
                    });
                  }}
                  className="accent-blue-500"
                />
                <span className="text-gray-700 ml-2 capitalize">{type}</span>
              </label>
            ))}
          </div>

          <label className="block font-medium text-gray-700 mb-2">
            Property Category
          </label>
          <div className="flex flex-wrap gap-3 mb-4">
            {["residential", "commercial"].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="propertyCategory"
                  value={category}
                  checked={formdata.propertyCategory === category}
                  onChange={(e) => {
                    setformdata((prev) => ({
                      ...prev,
                      propertyCategory:
                        prev.propertyCategory === e.target.value
                          ? ""
                          : e.target.value,
                      propertyType: "",
                    }));
                  }}
                  className="accent-blue-500"
                />
                <span className="text-gray-700 ml-2 capitalize">
                  {category}
                </span>
              </label>
            ))}
          </div>

          {formdata.propertyCategory && (
            <>
              <label className="block font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {(formdata.propertyCategory === "residential"
                  ? [
                      "flat",
                      "bungalow",
                      "villa",
                      "studio-apartment",
                      "builder floor",
                    ]
                  : [
                      "office-space",
                      "shop",
                      "showroom",
                      "warehouse",
                      "industrial",
                    ]
                ).map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      name="propertyType"
                      value={type}
                      checked={formdata.propertyType === type}
                      onChange={(e) => {
                        setformdata((prev) => ({
                          ...prev,
                          propertyType:
                            prev.propertyType === e.target.value
                              ? ""
                              : e.target.value,
                        }));
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-700 ml-2 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {formdata.propertyCategory === "residential" && (
            <>
              <label className="block font-medium text-gray-700 mb-2">
                BHK Configuration
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Studio"].map((bhk) => (
                  <label key={bhk} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formdata.bhks.includes(bhk)}
                      onChange={() => {
                        setformdata((prev) => {
                          const updated = prev.bhks.includes(bhk)
                            ? prev.bhks.filter((b) => b !== bhk)
                            : [...prev.bhks, bhk];

                          return { ...prev, bhks: updated };
                        });
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-gray-700 ml-2">{bhk}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex-1">
          <label className="block font-medium text-gray-700 mb-2">
            Mumbai Locality
          </label>
          <Select
            options={localityOptions}
            placeholder="Search & select locality..."
            value={
              formdata.locality
                ? { value: formdata.locality, label: formdata.locality }
                : null
            }
            onChange={(opt) =>
              setformdata((prev) => ({ ...prev, locality: opt?.value || "" }))
            }
            className="mb-4 text-black"
            classNamePrefix="react-select"
          />

          <label className="block font-medium text-gray-700 mb-2">
            Price Range (₹)
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="number"
              className="w-full bg-white rounded-lg p-2"
              placeholder="Min Price"
              min="1000"
              value={formdata.minPrice || ""}
              onChange={(e) =>
                setformdata((prev) => ({ ...prev, minPrice: e.target.value }))
              }
            />
            <input
              type="number"
              className="w-full bg-white rounded-lg p-2"
              placeholder="Max Price"
              min="1000"
              value={formdata.maxPrice || ""}
              onChange={(e) =>
                setformdata((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
            />
          </div>

          <label className="block font-medium text-gray-700 mb-2">
            Area Range (sq.ft)
          </label>
          <div className="flex gap-3 mb-4">
            <input
              type="number"
              className="w-full bg-white rounded-lg p-2"
              placeholder="Min Area"
              min="100"
              value={formdata.minArea || ""}
              onChange={(e) =>
                setformdata((prev) => ({ ...prev, minArea: e.target.value }))
              }
            />
            <input
              type="number"
              className="w-full bg-white rounded-lg p-2"
              placeholder="Max Area"
              min="100"
              value={formdata.maxArea || ""}
              onChange={(e) =>
                setformdata((prev) => ({ ...prev, maxArea: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block font-medium text-gray-700 mb-2">
            Listed By
          </label>
          <div className="flex flex-col gap-2 mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formdata.listedByRoles?.includes("user")}
                onChange={() => {
                  setformdata((prev) => {
                    const updated = prev.listedByRoles.includes("user")
                      ? prev.listedByRoles.filter((r) => r !== "user")
                      : [...prev.listedByRoles, "user"];

                    return { ...prev, listedByRoles: updated };
                  });
                }}
                className="accent-blue-500"
              />
              <span className="text-gray-700 ml-2">Individual Users</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formdata.listedByRoles?.includes("dealer")}
                onChange={() => {
                  setformdata((prev) => {
                    const updated = prev.listedByRoles.includes("dealer")
                      ? prev.listedByRoles.filter((r) => r !== "dealer")
                      : [...prev.listedByRoles, "dealer"];

                    return { ...prev, listedByRoles: updated };
                  });
                }}
                className="accent-blue-500"
              />
              <span className="text-gray-700 ml-2">Dealers</span>
            </label>

            {/* Dealer Types */}
            {formdata.listedByRoles?.includes("dealer") && (
              <div className="ml-6 flex flex-col gap-1">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formdata.dealerTypes?.includes("individual")}
                    onChange={() => {
                      setformdata((prev) => {
                        const updated = prev.dealerTypes.includes("individual")
                          ? prev.dealerTypes.filter((t) => t !== "individual")
                          : [...prev.dealerTypes, "individual"];

                        return { ...prev, dealerTypes: updated };
                      });
                    }}
                    className="accent-green-500"
                  />
                  <span className="text-gray-700 ml-2">Individual Dealers</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formdata.dealerTypes?.includes("agency")}
                    onChange={() => {
                      setformdata((prev) => {
                        const updated = prev.dealerTypes.includes("agency")
                          ? prev.dealerTypes.filter((t) => t !== "agency")
                          : [...prev.dealerTypes, "agency"];

                        return { ...prev, dealerTypes: updated };
                      });
                    }}
                    className="accent-green-500"
                  />
                  <span className="text-gray-700 ml-2">Agencies</span>
                </label>
              </div>
            )}
          </div>

          {formdata.propertyCategory && (
            <>
              <label className="block font-medium text-gray-700 mb-2">
                Features
              </label>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-white rounded border">
                {(formdata.propertyCategory === "residential"
                  ? [
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
                    ]
                  : [
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
                    ]
                ).map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      value={feature}
                      checked={formdata.Features?.includes(feature) || false}
                      onChange={(e) => {
                        const currentSelected = formdata.Features || [];
                        if (e.target.checked) {
                          setformdata((prev) => ({
                            ...prev,
                            Features: [...currentSelected, feature],
                          }));
                        } else {
                          setformdata((prev) => ({
                            ...prev,
                            Features: currentSelected.filter(
                              (f) => f !== feature,
                            ),
                          }));
                        }
                      }}
                      className="accent-blue-500"
                    />
                    <span className="text-sm text-gray-700 ml-2">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formdata.selectedFeatures?.length || 0} features
              </p>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            disabled={searching}
          >
            {searching ? "Searching..." : "Search Properties"}
          </button>

          {searcherror && (
            <p className="text-red-500 text-sm mt-2 text-center">
              {searcherror}
            </p>
          )}
        </div>
      </form>
      {ads.length > 0 && (
        <div className="pt-28 px-4">
          <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
            Featured Projects in This Area
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
            {ads.map((ad, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                onClick={() => handleadview(index)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={ad.images[0].imageurl}
                    alt={ad.projectName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mb-2">
                    🏗 Sponsored Project
                  </span>

                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {ad.projectName}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    📍 {ad.location.locality}, Mumbai
                  </p>

                  <p className="text-sm text-gray-500 mb-3">
                    {ad.projectType} • {ad.unitTypes.join(", ")}
                  </p>

                  <p className="text-green-700 font-semibold">
                    ₹{ad.priceRange.min.toLocaleString()} – ₹
                    {ad.priceRange.max.toLocaleString()}
                  </p>

                  <div className="pt-3 border-t text-sm text-blue-600">
                    📞 {ad.projectContacts[0]?.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {properties.length > 0 ? (
        <div className="pt-24 px-4">
          <h1 className="text-2xl font-bold text-center mb-6">
            Found {properties.length} Properties
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {properties.map((property, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleview(index)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={property.images[0]?.imageurl}
                    alt={property.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  {/* Badge for listed by */}
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.listedBy.role === "dealer"
                          ? property.listedBy.dealerType === "agency"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {property.listedBy.role === "dealer"
                        ? `🏢 ${
                            property.listedBy.dealerType === "agency"
                              ? "Agency"
                              : "Individual"
                          } Dealer`
                        : "👤 Individual User"}
                      {property.listedBy.companyName &&
                        ` • ${property.listedBy.companyName}`}
                    </span>

                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        property.status === "available"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {property.title}
                  </h3>

                  {/* Location */}
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    📍 {property.location?.locality}, Mumbai
                  </p>

                  {/* Quick Info */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {property.propertyType}
                    </span>
                    {property.bhk && (
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {property.bhk}
                      </span>
                    )}
                    <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                      {property.area} sq.ft
                    </span>
                    <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs">
                      For {property.listingType}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <p className="text-2xl font-bold text-red-600">
                      ₹{property.price?.toLocaleString()}
                      {property.listingType === "rent" && (
                        <span className="text-sm text-gray-500"> /month</span>
                      )}
                    </p>
                  </div>

                  {/* Features Preview */}
                  {property.features && property.features.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {property.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {property.features.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{property.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Contact Info (smaller) */}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <a
                        href={`mailto:${property.listedBy.contact?.email}`}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📧 Email
                      </a>
                      <a
                        href={`https://wa.me/91${property.listedBy.contact?.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📞 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="pt-32 text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Search Mumbai Properties</h1>
          <p className="text-gray-600 mb-6">
            Use the search form above to find properties in Mumbai
          </p>
          <div className="inline-flex flex-col gap-2 text-left bg-gray-100 p-4 rounded-lg max-w-md mx-auto">
            <p className="font-medium">Search by:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Mumbai locality (Bandra, Andheri, etc.)</li>
              <li>Property type (Flat, Office, Shop, etc.)</li>
              <li>Price range</li>
              <li>Dealer type (Individual or Agency)</li>
              <li>BHK configuration</li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default FindProperties;
