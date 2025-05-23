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
      if (data.success  === false) {
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
      <div className="mx-auto mt-8 bg-gray-100 w-80 sm:w-96 md:w-[28rem] p-6 shadow-lg rounded-md flex flex-col items-center">
        <h1 className="text-2xl text-gray-600 font-semibold mb-4">Sign Up</h1>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="User Name"
            className="bg-gray-200 rounded-lg p-2 w-full"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-200 rounded-lg p-2 w-full"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-200 rounded-lg p-2 w-full"
            id="password"
            onChange={handleChange}
          />
          <button className="bg-gray-400 rounded-lg p-2 mt-2 text-white font-medium hover:bg-gray-500 transition w-full">
            {loading ? "LOADING" : "SIGN UP"}
          </button>

          <GoogleO />
        </form>

        <div className="flex gap-1 mt-4 text-sm text-gray-600">
          <p>Have an account?</p>
          <Link
            to="/sign-in"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center w-full">
            {error}
          </p>
        )}
      </div>
    </>
  );
}

export default Signup;
