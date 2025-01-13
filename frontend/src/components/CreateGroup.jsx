import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import { IoAdd } from "react-icons/io5";
import { toggleModal } from '../slices/modalSlice';
const Search = () => {

  const dispatch= useDispatch();


  return (
    <div className='bg-white rounded-2xl h-[8%] w-full shadow-md shadow-blue-300 flex items-center justify-between p-2'
    >
    <p className='text-lg'>Create a Group Chat</p>
    <div onClick={()=>dispatch(toggleModal())}>
    <IoAdd  fontSize="40px " color='red'/>
    </div>
    
    </div>
  )
}

export default Search