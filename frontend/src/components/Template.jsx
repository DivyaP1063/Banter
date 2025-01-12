import React from "react";
import textimg from "../assets/react.svg";
import SignUpform from "./SignUpform";
import Loginform from "./Loginform";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";

const Template = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();

  return (
    <div className="relative h-screen w-screen min-h-screen max-h-screen min-w-screen max-w-screen bg-blue-500 flex flex-col justify-center items-center">
      <div className={` flex  justify-between  w-[85%] h-[80%] bg-blue-200 `}>
        <div
          className=" w-[20%] text-grey-400 h-full flex flex-col gap-5 items-center p-5"
          style={{
            transform: isLogin ? "translateX(0%)" : "translateX(400%)", // Toggle Slide
          }}
        >
          <p className="text-xl">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illo,
            impedit.
          </p>
          <div className="flex justify-center">
            <img src={textimg} alt="React" />
          </div>
          <p>Lorem ipsum dolor sit amet.</p>
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
