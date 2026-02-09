import "./index.css";
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
import ViewAd from "./pages/viewad.jsx";
import BuilderAds from "./pages/builderAd.jsx";
import FindDealers from "./pages/findDealers.jsx";
import CreateAdvertisement from "./pages/createAd.jsx";
import DealerProfile from "./pages/DealerProfile.jsx";
function App() {
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
                <Route
                  path="/create-ad"
                  element={<CreateAdvertisement />}
                ></Route>
                <Route path="/builder-ads" element={<BuilderAds />}></Route>
                <Route path="/ad" element={<ViewAd />}></Route>
                <Route path="/browse-dealers" element={<FindDealers />}></Route>
                <Route path="/dealer-profile" element={<DealerProfile />} />
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
