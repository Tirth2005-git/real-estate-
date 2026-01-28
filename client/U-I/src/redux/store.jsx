import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userslice.jsx";
import listingReducer from "./listingslice.jsx";
import formReducer from "./formslice.jsx";
import propertyReducer from "./propertiesSlice.jsx";
import adsReducer from "./adsslice.jsx";

import storageSession from "redux-persist/lib/storage/session";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["formToggle"],
  version: 1,
};

const rootReducer = combineReducers({
  user: userReducer,
  listings: listingReducer,
  formToggle: formReducer,
  properties: propertyReducer,
  ads: adsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: {
    name: "YourRealEstate-App", 
  },
});

export const persistor = persistStore(store);
