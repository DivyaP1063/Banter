import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedChat: "", // Default state for selectedChat
  chats: [], // Default state for chats
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,

  reducers: {
    setSelectedChat(state, action) {
      state.selectedChat = action.payload; // Use action.payload to access the value
    },
    setChats(state, action) {
      state.chats = action.payload; // Use action.payload to access the value
    },
  },
});

export const { setSelectedChat, setChats } = chatSlice.actions;

export default chatSlice.reducer;
