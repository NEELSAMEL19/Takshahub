import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  loginModalOpen: boolean;
};

const initialState: UIState = {
  loginModalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openLogin: (state) => {
      state.loginModalOpen = true;
    },
    closeLogin: (state) => {
      state.loginModalOpen = false;
    },
  },
});

export const { openLogin, closeLogin } = uiSlice.actions;
export default uiSlice.reducer;