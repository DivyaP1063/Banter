import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: true, // Default view is Login
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAuth: (state) => {
      state.isLogin = !state.isLogin; // Toggle between Login and Signup
    },
  },
});

export const { toggleAuth } = authSlice.actions;
export default authSlice.reducer;
