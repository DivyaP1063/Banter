import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChats, setSelectedChat } from '../slices/chatSlice';
import { getSender } from '../services/getSender';
import apiConnector from '../services/apiconnector';

const People = () => {
  const { chats, selectedChat } = useSelector((state) => state.chat);
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  console.log("Redux value", chats);
  console.log("Redux value selected", selectedChat);

  const fetchChat = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
      };

      // Use the apiConnector for the API call
      const data = await apiConnector(
        "GET",
        `http://localhost:4000/api/v1/auth/chat`,
        null, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
      console.log("ISSE BHI CHECK KAR HAI", data.data);

      dispatch(setChats(data.data))
    } catch (error) {
      console.log(error);
      console.log("Could not find all chat ");
    }
  }

  useEffect(() => {
    fetchChat();
  }, [dispatch])

  return (
    <div className='h-[80%] w-full flex flex-col items-center bg-white rounded-2xl shadow-md shadow-blue-300 overflow-y-scroll no-scrollbar px-5 py-2'>
      {chats.length > 0 ? (
        chats.map((chat, index) => {
          return (
            <div key={index} className={`w-full h-[40px] rounded border-2 cursor-pointer border-slate-500 p-2 ${selectedChat==chat?"bg-green-500":""}`} 
            onClick={(e)=>dispatch(setSelectedChat(chat))}>
              {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
              {index!==chats.length-1 && <div className='h-[1px] w-full bg-slate-400'></div>}
            </div>
          );
        })
      ) : (
        <div>No Chats Yet</div>
      )}
    </div>
  );
}

export default People;
