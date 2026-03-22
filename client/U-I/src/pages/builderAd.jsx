import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { deleteAd } from "../redux/adsslice";

function BuilderAds() {
  const { currentuser } = useSelector((state) => state.user);
  const { ads } = useSelector((state) => state.ads);
  const [del, setDel] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleView(index) {
    navigate("/ad", { state: ads[index] });
  }

  async function handleDelete(index) {
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
     
      setDel(null);
    }
  }

  return (
    <>
      {ads.length > 0 ? (
        <>
          <div className="pt-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Your Advertisements
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Projects promoted by you
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-8 items-center px-4 pb-10">
            {ads.map((ad, index) => (
              <div
                key={index}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* IMAGE */}
                  <div className="sm:w-60 w-full h-48 sm:h-auto">
                    <img
                      src={ad.images?.[0]?.imageurl}
                      alt="Project"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    {/* Title */}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                        {ad.projectName}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {ad.location}
                      </p>
                    </div>

                    {/* INFO BADGES */}
                    <div className="flex flex-wrap gap-2 mt-4 text-sm">
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full capitalize">
                        {ad.projectType}
                      </span>

                      {ad.unitTypes?.map((unit, i) => (
                        <span
                          key={i}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                        >
                          {unit}
                        </span>
                      ))}
                    </div>

                    {/* PRICE */}
                    <div className="mt-4 text-xl font-bold text-red-600">
                      ₹{ad.priceRange.min.toLocaleString()} – ₹
                      {ad.priceRange.max.toLocaleString()}
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => handleView(index)}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm"
                      >
                        View Project
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        disabled={del === index}
                        className="px-5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm"
                      >
                        {del === index ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center pt-24 pb-20 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            No Advertisements Yet
          </h2>

          <NavLink
            to="/create-ad"
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Create Your First Ad
          </NavLink>
        </div>
      )}
    </>
  );
}

export default BuilderAds;
