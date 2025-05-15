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
      console.log(err.message);
    }
  }
  function handleEdit(index) {
    navigate("/update-listing", { state: listings[index] });
  }
  return (
    <>
      {listings.length > 0 ? (
        <>
          <h1 className="text-2xl text-black font-bold text-center mt-4">
            Your Listings Are
          </h1>
          <div className="flex flex-col gap-4 mt-3 items-center">
            {listings.map((userlist, index) => {
              return (
                <div className="flex gap-4 p-4 rounded-lg bg-white w-full max-w-2xl shadow-md items-center">
                  <div>
                    <img
                      src={userlist.images[0].imageurl}
                      alt="House"
                      className="w-36 h-24 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-2xl font-semibold text-black">
                      {userlist.title}
                    </p>

                    <div className="flex flex-col text-gray-500 text-base">
                      <p>{userlist.address.streetAddress}</p>
                      <p>
                        {userlist.address.city}, {userlist.address.state}
                      </p>
                    </div>

                    <p className="text-base mt-2">
                      <span className="text-black font-medium">
                        Listing Type:{" "}
                      </span>
                      <span className="text-red-500 font-semibold">
                        {userlist.listingType}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col justify-between  gap-3">
                    <button
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => handleDelete(index)}
                    >
                      {del === index ? "Deleteing" : "Delete"}
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
                      ViewListing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <h1 className="text-center mt-3">
          <span className="font-bold tex-2xl">
            You have not created any listings yet. Create one:
          </span>

          <NavLink
            className="flex text-green-500 justify-center mt-3 text-lg cursor-pointer active:scale-50 tex-2xl "
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
