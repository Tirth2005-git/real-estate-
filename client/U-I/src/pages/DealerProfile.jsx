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
    <div className="max-w-7xl mx-auto pt-24 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 lg:sticky lg:top-24">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 p-[2px]">
                  <div className="h-full w-full rounded-full bg-gray-200 overflow-hidden">
                    {dealer?.pfp && (
                      <img
                        src={dealer.pfp}
                        alt="Dealer"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-3 py-0.5 rounded-full bg-gray-900 text-white capitalize">
                  {dealer.dealerType}
                </span>
              </div>

              <h1 className="mt-4 text-xl font-semibold text-gray-900">
                {dealer.dealerType === "agency"
                  ? dealer.companyName
                  : dealer.name}
              </h1>

              {dealer.contact?.email && (
                <p className="text-sm text-gray-500 mt-1 break-all">
                  {dealer.contact.email}
                </p>
              )}
            </div>

            {dealer.localities?.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold text-gray-500 mb-2 text-center">
                  Operating Localities
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  {dealer.localities.map((l) => (
                    <span
                      key={l}
                      className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {dealer.companyDescription && (
              <p className="mt-6 text-sm text-gray-600 text-center leading-relaxed">
                {dealer.companyDescription}
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {listings.length > 0 ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Listings by this Dealer
                </h1>
                <p className="text-gray-500 text-sm">
                  Properties currently available
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {listings.map((list) => (
                  <div
                    key={list._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-64 w-full h-48">
                        <img
                          src={list.images[0]?.imageurl}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 leading-snug">
                            {list.title}
                          </h2>

                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              list.status === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {list.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-500 mt-1 capitalize">
                          {list.location?.locality}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4 text-sm">
                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            {list.propertyType}
                          </span>

                          {list.bhk && (
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                              {list.bhk}
                            </span>
                          )}

                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                            {list.area} sq.ft
                          </span>

                          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full capitalize">
                            For {list.listingType}
                          </span>
                        </div>

                        {list.features?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {list.features.slice(0, 4).map((f, i) => (
                              <span
                                key={i}
                                className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-6">
                          <p className="text-lg sm:text-xl font-bold text-red-600">
                            ₹{list.price?.toLocaleString()}
                            {list.listingType === "rent" && (
                              <span className="text-xs sm:text-sm text-gray-500 ml-1">
                                /month
                              </span>
                            )}
                          </p>

                          <button
                            onClick={() => handleView(list)}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm md:text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                          >
                            View Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center pt-24">
              <h2 className="text-2xl font-semibold text-gray-800">
                No Listings Yet
              </h2>
              <p className="text-gray-500">
                This dealer has not posted any properties yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
