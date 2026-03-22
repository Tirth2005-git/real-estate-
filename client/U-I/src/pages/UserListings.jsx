import { useSelector } from "react-redux";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteListing } from "../redux/listingslice.jsx";

function UserListings() {
  const { currentuser } = useSelector((state) => state.user);
  const [del, setdel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { listings } = useSelector((state) => {
    return state.listings;
  });

  function handleview(index) {
    navigate("/listing", { state: listings[index] });
  }

  async function handleDelete(index) {
    try {
      setdel(index);
      const listtodel = listings[index];
      const { _id: listingid } = listtodel;
      let res = await fetch(`/api/delete/listing/${currentuser._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
        body: JSON.stringify({ listingid }),
      });
      res = await res.json();
      if (res.success === false) {
        setdel(null);
        throw new Error(res.message);
      }

      const newList = listings.filter((_, i) => i !== index);
      dispatch(deleteListing(newList));
      setdel(null);
    } catch (err) {
      setdel(null);
    }
  }

  function handleEdit(index) {
    navigate("/update-listing", { state: { index } });
  }

  return (
    <>
      {listings.length > 0 ? (
        <>
          <div className="pt-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your Listings
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Manage and update your posted properties
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-8 items-center px-4 pb-10">
            {listings.map((userlist, index) => (
              <div
                key={index}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-60 w-full h-48 sm:h-auto">
                    <img
                      src={userlist.images[0]?.imageurl}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {userlist.title}
                      </h2>

                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium ${
                          userlist.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {userlist.status}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="mt-2 text-gray-500 text-sm">
                      <p className="font-medium capitalize">
                        {userlist.location?.locality}
                      </p>
                      <p className="truncate">{userlist.location?.address}</p>
                    </div>

                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-2 mt-4 text-sm">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {userlist.propertyType}
                      </span>

                      {userlist.bhk && (
                        <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-700">
                          {userlist.bhk}
                        </span>
                      )}

                      <span className="bg-green-50 px-3 py-1 rounded-full text-green-700">
                        {userlist.area} sq.ft
                      </span>

                      <span className="bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 capitalize">
                        For {userlist.listingType}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-4 text-xl font-bold text-red-600">
                      ₹{userlist.price?.toLocaleString()}
                      {userlist.listingType === "rent" && (
                        <span className="text-sm text-gray-500 ml-1">
                          /month
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3 mt-6 flex-wrap">
                      <button
                        className="px-4 py-2 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                        onClick={() => handleDelete(index)}
                        disabled={del === index}
                      >
                        {del === index ? "Deleting..." : "Delete"}
                      </button>

                      <button
                        className="px-4 py-2 text-sm rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>

                      <button
                        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        onClick={() => handleview(index)}
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
        <div className="flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            No Listings Yet
          </h1>

          <p className="text-gray-500 mb-6 max-w-md">
            Start by creating your first property listing and reach potential
            buyers or tenants.
          </p>

          <NavLink
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-md"
            to="/create-listing"
          >
            Create Your First Listing
          </NavLink>
        </div>
      )}
    </>
  );
}

export default UserListings;
