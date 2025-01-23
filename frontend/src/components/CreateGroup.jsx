import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { IoAdd } from "react-icons/io5";
import { toggleModal } from '../slices/modalSlice';
import { setModalType } from '../slices/modalSlice';
const Search = () => {

  const dispatch= useDispatch();
  

  const modalSwitchhandler= ()=>{
        dispatch(setModalType("GroupChat"));
        dispatch(toggleModal())
  }


  return (
    <div className="bg-white rounded-2xl h-[8%] w-full shadow-md shadow-blue-300 flex items-center justify-between p-3">
      <p className="text-lg text-gray-600 font-semibold">Create a Group Chat</p>
      <div
        onClick={() => modalSwitchhandler()}
        className="hover:cursor-pointer  hover:scale-110 transition-transform duration-100 ease-in-out"
      >
        <IoAdd fontSize="35px " color="purple" />
      </div>
    </div>
  );
}

export default Search