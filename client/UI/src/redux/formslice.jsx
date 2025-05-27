import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "showForm",
  initialState: { showForm: false },
  reducers: {
    setVisbility: (state) => {
      state.showForm = !state.showForm;
    },
  },
});

export const { setVisbility } = formSlice.actions;
export default formSlice.reducer;
