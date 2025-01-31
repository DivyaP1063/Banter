import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChats, setSelectedChat } from '../slices/chatSlice';
import { getSender } from '../services/getSender';
import apiConnector from '../services/apiconnector';

const People = ({ fetchchatsagain }) => {
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
        `https://banter-backend-vdd3.onrender.com/api/v1/auth/chat`,
        null, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
      console.log("ISSE BHI CHECK KAR HAI YAHI WALA", data.data);

      dispatch(setChats(data.data));
    } catch (error) {
      console.log(error);
      console.log("Could not find all chat ");
    }
  };

  useEffect(() => {
    fetchChat();
  }, [dispatch, fetchchatsagain]);

  return (
    <div className="h-[80%] w-full flex flex-col items-center bg-white rounded-2xl shadow-md shadow-blue-300 overflow-y-scroll no-scrollbar px-5 py-2">
      {chats.length > 0 ? (
        chats.map((chat, index) => {
          return (
            <div
              key={index}
              className={`w-full flex items-center h-[70px] hover:bg-violet-700 hover:rounded-md hover:text-white  border-b-2 cursor-pointer transition-colors  duration-100 ease-in-out  p-2 ${
                selectedChat == chat ? " bg-gray-300 text-white rounded-md" : ""
              }`}
              onClick={(e) => dispatch(setSelectedChat(chat))}
            >
              {!chat.isGroupChat ? (
                chat.users[0]._id === user._id ? (
                  <div className="flex items-center gap-x-5 max-lg:gap-x-3">
                    <div className="w-[40px] h-[40px] max-lg:w-[35px] max-lg:h-[35px] rounded-full">
                      <img
                        src={chat.users[1].image}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-lg max-lg:text-base font-semibold">
                        {chat.users[1].name}
                      </div>
                      <div className="text-sm max-lg:text-xs text-gray-600">
                        {chat?.latestMessage?.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-5 max-lg:gap-x-3">
                    <div className="w-[40px] h-[40px] max-lg:w-[35px] max-lg:h-[35px] rounded-full">
                      <img
                        src={chat.users[0].image}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col ">
                      <div className="text-lg max-lg:text-base font-semibold">
                        {chat.users[0].name}
                      </div>
                      <div className="text-sm max-lg:text-xs text-gray-600">
                        {chat?.latestMessage?.content}
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-x-5 max-lg:gap-x-3">
                  <div className="w-[40px] h-[40px] max-lg:w-[35px] max-lg:h-[35px] rounded-full">
                    <img
                      src={`https://ui-avatars.com/api/?name=G`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col ">
                    <div className="text-lg max-lg:text-base font-semibold">
                      {chat.chatName}
                    </div>
                    <div className="text-sm max-lg:text-xs text-gray-600">
                      {chat?.latestMessage?.content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div className='text-xl font-semibold text-gray-600'>No Chats Yet</div>
      )}
    </div>
  );
};

export default People;
