import React from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from "react-redux";
import {setSlide} from "../slices/slidingSlice"
import { MdOutlineSearch } from "react-icons/md";
const Search = () => {
  const user = useSelector((state)=>state.user.user);
  const dispatch= useDispatch();

  return (
    <div
      className="bg-white rounded-2xl relative z-0 h-[8%] w-full shadow-md shadow-blue-300 flex items-center gap-2 p-2 hover:cursor-pointer hover:scale-105 transition-transform duration-100 ease-in-out"
      onClick={() => dispatch(setSlide())}
    >
      <div className='text-[30px] max-lg:text-[25px]'>
        <MdOutlineSearch  color="grey" />
      </div>

      <p className="text-lg max-lg:text-base text-gray-400 font-semibold">
        Search
      </p>
    </div>
  );
}

export default Search