import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const { currentuser } = useSelector((state) => state.user);

  const isLoggedIn = !!currentuser;
  const isBuilder = currentuser?.role === "builder";

  return (
    <div className="w-full min-h-screen bg-gray-100 text-gray-800">
      {/* HERO */}
      <section className="bg-[url('/hero-image.jpg')] bg-cover bg-center h-[80vh] flex items-center justify-center">
        <div className="bg-black/60 p-6 md:p-10 rounded-xl text-center text-white max-w-xl mx-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {!isLoggedIn
              ? "Find Your Dream Property in Mumbai"
              : isBuilder
              ? "Promote Your Projects"
              : "Find Your Perfect Home"}
          </h1>

          <p className="text-base md:text-lg mb-6">
            {!isLoggedIn
              ? "Buy, sell, or promote properties with ease on one platform."
              : isBuilder
              ? "Showcase your projects, reach buyers, and grow your business."
              : "Flats, bungalows, villas, office spaces — we have it all."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/sign-up">
                  <button className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition w-48">
                    Sign Up
                  </button>
                </Link>

                <Link to="/sign-in">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition w-48">
                    Sign In
                  </button>
                </Link>
              </>
            ) : isBuilder ? (
              <>
                <Link to="/create-ad">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition w-48">
                    Create Ad
                  </button>
                </Link>

                <Link to="/builder-ads">
                  <button className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition w-48">
                    Your Ads
                  </button>
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* MID SECTION */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          {!isLoggedIn
            ? "Explore Property Options"
            : isBuilder
            ? "Grow Your Project Reach"
            : "Browse by Property Type"}
        </h2>

        {!isLoggedIn ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">🏠</div>
              <h3 className="font-semibold text-lg">Buy & Rent</h3>
              <p className="text-sm text-gray-600 mt-1">
                Find homes across Mumbai easily.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">📢</div>
              <h3 className="font-semibold text-lg">Post Listings</h3>
              <p className="text-sm text-gray-600 mt-1">
                List your property in minutes.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">🏗</div>
              <h3 className="font-semibold text-lg">Promote Projects</h3>
              <p className="text-sm text-gray-600 mt-1">
                Builders can advertise projects.
              </p>
            </div>
          </div>
        ) : isBuilder ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">📢</div>
              <h3 className="font-semibold text-lg">Promote Projects</h3>
              <p className="text-sm text-gray-600 mt-1">
                Showcase your projects to thousands of buyers.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">🎯</div>
              <h3 className="font-semibold text-lg">Targeted Reach</h3>
              <p className="text-sm text-gray-600 mt-1">
                Reach users based on preferences.
              </p>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-semibold text-lg">Increase Visibility</h3>
              <p className="text-sm text-gray-600 mt-1">
                Get more exposure quickly.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { type: "Flat", image: "/flat.jpg" },
              { type: "Bungalow", image: "/bungalow.jpg" },
              { type: "Villa", image: "/villa.jpg" },
              { type: "Office Space", image: "/office.jpg" },
            ].map((typ) => (
              <div
                key={typ.type}
                className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-xl transition"
              >
                <img
                  src={typ.image}
                  alt={typ.type}
                  className="h-14 sm:h-16 mx-auto mb-3"
                />
                <p className="text-base md:text-lg font-medium">
                  {typ.type}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY SECTION */}
      <section className="bg-white py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          {isBuilder ? "Why Advertise With Us?" : "Why Choose Us?"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {isBuilder ? (
            <>
              <div>
                <div className="text-4xl mb-2">📢</div>
                <h3 className="font-semibold text-lg">High Visibility</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showcase projects across Mumbai.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="font-semibold text-lg">Targeted Reach</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Reach relevant buyers.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">📞</div>
                <h3 className="font-semibold text-lg">Direct Leads</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Get direct inquiries.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-lg">Easy Promotion</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Simple ad management.
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-4xl mb-2">🔒</div>
                <h3 className="font-semibold text-lg">Verified Listings</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Trusted properties.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">📞</div>
                <h3 className="font-semibold text-lg">Direct Contact</h3>
                <p className="text-sm text-gray-600 mt-1">
                  No middlemen.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-semibold text-lg">No Brokerage</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Save costs.
                </p>
              </div>

              <div>
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="font-semibold text-lg">Fast & Easy</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Smooth experience.
                </p>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-10 mt-10 text-center px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link to="/sign-up">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Get Started
                </button>
              </Link>

              <Link to="/sign-in">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Login
                </button>
              </Link>
            </>
          ) : isBuilder ? (
            <>
              <Link to="/create-ad">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Create Project Ad
                </button>
              </Link>

              <Link to="/builder-ads">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Manage Ads
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/find-properties">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Start Browsing
                </button>
              </Link>

              <Link to="/create-listing">
                <button className="bg-white text-blue-600 px-6 py-2 rounded-xl font-semibold w-48">
                  Post a Property
                </button>
              </Link>
            </>
          )}
        </div>
      </section>
    </div>
  );
}