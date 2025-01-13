import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false, 
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.show = !state.show; // Toggle between Login and Signup
    },
  },
});

export const { toggleModal } = modalSlice.actions;
export default modalSlice.reducer;