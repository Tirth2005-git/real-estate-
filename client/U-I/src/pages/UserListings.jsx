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
          <h1 className="text-xl sm:text-2xl text-black font-bold text-center mt-4">
            Your Listings
          </h1>
          <div className="flex flex-col gap-4 mt-3 items-center px-4">
            {listings.map((userlist, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white w-full max-w-3xl shadow-md items-center"
              >
                {/* Image */}
                <div className="w-full sm:w-auto">
                  <img
                    src={userlist.images[0]?.imageurl}
                    alt="Property"
                    className="w-full sm:w-36 h-32 object-cover rounded-md"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-semibold text-black">
                    {userlist.title}
                  </p>

                  {/* Location (updated for new schema) */}
                  <div className="flex flex-col text-gray-500 text-sm sm:text-base">
                    <p className="font-medium">{userlist.location?.locality}</p>
                    <p>{userlist.location?.address}</p>
                  </div>

                  {/* Property Details Row */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-sm sm:text-base">
                    {/* Price */}
                    <p className="mt-2">
                      <span className="text-black font-medium">Price: </span>
                      <span className="text-red-500 font-semibold">
                        ₹{userlist.price?.toLocaleString()}
                        {userlist.listingType === "rent" && "/month"}
                      </span>
                    </p>

                    {/* Listing Type */}
                    <p className="mt-2">
                      <span className="text-black font-medium">Type: </span>
                      <span className="text-red-500 font-semibold capitalize">
                        {userlist.listingType}
                      </span>
                    </p>

                    {/* Property Type */}
                    <p className="mt-2">
                      <span className="text-black font-medium">Property: </span>
                      <span className="text-red-500 font-semibold capitalize">
                        {userlist.propertyType}
                      </span>
                    </p>

                    {/* BHK (if exists) */}
                    {userlist.bhk && (
                      <p className="mt-2">
                        <span className="text-black font-medium">BHK: </span>
                        <span className="text-blue-500 font-semibold">
                          {userlist.bhk}
                        </span>
                      </p>
                    )}

                    {/* Area */}
                    <p className="mt-2">
                      <span className="text-black font-medium">Area: </span>
                      <span className="text-green-500 font-semibold">
                        {userlist.area} sq.ft
                      </span>
                    </p>

                    {/* Status */}
                    <p className="mt-2">
                      <span className="text-black font-medium">Status: </span>
                      <span
                        className={
                          userlist.status === "available"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {userlist.status}
                      </span>
                    </p>

                    {/* Features count */}
                    {userlist.features && userlist.features.length > 0 && (
                      <p className="mt-2">
                        <span className="text-black font-medium">
                          Features:{" "}
                        </span>
                        <span className="text-purple-500 font-semibold">
                          {userlist.features.length}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-3 justify-center sm:justify-between text-center sm:text-right">
                  <button
                    className="text-sm text-red-600 hover:underline px-2 py-1 hover:bg-red-50 rounded"
                    onClick={() => handleDelete(index)}
                    disabled={del === index}
                  >
                    {del === index ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="text-sm text-green-600 hover:underline px-2 py-1 hover:bg-green-50 rounded"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-blue-600 hover:underline px-2 py-1 hover:bg-blue-50 rounded"
                    onClick={() => handleview(index)}
                  >
                    View Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-10 px-4">
          <h1 className="font-bold text-lg sm:text-2xl mb-4">
            You have not created any listings yet.
          </h1>
          <NavLink
            className="text-green-500 text-base sm:text-lg cursor-pointer hover:underline inline-block px-6 py-2 bg-green-50 rounded-lg"
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
