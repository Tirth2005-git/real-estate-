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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative w-full h-64 sm:h-80">
          <img
            src={images[current]?.imageurl}
            alt="Project"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-1 rounded-full shadow"
              >
                ◀
              </button>
              <button
                onClick={next}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-1 rounded-full shadow"
              >
                ▶
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-xl sm:text-3xl font-bold">{projectName}</h1>
            <p className="text-sm opacity-90 capitalize">
              📍 {location}, Mumbai • {projectType}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Price Range</p>
              <p className="font-bold text-red-600 text-lg">
                ₹{priceRange.min.toLocaleString()} – ₹
                {priceRange.max.toLocaleString()}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Area Range</p>
              <p className="font-semibold text-green-700">
                {areaRange.min} – {areaRange.max} sq.ft
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Possession</p>
              <p className="font-semibold text-blue-700">
                {possessionDate
                  ? new Date(possessionDate).toLocaleDateString()
                  : "To Be Announced"}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Available Configurations
            </h3>

            <div className="flex flex-wrap gap-2">
              {unitTypes.map((u, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium"
                >
                  {u}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Amenities
            </h3>

            {amenities?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenities.map((a, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700"
                  >
                    ✓ {a}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No amenities listed</p>
            )}
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              About the Project
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {description}
            </p>
          </section>

          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="font-semibold text-yellow-800">
              RERA Registered Project
            </p>
            {reraNumber && (
              <p className="text-sm text-yellow-700 mt-1 font-mono">
                {reraNumber}
              </p>
            )}
          </div>

          
          {brochure?.pdfurl && (
            <div className="mb-10">
              <a
                href={brochure.pdfurl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition"
              >
                📄 View Project Brochure
              </a>
            </div>
          )}

        
          <section className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Details
            </h3>

            <div className="space-y-3">
              {projectContacts.map((c, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl"
                >
                  <p className="font-semibold text-gray-800">{c.name}</p>

                  <div className="flex gap-4 text-sm">
                    {c.email && (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        📧 Email
                      </a>
                    )}

                    <a
                      href={`https://wa.me/91${c.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      📞 WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ViewAd;
