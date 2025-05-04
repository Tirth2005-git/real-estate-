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
    updatestart: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    updatesucccess: (state, action) => {
      state.loading = false;
      state.error = null;
      state.currentuser = action.payload;
    },
    updatefailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteerror: (state, action) => {
      state.error = action.payload;
    },
    deletesuccess: (state, action) => {
      state.error = null;
      state.currentuser = null;
    },
  },
});

export const {
  start,
  succcess,
  failure,
  updatestart,
  updatefailure,
  updatesucccess,
  deleteerror,
  deletesuccess
} = userSlice.actions;

export default userSlice.reducer;
