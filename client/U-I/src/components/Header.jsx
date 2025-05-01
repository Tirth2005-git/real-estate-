import { FaSearch } from "react-icons/fa";
import { NavLink } from "react-router-dom";
function Header() {
  return (
    <>
      <header className="bg-gray-100 flex flex-wrap p-3 justify-between mx-auto shadow-md items-center">
        <h1 className="font-bold text-sm sm:text-xl">
          <span className="text-gray-300">YourReal</span>
          <span className="text-gray-500">Estate</span>
        </h1>
        <form className="bg-gray-200 flex items-center p-3 rounded-lg gap-4">
          <input
            type="text"
            className="w-24 sm:w-48 focus:outline-none"
            placeholder="Search.."
          ></input>
          <FaSearch className="text-gray-700"></FaSearch>
        </form>
        <ul className="flex gap-5">
          <li>
            <NavLink
              className="hidden sm:inline hover:underline text-gray-700"
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hidden sm:inline hover:underline text-gray-700"
              to="/about"
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              className="hidden sm:inline hover:underline text-gray-700"
              to="/sign-in"
            >
              SignIn
            </NavLink>
          </li>
        </ul>
      </header>
    </>
  );
}
export default Header;
