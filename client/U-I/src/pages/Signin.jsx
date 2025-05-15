import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { start, succcess, failure } from "../redux/userslice.jsx";
import { useSelector, useDispatch } from "react-redux";
import GoogleO from "../components/GoogleO.jsx";
import { setAfterlogin } from "../redux/listingslice.jsx";

function Signin() {
  const navigate = useNavigate();
  const [formdata, setdata] = useState({});
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  const dispatch = useDispatch();
  function handleChange(e) {
    setdata({ ...formdata, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!formdata.email || !formdata.userpassword) return;
      dispatch(start());
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(failure(data.message));
        return;
      }

      dispatch(succcess(data.user));
      if (data.userlisting) {
        dispatch(setAfterlogin(data.userlisting));
      }
      navigate("/");
    } catch (err) {
      dispatch(failure(err.message));
    }
  }
  return (
    <>
      <div
        className="mx-auto flex items-center  flex-col mt-8
       bg-gray-100 max-w-md p-2 shadow-lg rounded-md"
      >
        <h1 className="text-center text-2xl text-gray-600">Sign In</h1>
        <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-200 rounded-lg w-72 p-2"
            id="email"
            onChange={handleChange}
          ></input>
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-200 rounded-lg w-72 p-2"
            id="userpassword"
            onChange={handleChange}
          ></input>
          <button className="bg-gray-400 rounded-lg w-72 p-2 mt-3 text-gray-900 hover:opacity-90">
            {loading ? "LOADING" : "SIGN IN"}
          </button>
          <GoogleO></GoogleO>
        </form>
        <div className="flex gap-2 mt-2 justify-start">
          <p className="text-gray-600">Don't Have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-600">SignUp</span>
          </Link>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </>
  );
}

export default Signin;
