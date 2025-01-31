import React, { useEffect, useState } from 'react'

import Sidebar from '../components/Sidebar'
import FindAndChat from '../components/FindAndChat'
import Chat from "../components/Chat"
import { useDispatch, useSelector } from "react-redux";
import Slidingdrawer from '../components/Slidingdrawer'
import Modal from '../components/Modal'
import GroupModal from '../components/GroupModal'
import DeleteGroupModal from '../components/DeleteGroupModal'
import apiConnector from '../services/apiconnector'
import io from "socket.io-client";
import { toggleSocket } from "../slices/socketSlice";
import Reciever from '../components/Reciever';

const ENDPOINT = "https://banter-backend-vdd3.onrender.com";
var socket, selectedChatCompare;

const Chats = () => {

  const dispatch=useDispatch();

  const user = useSelector((state) => state.user.user);
  const socketConnected = useSelector(
      (state) => state.socket_Connect.socketConnected
    );

  const toSlide = useSelector((state) => state.slide.toSlide);

  const show =useSelector((state)=>state.modal.show);
      const selectedChat = useSelector((state)=>state.chat.selectedChat);
      const token = useSelector((state) => state.user.token);
      const [messages,setMessages]= useState([]);

  const [fetchchatsagain,setFetchChatsAgain]=useState(false);

      const fetchMessages = async () =>{
        if(!selectedChat) return;
        try {
          const headers = {
            Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
          };
  
          // Use the apiConnector for the API call
              const data = await apiConnector(
                "GET",
                `https://banter-backend-vdd3.onrender.com/api/v1/auth/message/${selectedChat._id}`, // Include chatId in the URL
                null, // No body data for GET request
                headers,
                null // Pass headers correctly
              );
          console.log("meesage return ka response ", data);
  
          setMessages(data.data);

          socket.emit('join chat',selectedChat._id);  
        } catch (error) {
          console.log(error);
          console.log("Could not fetch all the chat meassge ");
        }
      }

        useEffect(() => {
          socket = io(ENDPOINT);
          socket.emit("setup", user);
          socket.on("connected", () => dispatch(toggleSocket()));
        }, []);

          useEffect(()=>{
            fetchMessages();
            selectedChatCompare = selectedChat;
          },[selectedChat]);


  return (
    <div className="relative z-0 w-screen max-w-screen h-screen max-h-screen p-5 flex justify-between bg-blue-100 ">
      {show && (
        <Modal
          renderGroup={
            <GroupModal
              setFetchChatsAgain={setFetchChatsAgain}
              fetchchatsagain={fetchchatsagain}
            />
          }
          renderDeleteGroup={
            <DeleteGroupModal
              setFetchChatsAgain={setFetchChatsAgain}
              fetchchatsagain={fetchchatsagain}
              fetchMessages={fetchMessages}
            />
          }

          Reciever={<Reciever/>}
        />
      )}
      <div
        className={`absolute z-50 top-0 left-0 transition-transform duration-500 ease-in-out`}
        style={{
          transform: toSlide ? "translateX(-100%)" : "translateX(0%)", // Toggle Slide
        }}
      >
        <Slidingdrawer />
      </div>

      <Sidebar />
      <FindAndChat fetchchatsagain={fetchchatsagain} />
      <Chat
        messages={messages}
        setMessages={setMessages}
        fetchMessages={fetchMessages}
        setFetchChatsAgain={setFetchChatsAgain}
        fetchchatsagain={fetchchatsagain}
      />
    </div>
  );
}

export default Chats