import React, { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {setSlide} from "../slices/slidingSlice"
import apiConnector from "../services/apiconnector"
import { setSelectedChat,setChats } from "../slices/chatSlice";


const Slidingdrawer = () => {
  const token = useSelector((state)=>state.user.token);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchresult] = useState([]);
  const dispatch= useDispatch();
  const chats=useSelector((state)=>state.chat.chats);

  const handleaccesschat= async (userId)=>{
    try{
      const headers = {
      Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
    };

    // Use the apiConnector for the API call
    const data = await apiConnector(
      "POST",
      `https://banter-backend-vdd3.onrender.com/api/v1/auth/chat`,
      { userId }, // No body data for GET request
      headers, // Pass headers correctly
      { search } // Use query params
    );
    console.log("ISSE BHI CHECK KAR ", data);

    if (!chats.find((c) => c._id === data.data._id)) {
  dispatch(setChats([data.data, ...chats]));
}
    dispatch(setSelectedChat(data.data));
    dispatch(setSlide())

    }
    catch(error){
      console.log(error);
      console.log("Could not create access chat ");
    }
  }

  const handlesearch=async (e)=>{
  try {
    const headers = {
      Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
    };

    // Use the apiConnector for the API call
    const data = await apiConnector(
      "GET",
      `https://banter-backend-vdd3.onrender.com/api/v1/auth/user`,
      null, // No body data for GET request
      headers, // Pass headers correctly
      { search } // Use query params
    );
    console.log("ISSE CHECK KAR", data);

    setSearchresult(data.data.users);
    }
    catch(error){
      console.log(error);
      console.log("Could not fetch all user");
    }
  }

  useEffect(()=>{

  },[handleaccesschat])



  return (
    <div className="w-[300px] h-screen flex flex-col px-4 py-2 gap-y-3 items-center bg-blue-400">
      <div className="w-full flex justify-end" onClick={() => dispatch(setSlide())}>
        <IoCloseSharp fontSize="40px" color="white" />
      </div>
      <div className="flex gap-2 items-center w-full justify-between">
        <input
          type="text"
          value={search}
          placeholder="Search Person"
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 rounded-md w-[80%]"
        />

        <div  onClick={handlesearch}>
          <MdOutlineSearch fontSize="40px" color="white" />
        </div>
      </div>

        <div className="w-full flex flex-col items-start gap-1">
        {searchResult.length > 0 ? (
          searchResult.map((user, index) => (
            <div key={index} onClick={() => handleaccesschat(user._id)} className="bg-white rounded-md p-2 w-[70%] cursor-pointer hover:bg-green-400 hover:text-white">
              {user.name}
            </div>
          ))
        ) : (
          <div></div>
        )}
      </div>

    </div>
  );
};

export default Slidingdrawer;
