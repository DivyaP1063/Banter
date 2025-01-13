import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("Userinfo") 
    ? JSON.parse(localStorage.getItem("Userinfo")) 
    : null,
  token: localStorage.getItem("token") 
    ? JSON.parse(localStorage.getItem("token")) 
    : null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload; // Use action.payload for correct assignment
    },
    setToken(state, action) {
      state.token = action.payload; // Use action.payload for correct assignment
    },
  },
});

export const { setUser, setToken } = userSlice.actions;

export default userSlice.reducer;
