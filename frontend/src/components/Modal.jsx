import React, { useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat,setChats } from "../slices/chatSlice";
import apiConnector from '../services/apiconnector';
import { IoIosCloseCircleOutline } from "react-icons/io";

const Modal = ({renderGroup,renderDeleteGroup,Reciever}) => {
    const selectedChat = useSelector((state) => state.chat.selectedChat);
    const modalType = useSelector((state) => state.modal.modalType);
    const dispatch = useDispatch();
  return (
    <div className=" z-10 absolute inset-0 flex justify-center items-center">
      {/* Overlay */}
      <div
        className="z-20 absolute w-full h-full bg-black opacity-50"
        onClick={() => dispatch(toggleModal())}
      />
      {/* Modal Content */}
      <div className="z-30 w-[40%] h-fit">
        {!selectedChat.isGroupChat? 
        (modalType === "GroupChat"?renderGroup:Reciever)
        :
          (modalType === "GroupChat"
            ? renderGroup
            : renderDeleteGroup
          )
           }
      </div>
    </div>
  );
}

export default Modal