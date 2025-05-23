import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userslice.jsx";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import listingReducer from "./listingslice.jsx";
import formReducer from "./formslice.jsx";
import propertyReducer from "./propertiesSlice.jsx";
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["formToggle"],
  version: 1,
};

const rootReducer = combineReducers({
  user: userReducer,
  listings: listingReducer,
  formToggle: formReducer,
  properties: propertyReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
