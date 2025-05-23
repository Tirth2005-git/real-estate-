import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  name: "properties",
  initialState: { properties: [] },
  reducers: {
    setproperties: (state, action) => {
      state.properties = action.payload;
    },
    clearProperties: (state) => {
      state.properties = [];
    },
  },
});

export const { setproperties, clearProperties } = propertySlice.actions;
export default propertySlice.reducer;
