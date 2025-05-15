import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleO from "../components/GoogleO.jsx";
function Signup() {
  const navigate = useNavigate();
  const [formdata, setdata] = useState({});
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);
  function handleChange(e) {
    setdata({ ...formdata, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!formdata.username || !formdata.email || !formdata.password) return;
      setloading(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
        setloading(false);
        seterror(data.message);
        return;
      }
      setloading(false);
      seterror(null);
      navigate("/sign-in");
    } catch (err) {
      setloading(false);
      seterror(err.message);
      console.log(err.message);
    }
  }
  return (
    <>
      <div
        className="mx-auto flex items-center  flex-col mt-8
       bg-gray-100 max-w-md p-2 shadow-lg rounded-md"
      >
        <h1 className="text-center text-2xl text-gray-600">Sign Up</h1>
        <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="User Name"
            className="bg-gray-200 rounded-lg w-72 p-2"
            id="username"
            onChange={handleChange}
          ></input>
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
            id="password"
            onChange={handleChange}
          ></input>
          <button className="bg-gray-400 rounded-lg w-72 p-2 mt-3 text-gray-900 hover:opacity-90">
            {loading ? "LOADING" : "SIGN UP"}
          </button>
          <GoogleO></GoogleO>
        </form>
        <div className="flex gap-2 mt-2 justify-start">
          <p className="text-gray-600"> Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-600">SignIn</span>
          </Link>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </>
  );
}

export default Signup;
