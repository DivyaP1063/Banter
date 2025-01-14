import React, { useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat,setChats } from "../slices/chatSlice";
import apiConnector from '../services/apiconnector';
import { IoIosCloseCircleOutline } from "react-icons/io";
const GroupModal = () => {
    const [groupChatname,setGroupname] = useState();
    const dispatch= useDispatch();
    const [selectedUsers,setSelectedusers] = useState([]);
    const [searchResult,setSearchresult] = useState([]);
    const user = useSelector((state) => state.user.user);
    const [search,setSearch] = useState("");
    const chats=useSelector((state)=>state.chat.chats);
    const token = useSelector((state)=>state.user.token);

    const handlersearchquery=async(e)=>{
        setSearch(e.target.value);

        try {
            const headers = {
                  Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
                };
            
                // Use the apiConnector for the API call
                const data = await apiConnector(
                "GET",
                `http://localhost:4000/api/v1/auth/user`,
                null, // No body data for GET request
                headers, // Pass headers correctly
                { search } // Use query params
                );
                console.log("group ke bande ", data);

                setSearchresult(data.data.users);
        } catch (error) {
            console.log(error);
            console.log("Could not search user for group chat ");
        }
    }

    const handleOnSubmit = async(e)=>{
        if(!groupChatname || !selectedUsers){
            console.log("please fill the inputs for group chat");
            return;
        }

        try {
            const headers = {
                  Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
                };
            
                // Use the apiConnector for the API call
                const data = await apiConnector(
                "POST",
                `http://localhost:4000/api/v1/auth/chat/group`,
                {name:groupChatname,
                 users:JSON.stringify(selectedUsers.map((user)=>user._id)),
                }, // No body data for GET request
                headers, // Pass headers correctly
                null // Use query params
                );
                console.log("group ke bande group banne ke baad ", data);

                setChats(data.data,...chats);
                dispatch(toggleModal());
        } catch (error) {
            console.log(error);
            console.log("Could not create group chat ");
        }
    }

    const handleDelete= (user)=>{
    setSelectedusers(selectedUsers.filter((s)=>s._id!==user._id))
    }

    const handleGroup = (user)=>{
        if(selectedUsers.includes(user)){
            console.log("already added");
            return;
        }

        setSelectedusers([...selectedUsers,user]);
    }

    const handler=(e)=>{
        setGroupname(e.target.value);
    }

  return (
<div className='relative z-50 w-full h-full bg-white flex flex-col items-center justify-between p-4 rounded-md'>
            <div className='w-full text-center'>
                <p className='text-xl'>Create New Group Chat</p>
            </div>
            <form className='flex flex-col w-full items-center gap-2' onSubmit={(e)=>handleOnSubmit(e)}>
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
                    onChange={(e)=>handlersearchquery(e)}
                />
                <div>
                {searchResult.length>0?
                (searchResult.map((user,index)=>{
                        return(
                            <div key={index} onClick={()=>handleGroup(user)}>
                                {user.name}
                            </div>
                        )
                    })):
                (<div></div>)}

                </div>
                <div className='flex flex-wrap w-full gap-1'>
                    {selectedUsers.map((user,index)=>{
                        return(
                            <div key={index} className='flex items-center justify-center gap-x-1 rounded-lg bg-violet-600 text-sm text-white p-1'>
                               <div>
                                {user.name}
                               </div>

                               <div onClick={()=>handleDelete(user)}>
                                    <IoIosCloseCircleOutline fontSize="15px" />
                               </div>

                                
                                

                            </div>
                        )
                    })}
                </div>

                <div className='w-full flex justify-end'>
                    <button className='p-2 bg-blue-500 text-white w-fit h-fit rounded-md'>Create Group</button>
                </div>
            </form>
        </div>
  )
}

export default GroupModal