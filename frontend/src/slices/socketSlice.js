import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socketConnected: false, // Default view is Login
};

export const socketSlice = createSlice({
  name: "socket_Connect",
  initialState,
  reducers: {
    toggleSocket: (state) => {
      state.socketConnected = true; // Always set the value to true
    },
  },
});

export const { toggleSocket } = socketSlice.actions;
export default socketSlice.reducer;
