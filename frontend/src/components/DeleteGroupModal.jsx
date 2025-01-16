import React, { useState } from "react";
import { toggleModal } from "../slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat, setChats } from "../slices/chatSlice";
import apiConnector from "../services/apiconnector";
import { IoIosCloseCircleOutline } from "react-icons/io";

const DeleteGroupModal = ({
  fetchchatsagain,
  setFetchChatsAgain,
  fetchMessages,
}) => {
  const [groupChatname, setGroupname] = useState();
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedusers] = useState([]);
  const [searchResult, setSearchresult] = useState([]);
  const user = useSelector((state) => state.user.user);
  const [search, setSearch] = useState("");
  const selectedChat = useSelector((state) => state.chat.selectedChat);
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
  };

  const handleAddUser = async (usertoAdd) => {
    if (selectedChat.users.find((x) => x._id === usertoAdd._id)) {
      console.log("Already in the group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      console.log("Only admin can add anyone");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
      };

      // Use the apiConnector for the API call
      const data = await apiConnector(
        "PUT",
        `http://localhost:4000/api/v1/auth/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: usertoAdd._id,
        }, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
      console.log("adding in group ", data);

      dispatch(setSelectedChat(data.data));
      setFetchChatsAgain(!fetchchatsagain);
    } catch (error) {
      console.log(error);
      console.log("Could not fetch all user");
    }
  };

  const handleDelete = async (usertoRemove, close) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      usertoRemove._id !== user._id
    ) {
      console.log("Only admin can remove anyone");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
      };

      // Use the apiConnector for the API call
      const data = await apiConnector(
        "PUT",
        `http://localhost:4000/api/v1/auth/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: usertoRemove._id,
        }, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
      console.log("removing from group ", data);

      usertoRemove._id === user._id
        ? dispatch(setSelectedChat())
        : dispatch(setSelectedChat(data.data));
      setFetchChatsAgain(!fetchchatsagain);
      fetchMessages();

      if (close === true) dispatch(toggleModal());
    } catch (error) {
      console.log(error);
      console.log("Could not fetch all user");
    }
  };

  const handleRename = async () => {
    if (!groupChatname) {
      console.log("empty name");
      return;
    }
    try {
      const headers = {
        Authorization: `Bearer ${token}`, // Ensure token is valid and not expired
      };

      // Use the apiConnector for the API call
      const data = await apiConnector(
        "PUT",
        `http://localhost:4000/api/v1/auth/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatname }, // No body data for GET request
        headers, // Pass headers correctly
        null // Use query params
      );
      console.log("group chat updated", data);

      dispatch(setSelectedChat(data.data));
      setFetchChatsAgain(!fetchchatsagain);
      setGroupname("");
    } catch (error) {
      console.log(error);
      console.log("Could not update group chat");
    }
  };

  const handler = (e) => {
    setGroupname(e.target.value);
  };

  return (
    <div className="relative z-50 w-full h-full bg-white flex flex-col gap-2 items-center justify-between p-4 rounded-md">
      <div className="w-full text-center">
        <h2 className="text-xl">Update Group Chat</h2>
      </div>
      <div>
        <p>{selectedChat.chatName}</p>
      </div>
      <div className="flex flex-wrap justify-center w-full gap-1">
        {selectedChat.users.map((user, index) => {
          return (
            <div
              key={index}
              className="flex  items-center justify-center gap-x-1 rounded-lg bg-violet-600 text-sm text-white p-1"
            >
              <div>{user.name}</div>

              <div onClick={() => handleDelete(user)}>
                <IoIosCloseCircleOutline fontSize="15px" />
              </div>
            </div>
          );
        })}
      </div>
      <form className="flex flex-col w-full items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="border-2 rounded-md p-1">
            <input
              type="text"
              placeholder="Update Chat Name"
              value={groupChatname}
              onChange={(e) => handler(e)}
            />
          </div>

          <div
            onClick={() => handleRename()}
            className="bg-green-500 text-white p-1 rounded-md"
          >
            Update
          </div>
        </div>

        <div className="border-2 rounded-md p-1">
          <input
            type="text"
            placeholder="Add users"
            value={search}
            onChange={(e) => handlersearchquery(e)}
          />
        </div>
        <div>
          {searchResult.length > 0 ? (
            searchResult.map((user, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleAddUser(user)}
                  className="cursor-pointer"
                >
                  {user.name}
                </div>
              );
            })
          ) : (
            <div></div>
          )}
        </div>

        <div className="w-full flex justify-end">
          <div
            className="p-2 bg-red-500 text-white w-fit h-fit rounded-md"
            onClick={() => handleDelete(user, true)}
          >
            Leave Group
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeleteGroupModal;
