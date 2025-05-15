import { createSlice } from "@reduxjs/toolkit";

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
  },
});

export const { setListing, clearListings, deleteListing, setAfterlogin } =
  listingSlice.actions;
export default listingSlice.reducer;
