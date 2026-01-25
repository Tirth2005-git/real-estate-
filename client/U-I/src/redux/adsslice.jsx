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
  },
});

export const { addAd, setAds } = adsSlice.actions;
export default adsSlice.reducer;
