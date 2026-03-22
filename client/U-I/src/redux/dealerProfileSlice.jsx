import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dealer: null,
  listings: [],
  loading: false,
  error: null,
};

const dealerProfileSlice = createSlice({
  name: "dealerProfile",
  initialState,
  reducers: {
    // In your slice actions
    fetchDealerStart: (state, action) => {
      state.loading = true;
      state.error = null;
    },

    fetchDealerSuccess: (state, action) => {
      state.loading = false;
      state.error = null;

      state.dealer = action.payload.dealer;
      state.listings = action.payload.listings;
    },

    fetchDealerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearDealerProfile(state) {
      return initialState;
    },
  },
});

export const {
  fetchDealerStart,
  fetchDealerSuccess,
  fetchDealerFailure,
  clearDealerProfile,
} = dealerProfileSlice.actions;

export default dealerProfileSlice.reducer;
