import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import {setSlide} from "../slices/slidingSlice"
import { MdOutlineSearch } from "react-icons/md";
const Search = () => {
  const user = useSelector((state)=>state.user.user);
  const dispatch= useDispatch();

  return (
    <div className='bg-white rounded-2xl h-[8%] w-full shadow-md shadow-blue-300 flex items-center gap-2 p-2'
    onClick={() => dispatch(setSlide())}>
    <MdOutlineSearch fontSize="30px"  />
    <p className='text-lg'>Search</p>
    </div>
  )
}

export default Search