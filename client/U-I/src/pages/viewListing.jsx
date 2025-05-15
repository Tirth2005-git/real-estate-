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
  } = listing;


  const [current, setCurrent] = useState(0);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
      <div className="relative w-full h-64 overflow-hidden rounded-xl mb-4">
        <img
          src={images[current]?.imageurl}
          alt="Listing Slide"
          className="w-full h-full object-cover transition-all "
        />
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1"
        >
          ▶
        </button>
      </div>

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Property Listed by {listedBy.name}
      </h2>

      <div className="text-gray-600 mb-4">
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
      </div>

      <div className="mb-2">
        <span className="text-lg text-red-700">For {listingType}</span>
      </div>
      <div className="mb-4">
        <div className="text-3xl text-red-700">
          ₹{price}
          <span
            className={
              listingType === "rent" ? "text-red-500 ml-5 text-lg" : "hidden"
            }
          >
            per month
          </span>
        </div>
      </div>
      <div className="mb-4">
        <div
          className={
            status === "available"
              ? "text-green-400 text-xl"
              : "text-red-600 text-2xl"
          }
        >
          {status}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">Description</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-700">Features</h3>
        <p className="text-gray-600">{features}</p>
      </div>

      {specialOffer && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">🎉 Special Offer!</h3>
          <p>{specialOffer}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-700">Contact Info</h3>
        <p className="text-gray-600">📞 {listedBy.contact.phone}</p>
        <p className="text-gray-600">📧 {listedBy.contact.email}</p>
      </div>
    </div>
  );
}

export default ListingView;
