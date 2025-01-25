
import React, { useState } from "react";
import { toggleModal } from "../slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat, setChats } from "../slices/chatSlice";
import apiConnector from "../services/apiconnector";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import { getSender,isLastMessage,isSameSender,isSameUser,isSameSenderMargin } from '../services/getSender';

const Reciever = () => {
  const [groupChatname, setGroupname] = useState();
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedusers] = useState([]);
  const [searchResult, setSearchresult] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("");
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const token = useSelector((state) => state.user.token);

  console.log("receiver: ",selectedChat);


  return (
    <div className="relative z-50 w-full h-full bg-white flex flex-col gap-2 items-center justify-between p-4 rounded-md">
      <div
        className="top-0 right-0 absolute z-50 cursor-pointer"
        onClick={() => dispatch(toggleModal())}
      >
        <IoCloseSharp fontSize="40px" />
      </div>

      <div className=" w-[60%] flex flex-col justify-center items-center  gap-y-3">
        <div className="text-xl font-bold">{getSender(user, selectedChat.users)}</div>
        <div className="w-[300px] h-[300px] rounded-full">
          {selectedChat.users[0]._id === user._id ? (
            <img
              src={selectedChat.users[1].image}
              className="w-full h-full object-cover rounded-full"
            ></img>
          ) : (
            <img
              src={selectedChat.users[0].image}
              className="w-full h-full object-cover rounded-full"
            ></img>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reciever