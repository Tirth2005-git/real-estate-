import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase.js";
import { succcess, failure } from "../redux/userslice.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
function GoogleO() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handlegoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await fetch("/api/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          pfp: user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.succcess === false) {
        return dispatch(failure(data.message));
      }
      dispatch(succcess(data.user));
      navigate("/");
    } catch (err) {
      console.log(err.message);

      dispatch(failure(err.message));
    }
  }
  return (
    <>
      <button
        onClick={handlegoogle}
        className=" bg-red-700
       rounded-lg w-72 p-2 mt-2 text-white hover:opacity-90"
      >
        Continue With Google
      </button>
    </>
  );
}

export default GoogleO;
