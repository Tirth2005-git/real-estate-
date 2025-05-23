import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-800">
      <section className="bg-[url('/hero-image.jpg')] bg-cover bg-center h-[80vh] flex items-center justify-center">
        <div className="bg-black/60 p-6 md:p-10 rounded-xl text-center text-white max-w-xl mx-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-base md:text-lg mb-6">
            Flats, bungalows, villas, office spaces — we have it all.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/find-properties">
              <button className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition w-48">
                Browse Listings
              </button>
            </Link>
            <Link to="/create-listing">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition w-48">
                List Your Property
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          Browse by Property Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { type: "Flat", image: "/flat.jpg" },
            { type: "Bungalow", image: "/bungalow.jpg" },
            { type: "Villa", image: "/villa.jpg" },
            { type: "Office Space", image: "/office.jpg" },
          ].map((typ) => (
            <Link key={typ.type}>
              <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition">
                <img
                  src={typ.image}
                  alt={typ.type}
                  className="h-14 sm:h-16 mx-auto mb-3"
                />
                <p className="text-base md:text-lg font-medium">{typ.type}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl mb-2">🔒</div>
            <h3 className="font-semibold text-lg">Verified Listings</h3>
            <p className="text-sm text-gray-600 mt-1">
              Every listing is checked to ensure quality and accuracy.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">📞</div>
            <h3 className="font-semibold text-lg">Direct Contact</h3>
            <p className="text-sm text-gray-600 mt-1">
              No middlemen. Speak directly with owners.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">✅</div>
            <h3 className="font-semibold text-lg">No Brokerage</h3>
            <p className="text-sm text-gray-600 mt-1">
              Free platform to save you unnecessary costs.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold text-lg">Fast & Easy</h3>
            <p className="text-sm text-gray-600 mt-1">
              Clean UI and blazing fast search experience.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-10 mt-10 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-3">
          Ready to get started?
        </h2>
        <p className="mb-6 text-sm md:text-base">
          Browse listings or post your own property today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/find-properties">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition w-48">
              Start Browsing
            </button>
          </Link>
          <Link to="/create-listing">
            <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition w-48">
              Post a Property
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
