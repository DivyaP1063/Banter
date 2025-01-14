import React from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import {setSelectedChat} from '../slices/chatSlice';
import { getSender } from '../services/getSender';
import { SlOptionsVertical } from "react-icons/sl";
import { setModalType } from '../slices/modalSlice';

const SingleChat = () => {
    const selectedChat = useSelector((state)=>state.chat.selectedChat);
    const user = useSelector((state)=>state.user.user);
    const show =useSelector((state)=>state.modal.show);
    const dispatch = useDispatch();

    const modalSwitchhandler= ()=>{
      dispatch(setModalType("DeleteGroupChat"));
      dispatch(toggleModal())
    }

  return (
    <div className='w-full h-full'>
        {
            selectedChat?(
            <div className='w-full h-full flex flex-col items-center p-5'>
              <div className='flex w-full items-center justify-between'>
                <div>{!selectedChat.isGroupChat?(getSender(user,selectedChat.users)):(selectedChat.chatName)}</div>
                <div onClick={()=>modalSwitchhandler()}>
                <SlOptionsVertical fontSize="20px" />
                </div>
                
              </div>
            </div>):(
                <div className='w-full h-full flex justify-center items-center text-3xl'><h2>Select a chat</h2></div>
            )
        }
    </div>
  )
}

export default SingleChat