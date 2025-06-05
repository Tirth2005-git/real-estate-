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
            Your Listings Are
          </h1>
          <div className="flex flex-col gap-4 mt-3 items-center px-4">
            {listings.map((userlist, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white w-full max-w-3xl shadow-md items-center"
              >
                <div className="w-full sm:w-auto">
                  <img
                    src={userlist.images[0].imageurl}
                    alt="House"
                    className="w-full sm:w-36 h-32 object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-semibold text-black">
                    {userlist.title}
                  </p>

                  <div className="flex flex-col text-gray-500 text-sm sm:text-base">
                    <p>{userlist.address.streetAddress}</p>
                    <p>
                      {userlist.address.city}, {userlist.address.state}
                    </p>
                  </div>

                 
                  <div className="flex flex-col sm:flex-row sm:space-x-4">
                    <p className="text-sm sm:text-base mt-2">
                      <span className="text-black font-medium">
                        Listing Type:{" "}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {userlist.listingType}
                      </span>
                    </p>

                    <p className="text-sm sm:text-base mt-2">
                      <span className="text-black font-medium">
                        Property Type:{" "}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {userlist.propertyType}
                      </span>
                    </p>

                    <p className="text-sm sm:text-base mt-2">
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
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 justify-center sm:justify-between text-center sm:text-right">
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => handleDelete(index)}
                  >
                    {del === index ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="text-sm text-green-600 hover:underline"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-sm text-black hover:underline"
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
        <h1 className="text-center mt-6 px-4">
          <span className="font-bold text-lg sm:text-2xl block">
            You have not created any listings yet.
          </span>
          <NavLink
            className="text-green-500 mt-2 text-base sm:text-lg cursor-pointer hover:underline inline-block"
            to="/create-listing"
          >
            Create Listing
          </NavLink>
        </h1>
      )}
    </>
  );
}
export default UserListings;
