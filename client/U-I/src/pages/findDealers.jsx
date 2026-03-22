import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchDealerSuccess } from "../redux/dealerProfileSlice";
import { useDispatch } from "react-redux";
const mumbaiLocalities = [
  "colaba",
  "nariman point",
  "marine lines",
  "churchgate",
  "fort",
  "cuffe parade",
  "malabar hill",
  "walkeshwar",
  "breach candy",
  "tardeo",
  "haji ali",
  "worli",
  "lower parel",
  "prabhadevi",
  "dadar",
  "mahim",
  "matunga",
  "sion",

  "bandra",
  "khar",
  "santacruz",
  "vile parle",
  "andheri",
  "jogeshwari",
  "goregaon",
  "malad",
  "kandivali",
  "borivali",
  "dahisar",

  "kurla",
  "vidyavihar",
  "ghatkopar",
  "vikroli",
  "bhandup",
  "mulund",
  "thane",
  "kalyan",
  "dombivli",
  "ambernath",
  "badlapur",

  "mankhurd",
  "govandi",
  "chembur",
  "tilak nagar",
  "koperkhairane",
  "navi mumbai",
  "nerul",
  "vashi",
  "sanpada",
  "seawoods",
  "belapur",
  "kharghar",
  "panvel",

  "byculla",
  "mazgaon",
  "parel",
  "lalbaug",
  "chinchpokli",
  "sewri",
  "wadala",
  "sion",
  "king circle",
  "mumbai central",
  "grant road",
  "charni road",
  "matunga west",
  "dadar west",
  "prabhadevi west",
  "dadar east",
  "parel east",
  "mahalakshmi",
  "mahim west",
  "bandra west",
  "bandra east",
  "khar west",
  "khar east",
  "santacruz east",
  "santacruz west",
  "vile parle east",
  "vile parle west",
  "andheri east",
  "andheri west",
  "jogeshwari east",
  "jogeshwari west",
  "goregaon east",
  "goregaon west",
  "malad east",
  "malad west",
  "kandivali east",
  "kandivali west",
  "borivali east",
  "borivali west",
  "dahisar east",
  "dahisar west",
  "mira road",
  "bhayandar",
  "naigaon",
  "vasai",
  "virar",
];
const localityOptions = mumbaiLocalities.map((l) => ({
  value: l.toLowerCase(),
  label: l,
}));

const dealerTypeOptions = [
  { value: "", label: "All Dealer Types" },
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" },
];

function FindDealers() {
  const [loadingDealerId, setLoadingDealerId] = useState(null);
  const [locality, setLocality] = useState("");
  const [dealerType, setDealerType] = useState("");
  const [dealers, setDealers] = useState([]);
  const [Dloading, setLoading] = useState(false);
  const [Derror, setError] = useState("");
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  async function handleViewProfile(dealerId) {
    try {
      setLoadingDealerId(dealerId);
      setError("");

      const res = await fetch(`/api/dealers/${dealerId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to load dealer");
        return;
      }

      dispatch(
        fetchDealerSuccess({
          dealer: data.dealer,
          listings: data.listings || [],
        }),
      );

      navigate("/dealer-profile");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoadingDealerId(null);
    }
  }

  async function handleSearchDealers() {
    try {
      if (!locality.trim()) {
        setError("Please select a locality");
        return;
      }

      setLoading(true);
      setError("");

      const res = await fetch("/api/browse/dealers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locality: locality.toLowerCase(),
          dealerType: dealerType || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Search failed");
        setLoading(false);
        return;
      }

      if (!data.dealers || data.dealers.length === 0) {
        setError("No dealers found in this area");
        setDealers([]);
        setLoading(false);
        return;
      }

      setDealers(data.dealers);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Find Dealers</h1>
        <p className="text-gray-500 mt-1">
          Search dealers by locality and type
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <Select
          options={localityOptions}
          placeholder="Search locality..."
          className="w-full"
          onChange={(opt) => setLocality(opt?.value || "")}
        />

        <Select
          options={dealerTypeOptions}
          placeholder="Dealer type..."
          className="w-full"
          onChange={(opt) => setDealerType(opt?.value || "")}
        />

        <button
          onClick={handleSearchDealers}
          className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition"
        >
          {Dloading ? "Searching..." : "Search Dealers"}
        </button>
      </div>

      {Derror && <p className="text-red-500 text-center mb-6">{Derror}</p>}

      {Dloading && (
        <p className="text-center text-gray-500">Loading dealers...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => (
          <div
            key={dealer._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {dealer.pfp ? (
                  <img
                    src={dealer.pfp}
                    alt={dealer.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-800 leading-tight">
                  {dealer.dealerType === "agency" && dealer.companyName
                    ? dealer.companyName
                    : dealer.name || "Dealer"}
                </p>

                <p className="text-sm text-gray-500 capitalize">
                  {dealer.dealerType}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {dealer.localities?.map((loc) => (
                <span
                  key={loc}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                >
                  {loc}
                </span>
              ))}
            </div>

            {dealer.companyDescription && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {dealer.companyDescription}
              </p>
            )}

            {dealer.contact?.email && (
              <p className="text-sm text-gray-600">📧 {dealer.contact.email}</p>
            )}
            {currentuser && currentuser.role !== "builder" && (
              <button
                onClick={() => handleViewProfile(dealer._id)}
                disabled={loadingDealerId === dealer._id}
                className={`mt-4 w-full text-sm py-2 rounded-lg transition ${
                  loadingDealerId === dealer._id
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                {loadingDealerId === dealer._id ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "View Profile"
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindDealers;
