import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { IoNotifications } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { setUser,setToken } from "../slices/userSlice"; 
import { toast } from 'react-toastify';
import {getSender} from "../services/getSender"
import { setSelectedChat } from "../slices/chatSlice";
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from "../slices/notificationSlice";
const Sidebar = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications
  );
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const navigate= useNavigate();
  const [showNotification,setShowNotification] = useState(false);

  const logout=()=>{
    localStorage.removeItem("UserInfo");
    dispatch(setToken(""));
    dispatch(setUser(""));
    
    navigate("/");
    toast.success("Logged Out")
  }

  const notificationHandler=(noti)=>{
    dispatch(setSelectedChat(noti.chat));
    dispatch(removeNotification(noti.id));
    setShowNotification(false);
  }
  
  return (
    <div className="relative h-full w-[6%] rounded-2xl bg-violet-700 shadow-md shadow-purple-800 flex flex-col justify-between items-center py-4">
      <div
        className={`${
          showNotification ? "absolute" : "hidden"
        } z-50 top-[12%]  -right-[220px]  overflow-visible bg-sky-300 no-scrollbar p-2  text-white w-[230px] h-fit rounded-md shadow-md shadow-slate-600`}
      >
        <div className="w-[13px] h-[13px]  top-[13px] absolute bg-sky-300 -left-[5px] rotate-45 rounded"></div>
        {notifications.length > 0 ? (
          <div className=" w-full h-fit flex flex-col items-center gap-y-2 ">
            {notifications.map((noti) => (
              <div
                key={noti._id}
                onClick={() => notificationHandler(noti)}
                className="cursor-pointer bg-green-400 hover:bg-green-600 rounded-md p-2 w-full"
              >
                {noti.chat.isGroupChat
                  ? `New Message in ${noti.chat.chatName}`
                  : `New Message from ${getSender(user, noti.chat.users)}`}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full">No new messages</div>
        )}
      </div>
      <div className="flex flex-col items-center gap-y-4">
        <div className="rounded-full w-[50px] h-[50px] max-lg:w-[35px] max-lg:h-[35px]">
          <img
            src={user.image && user.image}
            className="rounded-full object-cover w-full h-full hover:scale-110 transition-transform duration-150 ease-in-out"
          ></img>
        </div>
        <div className="relative cursor-pointer hover:scale-110 transition-transform duration-150 ease-in-out">
          <div
            onClick={() => setShowNotification(!showNotification)}
            className="text-[40px] max-lg:text-[30px]"
          >
            <IoNotifications color="white" />
          </div>

          {notifications.length > 0 && (
            <div className="bg-red-500 text-white w-[20px] h-[20px] max-lg:w-[15px] max-lg:h-[15px] rounded-full absolute top-0 right-0 flex items-center justify-center text-sm max-lg:text-xs font-bold ">
              {notifications.length}
            </div>
          )}
        </div>
      </div>

      <div className="hover:scale-110 transition-transform duration-150 ease-in-out text-[40px] max-lg:text-[30px]">
        <button onClick={logout}>
          <RiLogoutBoxLine color="white" />
        </button>
      </div>
    </div>
  );
}

export default Sidebar