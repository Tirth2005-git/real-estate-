import { useState } from "react";
import { useLocation } from "react-router-dom";

function ListingView() {
  const { state: listing } = useLocation();
  const {
    address,
    description,
    features,
    images,
    listedBy,
    specialOffer,
    status,
    price,
    listingType,
    propertyType,
  } = listing;

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

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 text-center sm:text-left">
        Property Listed by {listedBy.name}
      </h2>

      <div className="text-gray-600 mb-4 space-y-1 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Street:</span> {address.streetAddress}
        </p>
        <p>
          <span className="font-semibold">City:</span> {address.city}
        </p>
        <p>
          <span className="font-semibold">State:</span> {address.state}
        </p>
        <p>
          <span className="font-semibold">Zipcode:</span> {address.zipcode}
        </p>
        <p>
          <span className="font-semibold text-lg text-red-300 capitalize">
            property Type:
          </span>{" "}
          {propertyType}
        </p>
      </div>

      <div className="mb-2">
        <span className="text-base sm:text-lg text-red-700">
          For {listingType}
        </span>
      </div>
      <div className="mb-4">
        <div className="text-2xl sm:text-3xl text-red-700">
          ₹{price}
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
        <p className="text-gray-600 text-sm sm:text-base">{features}</p>
      </div>

      {specialOffer && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold">
            🎉 Special Offer!
          </h3>
          <p className="text-sm sm:text-base">{specialOffer}</p>
        </div>
      )}

      <div>
        <h3 className="text-base sm:text-lg font-medium text-gray-700">
          Contact Info
        </h3>
        <a
          href={`mailto:${listedBy.contact?.email}`}
          className="flex items-center gap-1  "
        >
          📧{" "}
          <span className="underline hover:pointer ">
            {listedBy.contact?.email}
          </span>
        </a>
        <a
          href={`https://wa.me/91${listedBy.contact?.phone}`}
          className="flex items-center gap-1 "
        >
          📞{" "}
          <span className="underline hover:pointer ">
            {listedBy.contact?.phone}
          </span>
        </a>
      </div>
    </div>
  );
}

export default ListingView;
