import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function PvtRoute2() {
  const { currentuser } = useSelector((state) => state.user);
  const { listings } = useSelector((state) => state.listings);
  return currentuser && listings ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to="/sign-in"></Navigate>
  );
}
export default PvtRoute2;
