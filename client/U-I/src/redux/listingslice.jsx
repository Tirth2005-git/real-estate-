import { createSlice } from "@reduxjs/toolkit";
import UpdateListing from "../pages/updateListings";

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [],
  },
  reducers: {
    setAfterlogin: (state, action) => {
      state.listings = action.payload;
    },
    setListing: (state, action) => {
      state.listings = [...state.listings, action.payload];
    },
    clearListings: (state) => {
      state.listings = [];
    },
    deleteListing: (state, action) => {
      state.listings = action.payload;
    },
    UpdateList: (state, action) => {
      state.listings = action.payload;
    },
  },
});

export const { setListing, clearListings, deleteListing, setAfterlogin,UpdateList } =
  listingSlice.actions;
export default listingSlice.reducer;
