import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PvtRoute() {

  const { currentuser } = useSelector((state) => state.user);
  return currentuser ? <Outlet></Outlet> : <Navigate to="/sign-in"></Navigate>;
}
export default PvtRoute;
