import { useState } from "react";
import Select from "react-select";

const LOCALITIES = [
  "Andheri",
  "Bandra",
  "Borivali",
  "Dadar",
  "Goregaon",
  "Malad",
  "Powai",
  "Thane",
  "Chembur",
  "Kandivali",
  "Juhu",
  "Santacruz",
  "Lower Parel",
  "Worli",
  "Colaba",
  "Vile Parle",
  "Dahisar",
  "Mira Road",
  "Bhandup",
  "Mulund",
  "Vikhroli",
  "Ghatkopar",
  "Kurla",
  "Sion",
  "Matunga",
];
const localityOptions = LOCALITIES.map((l) => ({
  value: l.toLowerCase(),
  label: l,
}));

const dealerTypeOptions = [
  { value: "", label: "All Dealer Types" },
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" },
];

function FindDealers() {
  const [locality, setLocality] = useState("");
  const [dealerType, setDealerType] = useState("");
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          {loading ? "Searching..." : "Search Dealers"}
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {loading && (
        <p className="text-center text-gray-500">Loading dealers...</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealers.map((dealer) => (
          <div
            key={dealer._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between"
          >
            {/* Header */}
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

            {/* Localities */}
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

            {/* Description */}
            {dealer.companyDescription && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {dealer.companyDescription}
              </p>
            )}

            {/* Contact (EMAIL ONLY) */}
            {dealer.contact?.email && (
              <p className="text-sm text-gray-600">📧 {dealer.contact.email}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindDealers;
