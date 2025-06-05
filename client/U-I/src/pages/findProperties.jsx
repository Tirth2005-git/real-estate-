import { useSelector, useDispatch } from "react-redux";
import { setVisbility } from "../redux/formslice.jsx";
import { setproperties } from "../redux/propertiesSlice.jsx";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
function FindProperties() {
  const [formdata, setformdata] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searcherror, setSeacrhError] = useState(false);
  const { showForm } = useSelector((state) => state.formToggle);
  const { properties } = useSelector((state) => state.properties);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleview(index) {
    navigate("/listing", { state: properties[index] });
  }
  useEffect(() => {
    dispatch(setVisbility());
  }, [properties]);
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!formdata) {
        setSearching(false);
        setSeacrhError("search params cannot be empty");
        return;
      }
      setSearching(true);
      const searchParams = {};
      Object.keys(formdata).map((key) => {
        if (formdata[key] && formdata[key].toString().trim()) {
          searchParams[key] = formdata[key].trim();
        }
      });

      if (Object.keys(searchParams).length == 0) {
        setSearching(false);
        setSeacrhError("search params cannot be empty");
        return;
      }

      const res = await fetch("/api/browse/listing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      });
      if (!res.ok) {
        const data = await res.json();
        setSearching(false);
        setSeacrhError(data.message);
        return;
      }

      const data = await res.json();

      if (data.searchResults.length == 0) {
        setSearching(false);
        setSeacrhError("No Results found");
        return;
      }
      dispatch(setproperties(data.searchResults));
      setSearching(false);
      setSeacrhError(false);
      setformdata(0);
    } catch (err) {
      setSearching(false);
      setSeacrhError(err.message);
    }
  }
  return (
    <>
      <form
        className={`w-full max-w-2xl bg-gray-200 rounded-xl p-5 z-30 flex flex-col sm:flex-row gap-4 fixed left-1/2 -translate-x-1/2 transition-all duration-500 ${
          showForm ? "top-10" : "-top-full"
        }`}
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <label className="block font-medium text-xs text-gray-700 sm:text-sm mb-2 mt-2">
            Listing Type
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            {["rent", "sale"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  id="listingType"
                  name="listingType"
                  value={type}
                  checked={formdata?.listingType === type}
                  onChange={(e) => {
                    if (formdata?.listingType !== e.target.value) {
                      setformdata({
                        ...formdata,
                        listingType: e.target.value,
                      });
                    }
                  }}
                  onClick={(e) => {
                    if (formdata?.listingType === e.target.value) {
                      setformdata({
                        ...formdata,
                        listingType: "",
                      });
                    }
                  }}
                  className="accent-blue-500"
                />
                <span className="text-xs sm:text-base text-gray-700 ml-2">
                  {type}
                </span>
              </label>
            ))}
          </div>

          <label className="block font-medium text-xs text-gray-700 sm:text-sm mb-2 mt-4">
            Property Type
          </label>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            {["villa", "bungalow", "flat", "office space"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  id="propertyType"
                  name="propertyType"
                  value={type}
                  className="accent-blue-500"
                  checked={formdata?.propertyType === type}
                  onChange={(e) => {
                    if (formdata?.propertyType !== e.target.value) {
                      setformdata({
                        ...formdata,
                        propertyType: e.target.value,
                      });
                    }
                  }}
                  onClick={(e) => {
                    if (formdata?.propertyType === e.target.value) {
                      setformdata({
                        ...formdata,
                        propertyType: "",
                      });
                    }
                  }}
                />
                <span className="text-xs sm:text-base text-gray-700 ml-2">
                  {type}
                </span>
              </label>
            ))}
          </div>

          <label className="block font-medium text-xs text-gray-700 sm:text-sm mb-2 mt-4">
            Price Range
          </label>
          <div className="w-full flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              className="w-full sm:w-32 bg-white rounded-lg text-sm p-1"
              id="minPrice"
              min="1000"
              value={formdata?.["minPrice"] || ""}
              placeholder="Min Price"
              onChange={(e) =>
                setformdata({ ...formdata, [e.target.id]: e.target.value })
              }
            />
            <input
              type="number"
              className="w-full sm:w-32 bg-white rounded-lg text-sm p-1"
              id="maxPrice"
              placeholder="Max Price"
              min="1000"
              value={formdata?.["maxPrice"] || ""}
              onChange={(e) =>
                setformdata({ ...formdata, [e.target.id]: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          <label className="block font-medium text-xs text-gray-700 sm:text-sm mb-2 mt-4">
            Location
          </label>
          <input
            type="text"
            placeholder="State"
            className="bg-white text-black p-1 text-sm rounded-lg w-full"
            id="address.state"
            value={formdata?.["address.state"] || ""}
            onChange={(e) =>
              setformdata({
                ...formdata,
                [e.target.id]: e.target.value.trim().toLowerCase(),
              })
            }
          />
          <input
            type="text"
            placeholder="City"
            className="bg-white text-black p-1 text-sm rounded-lg w-full"
            id="address.city"
            value={formdata?.["address.city"] || ""}
            onChange={(e) =>
              setformdata({
                ...formdata,
                [e.target.id]: e.target.value.trim().toLowerCase(),
              })
            }
          />
          <input
            type="text"
            placeholder="Zipcode"
            className="bg-white text-black p-1 text-sm rounded-lg w-full"
            id="address.zipcode"
            value={formdata?.["address.zipcode"] || ""}
            onChange={(e) =>
              setformdata({
                ...formdata,
                [e.target.id]: e.target.value.trim().toLowerCase(),
              })
            }
          />
          <button
            type="submit"
            className="text-white bg-green-600 hover:bg-green-500 rounded w-full p-1 block"
          >
            {searching ? "Searching" : "Search"}
          </button>
          {searcherror ? (
            <p className="text-red-400 text-sm flex justify-center">
              {searcherror}
            </p>
          ) : null}
        </div>
      </form>
      {properties.length > 0 ? (
        <>
          <h1 className="text-xl sm:text-xl text-black font-bold text-center mt-4">
            Your Results Are
          </h1>
          <div className="flex flex-col gap-4 mt-3 items-center px-4">
            {properties.map((userlist, index) => (
              <div
                className="bg-white rounded-lg w-full max-w-3xl shadow-md"
                key={index}
              >
                <div
                  className="flex flex-col sm:flex-row gap-4 p-4 justify-center items-center"
                  onClick={() => handleview(index)}
                >
                  <div className="w-full sm:w-auto">
                    <img
                      src={userlist.images[0].imageurl}
                      alt="House"
                      className="w-full sm:w-36 h-32 object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                    <p className="text-lg sm:text-xl font-semibold text-black">
                      {userlist.title}
                    </p>

                    <div className="flex flex-col text-gray-500 text-sm sm:text-base">
                      <p>{userlist.address?.streetAddress}</p>
                      <p>
                        {userlist.address?.city}, {userlist.address?.state}
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
                </div>

                <div className="flex justify-between items-center px-4 py-2 border-t text-sm text-gray-600">
                  <a
                    href={`mailto:${userlist.listedBy.contact?.email}`}
                    className="flex items-center gap-1  "
                  >
                    📧{" "}
                    <span className="underline hover:pointer ">
                      {userlist.listedBy.contact?.email}
                    </span>
                  </a>
                  <a
                    href={`https://wa.me/91${userlist.listedBy.contact?.phone}`}
                    className="flex items-center gap-1 "
                  >
                    📞{" "}
                    <span className="underline hover:pointer ">
                      {userlist.listedBy.contact?.phone}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <h1 className="text-center mt-6 px-4">
          <span className="font-bold text-lg sm:text-2xl block">
            Search to find Properties
          </span>
        </h1>
      )}
    </>
  );
}
export default FindProperties;
