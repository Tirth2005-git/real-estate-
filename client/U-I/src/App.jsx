import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";
import Signin from "./pages/Signin.jsx";
import Header from "./components/Header.jsx";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import PvtRoute from "./components/PrivateRoute.jsx";
import CreateListing from "./pages/CreateListing.jsx";
import UserListings from "./pages/UserListings.jsx";
import PvtRoute2 from "./components/PrivateRoute2.jsx";
import ListingView from "./pages/viewListing.jsx";
import UpdateListing from "./pages/updateListings.jsx";
import FindProperties from "./pages/findProperties.jsx";
import "./index.css";
function App() {
  window.addEventListener("beforeunload", () => {
    navigator.sendBeacon("/api/signout");
    localStorage.removeItem("user");
    localStorage.removeItem("listings");
  });
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Header></Header>
            <Routes>
              <Route path="/" element={<Home />}></Route>

              <Route path="/sign-in" element={<Signin />}></Route>
              <Route path="/sign-up" element={<Signup />}></Route>
              <Route element={<PvtRoute></PvtRoute>}>
                <Route path="/profile" element={<Profile />}></Route>
                <Route
                  path="/create-listing"
                  element={<CreateListing />}
                ></Route>
                <Route
                  path="/find-properties"
                  element={<FindProperties />}
                ></Route>
                <Route path="/user-listings" element={<UserListings />}></Route>
              </Route>
              <Route element={<PvtRoute2 />}>
                <Route path="/listing" element={<ListingView />}></Route>
                <Route
                  path="/update-listing"
                  element={<UpdateListing />}
                ></Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
