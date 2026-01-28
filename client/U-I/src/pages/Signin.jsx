import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { start, succcess, failure } from "../redux/userslice.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setAfterlogin } from "../redux/listingslice.jsx";
import { setAds } from "../redux/adsslice.jsx";
function Signin() {
  const navigate = useNavigate();
  const [formdata, setdata] = useState({
    email: "",
    password: "",
  });

  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();

  function handleChange(e) {
    const { id, value } = e.target;
    setdata((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { email, password } = formdata;

    if (!email?.trim() || !password?.trim()) {
      dispatch(failure("Email and password are required"));
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "yahoo.in",
      "rediffmail.com",
      "icloud.com",
      "protonmail.com",
      "aol.com",
      "zoho.com",
      "mail.com",
      "gmail.co.in",
    ];

    if (!emailRegex.test(trimmedEmail)) {
      dispatch(failure("Please enter a valid email address"));
      return;
    }

    const domain = trimmedEmail.split("@")[1];

    if (!allowedDomains.includes(domain)) {
      dispatch(failure("Please enter a valid email domain"));
      return;
    }

    try {
      dispatch(start());

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(failure(data.message || "Login failed"));
        return;
      }

      
      dispatch(succcess(data.user));

      
      if (data.ads) {
        dispatch(setAds(data.ads)); 
      }

      if (data.userlisting) {
        dispatch(setAfterlogin(data.userlisting)); 
      }

      navigate("/");
    } catch (err) {
      dispatch(failure(err.message || "Something went wrong"));
    }
  }

  return (
    <>
      <div
        className="mx-auto flex items-center flex-col mt-8
        bg-gray-100 max-w-md p-4 shadow-lg rounded-md w-80 md:w-96 lg:w-1/3"
      >
        <h1 className="text-center text-2xl text-gray-600">Sign In</h1>

        <form
          className="flex flex-col gap-3 mt-5 w-full"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-200 rounded-lg w-full p-2"
            id="email"
            onChange={handleChange}
          />

          <input
            type="password"
            placeholder="Password"
            className="bg-gray-200 rounded-lg w-full p-2"
            id="password"
            onChange={handleChange}
          />

          <button className="bg-gray-400 rounded-lg w-full p-2 mt-3 text-gray-900 hover:opacity-90">
            {loading ? "SIGNING IN" : "SIGN IN"}
          </button>
        </form>

        <div className="flex gap-2 mt-2 justify-center w-full">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600">Sign Up</span>
          </Link>
        </div>

        {error && <p className="text-red-600 w-full text-center">{error}</p>}
      </div>
    </>
  );
}

export default Signin;
