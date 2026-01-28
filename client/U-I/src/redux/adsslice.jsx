import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ads: [],
};

const adsSlice = createSlice({
  name: "ads",
  initialState,
  reducers: {
    addAd: (state, action) => {
      state.ads.unshift(action.payload);
    },
    setAds: (state, action) => {
      state.ads = action.payload;
    },
    deleteAd: (state, action) => {
      state.ads = action.payload;
    },
    clearAds: (state) => {
      state.ads = [];
    },
  },
});

export const { addAd, setAds, deleteAd, clearAds } = adsSlice.actions;
export default adsSlice.reducer;
