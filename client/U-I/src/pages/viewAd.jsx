import { useLocation } from "react-router-dom";
import { useState } from "react";

function ViewAd() {
  const { state: ad } = useLocation();
  const [current, setCurrent] = useState(0);

  if (!ad) {
    return (
      <div className="text-center mt-20 text-red-500 text-lg">
        No ad data found.
      </div>
    );
  }

  const {
    projectName,
    description,
    location,
    projectType,
    unitTypes,
    priceRange,
    areaRange,
    possessionDate,
    reraNumber,
    amenities,
    images,
    brochure,
    projectContacts,
  } = ad;

  const next = () => setCurrent((p) => (p + 1) % images.length);
  const prev = () => setCurrent((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="max-w-4xl mx-auto p-5 bg-white rounded-2xl shadow-lg mt-6">
      <div className="relative w-full h-60 sm:h-72 rounded-xl overflow-hidden mb-6">
        <img
          src={images[current]?.imageurl}
          alt="Project"
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full"
            >
              ◀
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 px-3 py-1 rounded-full"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {projectName}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {location} • {projectType}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Price Range</p>
          <p className="font-semibold text-red-600">
            ₹{priceRange.min.toLocaleString()} – ₹
            {priceRange.max.toLocaleString()}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Area Range</p>
          <p className="font-semibold text-green-600">
            {areaRange.min} – {areaRange.max} sq.ft
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Possession</p>
          <p className="font-semibold">
            {possessionDate
              ? new Date(possessionDate).toLocaleDateString()
              : "TBA"}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="font-medium text-gray-700 mb-2">Unit Types</h3>
        <div className="flex flex-wrap gap-2">
          {unitTypes.map((u, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              {u}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <h3 className="font-medium text-gray-700 mb-2">Amenities</h3>
        {amenities && amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {amenities.map((a, i) => (
              <span
                key={i}
                className="bg-gray-100 px-3 py-1 rounded-full text-sm"
              >
                {a}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No amenities listed</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">About the Project</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="mb-6 bg-slate-50 p-4 rounded-lg">
        <p className="font-medium text-gray-700">RERA Status: Registered</p>

        <p className="text-sm text-gray-600 mt-1">
          RERA No: <span className="font-mono">{reraNumber}</span>
        </p>
      </div>

      {brochure?.pdfurl && (
        <div className="mb-6">
          <a
            href={brochure.pdfurl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            View Brochure
          </a>
        </div>
      )}

      <div className="mt-6 border-t pt-4">
        <h3 className="font-medium text-gray-700 mb-3">Contact Details</h3>
        <div className="space-y-3">
          {projectContacts.map((c, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center sm:gap-6 bg-gray-50 p-3 rounded-lg"
            >
              <p className="font-semibold">{c.name}</p>
              <a
                href={`mailto:${c.email}`}
                className="text-blue-600 text-sm hover:underline"
              >
                {c.email}
              </a>
              <a
                href={`https://wa.me/91${c.phone}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-600 text-sm hover:underline"
              >
                +91 {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewAd;
