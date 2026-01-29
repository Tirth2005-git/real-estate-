import { useState } from "react";

const LOCALITIES = [
  "Andheri", "Bandra", "Borivali", "Dadar", "Goregaon", "Malad", "Powai",
  "Thane", "Chembur", "Kandivali", "Juhu", "Santacruz", "Lower Parel",
  "Worli", "Colaba", "Vile Parle", "Dahisar", "Mira Road", "Bhandup",
  "Mulund", "Vikhroli", "Ghatkopar", "Kurla", "Sion", "Matunga",
];

function FindDealers() {
  const [locality, setLocality] = useState("");
  const [dealerType, setDealerType] = useState("");

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Find Dealers</h1>
        <p className="text-gray-500 mt-1">
          Search dealers by locality and type
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white shadow-lg rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <select
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Select Locality</option>
          {LOCALITIES.map((loc) => (
            <option key={loc} value={loc.toLowerCase()}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={dealerType}
          onChange={(e) => setDealerType(e.target.value)}
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">Dealer Type</option>
          <option value="individual">Individual</option>
          <option value="agency">Agency</option>
        </select>

        <button
          className="bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition"
        >
          Search Dealers
        </button>
      </div>

      {/* Result Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 bg-gray-200 rounded-full" />
              <div>
                <p className="font-semibold text-gray-800">Dealer Name</p>
                <p className="text-sm text-gray-500">Agency · Andheri</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              Specializes in residential & rental listings.
            </p>

            <button className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindDealers;
