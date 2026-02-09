import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function DealerProfile() {
  const navigate = useNavigate();

  const { dealer, listings } = useSelector((state) => state.dealerProfile);

  function handleView(listing) {
    navigate("/listing", {
      state: {
        ...listing,
        source: "dealerProfile",
      },
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 mb-10">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-1">
              <div className="h-full w-full rounded-full bg-gray-200 overflow-hidden">
                {dealer?.pfp ? (
                  <img
                    src={dealer.pfp}
                    alt="Dealer profile"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            {/* Dealer Type Badge */}
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full bg-gray-900 text-white capitalize shadow">
              {dealer.dealerType}
            </span>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {dealer.dealerType === "agency"
                ? dealer.companyName
                : dealer.name}
            </h1>

            {/* Contact */}
            {dealer.contact?.email && (
              <p className="mt-1 text-sm text-gray-500">
                {dealer.contact.email}
              </p>
            )}

            {/* Localities */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
              {dealer.localities.map((l) => (
                <span
                  key={l}
                  className="text-xs sm:text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 capitalize"
                >
                  {l}
                </span>
              ))}
            </div>

            {/* Description */}
            {dealer.companyDescription && (
              <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
                {dealer.companyDescription}
              </p>
            )}
          </div>
        </div>
      </div>

      {listings.length > 0 ? (
        <>
          <h1 className="text-xl sm:text-2xl text-black font-bold text-center mt-4">
            Listings by this Dealer
          </h1>

          <div className="flex flex-col gap-4 mt-3 items-center px-4">
            {listings.map((list, index) => (
              <div
                key={list._id}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white w-full max-w-3xl shadow-md items-center"
              >
                {/* Image */}
                <div className="w-full sm:w-auto">
                  <img
                    src={list.images[0]?.imageurl}
                    alt="Property"
                    className="w-full sm:w-36 h-32 object-cover rounded-md"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-semibold text-black">
                    {list.title}
                  </p>

                  {/* Location */}
                  <div className="flex flex-col text-gray-500 text-sm sm:text-base">
                    <p className="font-medium capitalize">
                      {list.location?.locality}
                    </p>
                    <p>{list.location?.address}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm sm:text-base">
                    <p className="mt-2">
                      <span className="text-black font-medium">Price: </span>
                      <span className="text-red-500 font-semibold">
                        ₹{list.price?.toLocaleString()}
                        {list.listingType === "rent" && "/month"}
                      </span>
                    </p>

                    <p className="mt-2">
                      <span className="text-black font-medium">Type: </span>
                      <span className="text-red-500 font-semibold capitalize">
                        {list.listingType}
                      </span>
                    </p>

                    <p className="mt-2">
                      <span className="text-black font-medium">Property: </span>
                      <span className="text-red-500 font-semibold capitalize">
                        {list.propertyType}
                      </span>
                    </p>

                    {list.bhk && (
                      <p className="mt-2">
                        <span className="text-black font-medium">BHK: </span>
                        <span className="text-blue-500 font-semibold">
                          {list.bhk}
                        </span>
                      </p>
                    )}

                    <p className="mt-2">
                      <span className="text-black font-medium">Area: </span>
                      <span className="text-green-500 font-semibold">
                        {list.area} sq.ft
                      </span>
                    </p>

                    <p className="mt-2">
                      <span className="text-black font-medium">Status: </span>
                      <span
                        className={
                          list.status === "available"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {list.status}
                      </span>
                    </p>

                    {list.features?.length > 0 && (
                      <p className="mt-2">
                        <span className="text-black font-medium">
                          Features:{" "}
                        </span>
                        <span className="text-purple-500 font-semibold">
                          {list.features.length}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-3 justify-center sm:justify-between text-center sm:text-right">
                  <button
                    onClick={() => handleView(list)}
                    className="text-blue-600 hover:underline"
                  >
                    View Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No listings posted by this dealer
        </p>
      )}
    </div>
  );
}
