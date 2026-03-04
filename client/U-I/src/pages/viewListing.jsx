import { useState } from "react";
import { useLocation } from "react-router-dom";

function ListingView() {
  const { state: listing } = useLocation();
  const {
    location,
    description,
    features,
    images,
    listedBy,
    specialOffer,
    status,
    price,
    listingType,
    propertyType,
    bhk,
    area,
  } = listing;
  

  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HERO IMAGE */}
        <div className="relative w-full h-64 sm:h-80">
          <img
            src={images[current]?.imageurl}
            alt="Listing"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-1 rounded-full shadow"
              >
                ◀
              </button>
              <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/90 hover:bg-white px-3 py-1 rounded-full shadow"
              >
                ▶
              </button>
            </>
          )}

          {/* TITLE OVERLAY */}
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-xl sm:text-3xl font-bold">
              {propertyType} {bhk && `• ${bhk}`}
            </h1>
            <p className="text-sm opacity-90 capitalize">
              📍 {location?.locality}, Mumbai
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* PRICE + STATUS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div className="text-3xl font-bold text-red-600">
              ₹{price.toLocaleString()}
              {listingType === "rent" && (
                <span className="text-base text-gray-500 ml-2">/month</span>
              )}
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {status}
            </span>
          </div>

          {/* QUICK INFO CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Listing</p>
              <p className="font-semibold capitalize">{listingType}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Area</p>
              <p className="font-semibold">{area} sq.ft</p>
            </div>

            {bhk && (
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-xs text-gray-500">Configuration</p>
                <p className="font-semibold">{bhk}</p>
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500">Property</p>
              <p className="font-semibold capitalize">{propertyType}</p>
            </div>
          </div>

          {/* ADDRESS */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Location
            </h3>
            <p className="text-gray-600 text-sm sm:text-base">
              {location?.address}
            </p>
          </section>

          {/* DESCRIPTION */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {description}
            </p>
          </section>

          {/* FEATURES */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Features
            </h3>

            {features?.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700"
                  >
                    ✓ {feature}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No features listed</p>
            )}
          </section>

          {/* SPECIAL OFFER */}
          {specialOffer && (
            <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-semibold text-yellow-800">Special Offer</p>
              <p className="text-sm text-yellow-700 mt-1">{specialOffer}</p>
            </div>
          )}

          {/* LISTED BY */}
          <section className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact Information
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <p className="font-semibold text-gray-800">{listedBy.name}</p>

              {listedBy.companyName && (
                <p className="text-sm text-gray-500">{listedBy.companyName}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <a
                  href={`mailto:${listedBy.contact?.email}`}
                  className="text-blue-600 hover:underline"
                >
                  📧 Email
                </a>

                <a
                  href={`https://wa.me/91${listedBy.contact?.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  📞 WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ListingView;
