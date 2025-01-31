import React, { useState } from 'react'
import { toggleModal } from '../slices/modalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat,setChats } from "../slices/chatSlice";
import apiConnector from '../services/apiconnector';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const GroupModal = ({ fetchchatsagain, setFetchChatsAgain }) => {
  const [groupChatname, setGroupname] = useState();
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedusers] = useState([]);
  const [searchResult, setSearchresult] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const token = useSelector((state) => state.user.token);

  const handlersearchquery = async (e) => {
    setSearch(e.target.value);

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
      console.log("group ke bande ", data);


      setSearchresult(data.data.users);
    } catch (error) {
      console.log(error);
      console.log("Could not search user for group chat ");
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!groupChatname || !selectedUsers) {
      console.log("please fill the inputs for group chat");
      return;
    }

    try {
      const toastId = toast.loading("Creating Group");
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
      };

      // Use the apiConnector for the API call
      const data = await apiConnector(
        "POST",
        `https://banter-backend-vdd3.onrender.com/api/v1/auth/chat/group`,
        {
          name: groupChatname,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        }, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
                  toast.update(toastId, {
                    render: "Group Created!",
                    type: "success",
                    isLoading: false, // Remove the loading indicator
                    autoClose: 3000, // Automatically close after 3 seconds
                  });
      console.log("group ke bande group banne ke baad ", data);

      setChats(data.data, ...chats);
      setFetchChatsAgain(!fetchchatsagain);
      dispatch(toggleModal());
    } catch (error) {
      console.log(error);
      console.log("Could not create group chat ");
    }
  };

  const handleDelete = (user) => {
    setSelectedusers(selectedUsers.filter((s) => s._id !== user._id));
  };

  const handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      console.log("already added");
      return;
    }

    setSelectedusers([...selectedUsers, user]);
  };

  const handler = (e) => {
    setGroupname(e.target.value);
  };

  return (
    <div className="relative z-50 w-full h-full bg-white flex flex-col items-center justify-center  p-4 rounded-md">
      <div
        className="top-0 right-0 absolute z-50 cursor-pointer"
        onClick={() => dispatch(toggleModal())}
      >
        <IoCloseSharp fontSize="40px" />
      </div>
      <div className="w-[60%]  bg-white flex flex-col gap-y-5  p-4 rounded-md">
        <div className="w-full text-center">
          <p className="text-xl">Create New Group Chat</p>
        </div>
        <form
          className="flex flex-col w-full items-center gap-2"
          onSubmit={(e) => handleOnSubmit(e)}
        >
          <div className="w-full flex flex-col gap-y-2">
            <input
              type="text"
              placeholder="Group Name"
              value={groupChatname}
              onChange={handler}
              className="w-full outline-none p-2 border-2 hover:border-blue-600 focus:border-blue-600 rounded-md"
            />
            <input
              type="text"
              placeholder="Add users"
              value={search}
              onChange={(e) => handlersearchquery(e)}
              className="w-full outline-none p-2 border-2 hover:border-blue-600 focus:border-blue-600 rounded-md"
            />
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-1  bg-blue-400 rounded-md p-1">
            {searchResult.length > 0 ? (
              searchResult.map((user, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleGroup(user)}
                    className="flex items-center gap-x-3 bg-gray-300 text-white rounded-md p-1 w-full  cursor-pointer hover:bg-green-400 hover:text-white"
                  >
                    <div className="w-[30px] h-[30px] rounded-full">
                      <img
                        src={user.image}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <div className=" font-semibold">{user.name}</div>
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
          <div className={`flex flex-wrap w-full gap-1 `}>
            {selectedUsers.map((user, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-x-1 rounded-lg bg-violet-600 text-sm text-white p-1"
                >
                  <div>{user.name}</div>

                  <div
                    onClick={() => handleDelete(user)}
                    className=" cursor-pointer"
                  >
                    <IoIosCloseCircleOutline fontSize="15px" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full flex justify-end">
            <button className="p-2 bg-blue-500 text-white w-fit h-fit rounded-md hover:bg-blue-400">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal