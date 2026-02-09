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
  console.log(listing);

  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-2xl mt-6">
      <div className="relative w-full h-52 sm:h-64 overflow-hidden rounded-xl mb-4">
        <img
          src={images[current]?.imageurl}
          alt="Listing Slide"
          className="w-full h-full object-cover transition-all"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 text-lg"
            >
              ◀
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 text-lg"
            >
              ▶
            </button>
          </>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Property Listed by {listedBy.name}
          {listedBy.role !== "user" && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {listedBy.role === "dealer" ? "🏢 Dealer" : "👷 Builder"}
              {listedBy.companyName && ` • ${listedBy.companyName}`}
            </span>
          )}
        </h2>
      </div>

      <div className="text-gray-600 mb-4 space-y-1 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Locality:</span> {location?.locality}
        </p>
        <p>
          <span className="font-semibold">Address:</span> {location?.address}
        </p>
        <p>
          <span className="font-semibold text-lg text-red-300 capitalize">
            Property Type:
          </span>{" "}
          {propertyType}
        </p>
        {/* Show BHK for residential */}
        {bhk && (
          <p>
            <span className="font-semibold">BHK:</span> {bhk}
          </p>
        )}

        <p>
          <span className="font-semibold">Area:</span> {area} sq.ft
        </p>
      </div>

      <div className="mb-2">
        <span className="text-base sm:text-lg text-red-700">
          For {listingType}
        </span>
      </div>
      <div className="mb-4">
        <div className="text-2xl sm:text-3xl text-red-700">
          ₹{price.toLocaleString()}
          {listingType === "rent" && (
            <span className="ml-3 text-base sm:text-lg text-red-500">
              per month
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div
          className={`text-xl sm:text-2xl ${
            status === "available" ? "text-green-500" : "text-red-600"
          }`}
        >
          {status}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-700">
          Description
        </h3>
        <p className="text-gray-600 text-sm sm:text-base">{description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-700">
          Features
        </h3>
        {features && features.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {feature}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No features listed</p>
        )}
      </div>

      {specialOffer && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold">
            🎉 Special Offer!
          </h3>
          <p className="text-sm sm:text-base">{specialOffer}</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-3">
          Contact Information
        </h3>
        <div className="space-y-3">
          <a
            href={`mailto:${listedBy.contact?.email}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <span className="text-xl">📧</span>
            <span className="underline">{listedBy.contact?.email}</span>
          </a>
          <a
            href={`https://wa.me/91${listedBy.contact?.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:text-green-800"
          >
            <span className="text-xl">📞</span>
            <span className="underline">{listedBy.contact?.phone}</span>
          </a>

          {listedBy.dealerType && (
            <p className="text-sm text-gray-600 mt-2">
              Dealer Type:{" "}
              <span className="font-semibold capitalize">
                {listedBy.dealerType}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingView;
