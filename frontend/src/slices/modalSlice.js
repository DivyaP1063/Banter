import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  show: false,
  modalType: null,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    toggleModal: (state) => {
      state.show = !state.show; // Toggle between Login and Signup
    },
    setModalType: (state, action) => {
      state.modalType = action.payload; // Set modal type
    },
  },
});

export const { toggleModal,setModalType } = modalSlice.actions;
export default modalSlice.reducer;