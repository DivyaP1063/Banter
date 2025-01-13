import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authslice';
import userReducer from "../slices/userSlice";
import slideReducer from "../slices/slidingSlice"
import chatReducer from "../slices/chatSlice";
import modalReducer from "../slices/modalSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    slide:slideReducer,
    chat:chatReducer,
    modal:modalReducer
  },
});

export default store; 