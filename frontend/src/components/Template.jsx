import React from "react";
import SignUpform from "./SignUpform";
import Loginform from "./Loginform";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";
import ChatImg from "../assets/chat.gif"

const Template = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();

  return (
    <div className="relative z-50 h-screen w-screen min-h-screen max-h-screen min-w-screen max-w-screen bg-blue-500 flex flex-col justify-center items-center ">
      <div
        className={` flex  justify-between  w-[85%] h-[80%] bg-blue-200 rounded-md `}
      >
        <div
          className=" w-[40%] text-grey-400 h-full flex flex-col justify-between items-center p-14"
          style={{
            transform: isLogin ? "translateX(0%)" : "translateX(150%)", // Toggle Slide
          }}
        >
          <p className="text-4xl w-full font-semibold">Banter - Chat Made Simple!</p>

          <div className="w-full h-[30%] flex items-center justify-center">
            <img src={ChatImg} alt="React" className="w-[200px] h-[200px]" />
          </div>

          <p className="text-2xl w-full text-gray-600">
            Chat in Real-Time, Anywhere! Instant, secure, and seamless
            conversations at your fingertips. 
            <span
              onClick={() => dispatch(toggleAuth())}
              className=" cursor-pointer text-blue-600 font-semibold"
            >
              {` Join now!`}
            </span>
          </p>
        </div>

        <div
          className={` w-[60%] h-full rounded-l-2xl transition-transform duration-500 ease-in-out  `}
          style={{
            transform: isLogin ? "translateX(0%)" : "translateX(-67%)", // Toggle Slide
          }}
        >
          {isLogin ? <Loginform /> : <SignUpform />}
        </div>
      </div>
    </div>
  );
};

export default Template;
