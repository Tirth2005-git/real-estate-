import { FaSearch } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState } from "react";
import { setVisbility } from "../redux/formslice";
function Header() {
  const { currentuser } = useSelector((state) => state.user);
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  function toggleMenu() {
    document.querySelector("#mobmenu").classList.toggle("hidden");
  }
  useEffect(() => {
    const mobMenu = document.querySelector("#mobmenu");
    mobMenu.classList.add("hidden");
    if (toggle) {
      mobMenu.classList.add("hidden");
      setToggle(false);
    }
  }, [toggle, location.pathname]);

  const dispatch = useDispatch();
  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-gray-100 flex items-center justify-between px-4 sm:px-6 shadow-md z-50 flex-nowrap">
        <h1 className="font-bold text-sm sm:text-xl">
          <span className="text-gray-300">YourReal</span>
          <span className="text-gray-500">Estate</span>
        </h1>

        {location.pathname === "/find-properties" && (
          <div className="bg-gray-200 flex items-center px-2 py-1 rounded-lg gap-2 w-28 sm:w-36 md:w-52 lg:w-64 mx-2">
            <input
              type="text"
              className="w-full bg-transparent text-sm sm:text-base focus:outline-none"
              placeholder="Search..."
              id="search"
              readOnly
              onClick={() => dispatch(setVisbility())}
            />
            <FaSearch className="text-gray-700 flex-shrink-0" />
          </div>
        )}

        <ul className="hidden sm:flex gap-6 items-center">
          {currentuser && (
            <>
              <li>
                <NavLink
                  className="hover:underline text-lg text-gray-700"
                  to="/create-listing"
                >
                  CreateListing
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:underline text-lg text-gray-700"
                  to="/user-listings"
                >
                  YourListings
                </NavLink>
              </li>
            </>
          )}

          <li>
            <NavLink
              className="hover:underline text-lg text-gray-700"
              to="/find-properties"
            >
              BrowseListings
            </NavLink>
          </li>

          <li>
            <NavLink className="hover:underline text-lg text-gray-700" to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hover:underline text-lg text-gray-700"
              to="/profile"
            >
              {currentuser ? (
                <img
                  src={currentuser.pfp}
                  alt="Pfp"
                  className="h-8 w-8 rounded-full inline"
                />
              ) : (
                "Signin"
              )}
            </NavLink>
          </li>
        </ul>

        <GiHamburgerMenu
          onClick={toggleMenu}
          className="sm:hidden w-6 h-6 cursor-pointer text-gray-700"
        />
      </header>

      <div className="pt-16"></div>

      <div
        className="bg-white sm:hidden fixed top-0 right-0 pt-16  z-40"
        id="mobmenu"
      >
        <ul className="flex flex-col items-center gap-4 p-4">
          {currentuser && (
            <>
              <li>
                <NavLink
                  className="hover:underline text-base text-gray-700"
                  to="/create-listing"
                  onClick={() => setToggle(true)}
                >
                  CreateListing
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="hover:underline text-base text-gray-700"
                  to="/user-listings"
                  onClick={() => setToggle(true)}
                >
                  YourListings
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              className="hover:underline text-base text-gray-700"
              to="/"
              onClick={() => setToggle(true)}
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              className="hover:underline text-base text-gray-700"
              to="/find-properties"
              onClick={() => setToggle(true)}
            >
              BrowseListings
            </NavLink>
          </li>

          <li>
            <NavLink
              className="hover:underline text-base text-gray-700"
              to="/profile"
              onClick={() => setToggle(true)}
            >
              {currentuser ? (
                <img
                  src={currentuser.pfp}
                  alt="Pfp"
                  className="h-8 w-8 rounded-full inline"
                  onClick={() => setToggle(true)}
                />
              ) : (
                "Signin"
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
}
export default Header;
