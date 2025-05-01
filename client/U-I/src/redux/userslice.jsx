import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentuser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    start: (state, action) => {
      state.loading = true;
      state.error = null;
      state.currentuser = null;
    },
    succcess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentuser = action.payload;
    },
    failure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.currentuser = null;
    },
  },
});

export const { start, succcess, failure } = userSlice.actions;

export default userSlice.reducer;
