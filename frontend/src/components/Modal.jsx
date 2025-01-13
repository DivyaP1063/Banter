import React, { useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat,setChats } from "../slices/chatSlice";
const Modal = () => {
    const [groupChatname,setGroupname] = useState();
    const dispatch= useDispatch();
    const [selectedUsers,setSelectedusers] = useState([]);
    const user = useSelector((state) => state.user.user);
    const [search,setSearch] = useState();
    const chats=useSelector((state)=>state.chat.chats);

    const handler=(e)=>{
        setGroupname(e.target.value);
    }

  return (
    <div className='z-0 absolute inset-0 flex justify-center items-center '>
        <div className='z-10 absolute w-full h-full bg-black opacity-50'
        onClick={()=>dispatch(toggleModal())}>

        </div>
        <div className='relative z-50 w-[40%] h-[50%] bg-white flex flex-col items-center p-4 rounded-md'>
            <div className='w-full text-center'>
                <p className='text-xl'>Create New Group Chat</p>
            </div>
            <form>
                <input
                    type='text'
                    placeholder='Group Name'
                    value={groupChatname}
                    onChange={handler}
                />
                    <input
                    type='text'
                    placeholder='Add users'
                    value={search}
                    onChange={handlersearchquery}
                />
            </form>
        </div>
    </div>
  )
}

export default Modal