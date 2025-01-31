import React, { useEffect, useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import {setSelectedChat} from '../slices/chatSlice';
import { getSender,isLastMessage,isSameSender,isSameUser,isSameSenderMargin } from '../services/getSender';
import { SlOptionsVertical } from "react-icons/sl";
import { setModalType } from '../slices/modalSlice';
import apiConnector from '../services/apiconnector';
import { IoSend } from "react-icons/io5";
import io from "socket.io-client"
import { toggleSocket } from '../slices/socketSlice';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from "../slices/notificationSlice";

const ENDPOINT = "https://banter-backend-vdd3.onrender.com";
var socket , selectedChatCompare;


const SingleChat = ({
  messages,
  setMessages,
  fetchMessages,
  fetchchatsagain,
  setFetchChatsAgain,
}) => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const show = useSelector((state) => state.modal.show);
  const [typing,setTyping] = useState(false);
  const [isTyping,setIsTyping] = useState(false);
  const notifications = useSelector(
      (state) => state.notification.notifications
    );

  const socketConnected = useSelector(
    (state) => state.socket_Connect.socketConnected
  );

  const [newMessage, setNewMessage] = useState();
  const dispatch = useDispatch();

  const modalSwitchhandler = () => {
    dispatch(setModalType("DeleteGroupChat"));
    dispatch(toggleModal());
  };

  const sendMessage = async (e) => {
    if ((e.key === "Enter" || e.target.innerText === "Send") && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const headers = {
          Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
        };

        // Use the apiConnector for the API call
        const data = await apiConnector(
          "POST",
          `https://banter-backend-vdd3.onrender.com/api/v1/auth/message`,
          { content: newMessage, chatId: selectedChat._id }, // No body data for GET request
          headers, // Pass headers correctly
          null // Use query params
        );
        console.log("meesage send ka response ", data);
        socket.emit("new message", data.data);
        setNewMessage("");
        setMessages([...messages, data.data]);
        setFetchChatsAgain(!fetchchatsagain);
      } catch (error) {
        console.log(error);
        console.log("Could not update the chat meassge ");
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic

        if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => dispatch(toggleSocket()));
    socket.on("typing",()=>setTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  console.log("check notifications", notifications);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if(!notifications.includes(newMessageRecieved)){
         dispatch(addNotification(newMessageRecieved));
         setFetchChatsAgain(!fetchchatsagain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  return (
    <div className="w-full h-full">
      {selectedChat ? (
        <div className="w-full h-full flex flex-col items-center justify-between gap-1 p-4">
          <div className="flex w-full min-h-[5%] h-[7%] max-h-full items-center justify-between border-b-2 py-2  ">
            <div className="text-xl font-bold">
              {!selectedChat.isGroupChat
                ? getSender(user, selectedChat.users)
                : selectedChat.chatName}
            </div>
            <div onClick={() => modalSwitchhandler()} className=' cursor-pointer'>
              <SlOptionsVertical fontSize="20px" />
            </div>
          </div>
          <div className="w-full min-h-[93%] h-[93%] rounded-md flex flex-col gap-y-2 ">
            <div className="overflow-y-scroll no-scrollbar p-2 h-full">
              {messages &&
                messages.map((m, i) => {
                  return (
                    <div key={i} className="flex flex-row gap-1 items-center">
                      {(isSameSender(messages, m, i, user._id) ||
                        isLastMessage(messages, i, user._id)) && (
                        <div className="w-[35px] h-[35px] rounded-full mt-[7px]">
                          <img
                            className=" w-full h-full  rounded-full"
                            src={m.sender.image}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          backgroundColor: `${
                            m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                          }`,
                          borderRadius: "20px",
                          padding: "5px 15px",
                          maxWidth: "75%",
                          marginLeft: isSameSenderMargin(
                            messages,
                            m,
                            i,
                            user._id
                          ),
                          marginTop: isSameUser(messages, m, i, user._id)
                            ? 3
                            : 10,
                        }}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex w-full gap-1 rounded-3xl">
            {isTyping?<div>Loading...</div>:<div></div>}

              <div
                className="border-2 p-2 bg-white rounded-3xl w-full hover:border-blue-500 transition-colors duration-100 ease-in-out"
                onKeyDown={(e) => sendMessage(e)}
              >
                <input
                  type="text"
                  placeholder="Write a meassage"
                  onChange={(e) => typingHandler(e)}
                  value={newMessage}
                  className="w-full focus:outline-none"
                />
              </div>
              <div
                className="p-2 cursor-pointer bg-blue-500 text-white rounded-full h-[40px] w-[40px] text-xs flex justify-center items-center hover:bg-blue-400 transition-all duration-200 ease-in-out hover:scale-105"
                onClick={() => sendMessage({ target: { innerText: "Send" } })}
              >
                <IoSend fontSize="20px" color="white" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center text-3xl">
          <h2>Select a chat</h2>
        </div>
      )}
    </div>
  );
};

export default SingleChat