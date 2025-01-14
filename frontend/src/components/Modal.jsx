import React, { useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat,setChats } from "../slices/chatSlice";
import apiConnector from '../services/apiconnector';
import { IoIosCloseCircleOutline } from "react-icons/io";
const Modal = ({renderGroup,renderDeleteGroup}) => {
    const modalType = useSelector((state) => state.modal.modalType);
    const dispatch = useDispatch();
  return (
        <div className="z-0 absolute inset-0 flex justify-center items-center">
            {/* Overlay */}
            <div
                className="z-10 absolute w-full h-full bg-black opacity-50"
                onClick={() => dispatch(toggleModal())}
            />
            {/* Modal Content */}
            <div className="z-20 w-[40%] h-fit">
                {modalType === "GroupChat" ? renderGroup : renderDeleteGroup}
            </div>
        </div>
  )
}

export default Modal