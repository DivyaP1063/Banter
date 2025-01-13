import React from 'react'
import { useSelector } from 'react-redux'
import { IoNotifications } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser,setToken } from "../slices/userSlice"; 
const Sidebar = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const navigate= useNavigate();

  const logout=()=>{
    localStorage.removeItem("UserInfo");
    dispatch(setToken(""));
    dispatch(setUser(""));
    
    navigate("/");
  }
  
  return (
    <div className='h-full w-[6%] rounded-2xl bg-violet-700 shadow-md shadow-purple-800 flex flex-col justify-between items-center py-4'>
    <div className='flex flex-col items-center gap-y-4'>
      <div className='rounded-full w-[50px] h-[50px]'>
        
        <img src={user.image?'${user.image}':`https://ui-avatars.com/api/?name=${user.name}`}
        className='rounded-full w-[50px] h-[50px]'>

        </img>
      </div>


        <IoNotifications fontSize="40px" color='white' />

    </div>


      <div>
        <button onClick={logout}><RiLogoutBoxLine fontSize="40px" color='white'  /></button>
      </div>

    </div>
  )
}

export default Sidebar