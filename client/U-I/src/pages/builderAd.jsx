import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
//import { deleteAd } from "../redux/adsSlice.jsx";

function BuilderAds() {
  const { currentuser } = useSelector((state) => state.user);
  const { ads } = useSelector((state) => state.ads);
  const [del, setDel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleView(index) {
    navigate("/ad", { state: ads[index] });
  }

  /*async function handleDelete(index) {
    try {
      setDel(index);
      const adToDelete = ads[index];
      const { _id: adId } = adToDelete;

      let res = await fetch(`/api/ads/delete/${currentuser._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId }),
      });

      res = await res.json();
      if (res.success === false) throw new Error(res.message);

      const newAds = ads.filter((_, i) => i !== index);
      dispatch(deleteAd(newAds));
      setDel(null);
    } catch (err) {
      console.error(err);
      setDel(null);
    }
  }
*/
  return (
    <>
      {ads.length > 0 ? (
        <>
          <h1 className="text-xl sm:text-2xl text-black font-bold text-center mt-4">
            Your Advertisements
          </h1>

          <div className="flex flex-col gap-4 mt-3 items-center px-4">
            {ads.map((ad, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-white w-full max-w-3xl shadow-md items-center"
              >
                {/* Image */}
                <img
                  src={ad.images?.[0]?.imageurl}
                  alt="Project"
                  className="w-full sm:w-36 h-32 object-cover rounded-md"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                  <p className="text-lg sm:text-2xl font-semibold text-black">
                    {ad.projectName}
                  </p>

                  <p className="text-gray-500 text-sm sm:text-base">
                    {ad.location}
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm sm:text-base">
                    <p>
                      <span className="font-medium">Type: </span>
                      {ad.projectType}
                    </p>

                    <p>
                      <span className="font-medium">Units: </span>
                      {ad.unitTypes.join(", ")}
                    </p>

                    <p>
                      <span className="font-medium">Price: </span>₹
                      {ad.priceRange.min.toLocaleString()} – ₹
                      {ad.priceRange.max.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    className="text-sm text-blue-600 hover:underline px-2 py-1 hover:bg-blue-50 rounded"
                    onClick={() => handleView(index)}
                  >
                    View
                  </button>

                  <button
                    className="text-sm text-red-600 hover:underline px-2 py-1 hover:bg-red-50 rounded"
                    onClick={() => handleDelete(index)}
                    disabled={del === index}
                  >
                    {del === index ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center mt-10 px-4">
          <h1 className="font-bold text-lg sm:text-2xl mb-4">
            You have not created any advertisements yet.
          </h1>
          <NavLink
            className="text-green-500 text-base sm:text-lg cursor-pointer hover:underline inline-block px-6 py-2 bg-green-50 rounded-lg"
            to="/create-ad"
          >
            Create Your First Ad
          </NavLink>
        </div>
      )}
    </>
  );
}

export default BuilderAds;
