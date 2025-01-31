import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";
import apiConnector from "../services/apiconnector";
import { setUser,setToken } from "../slices/userSlice"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Loginform = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // Update form data for text inputs
  function handlechange(e) {
    setFormdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

    async function handleOnSubmit(e){
      e.preventDefault();
      if (!email || !password) {
        console.log("Fill all fields");
        toast.error("Fill all fields");
        return;
      }
  
      try {
            const response = await apiConnector(
              "POST",
              "https://banter-backend-vdd3.onrender.com/api/v1/auth/user/login",
              {
                email,
                password,
              }
            );
  
            console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          toast.error(response.data.message);
          throw new Error(response.data.message)
        }

      
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image;
      dispatch(setUser({ ...response.data.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("Userinfo", JSON.stringify(response.data.user))
      navigate("/chats");
      toast.success("Logged In");

        // Reset
        setFormdata({
          email: "",
          password: "",
        });

    
      } catch (error) {
        console.log("LOGIN API ERROR............", error)
        
      }
  
    }

  return (
    <div className="w-full h-full p-6 flex flex-col gap-3 items-center justify-center bg-white rounded-l-2xl ">
      <form
        onSubmit={handleOnSubmit}
        className="w-[50%] h-fit flex flex-col gap-y-7"
      >
        <div className="font-bold text-lg">
          <p>Login</p>
        </div>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={handlechange}
          className="border-b-2 focus:border-blue-500 outline-none hover:border-blue-500 pb-2"
        />

        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={handlechange}
          className="border-b-2 focus:border-blue-500 outline-none hover:border-blue-500 pb-2"
        />

        <button
          type="submit"
          className="w-full p-2 transition-colors duration-200 ease-in-out hover:bg-blue-400 bg-blue-500 text-white rounded-md"
        >
          Login
        </button>
      </form>
      <div onClick={() => dispatch(toggleAuth())} className=" cursor-pointer">
        <p>
          Don't have an account?
          <span className="text-blue-500 hover:text-blue-300 transition-colors duration-200 ease-in-out">{` Signup here`}</span>
        </p>
      </div>
    </div>
  );
};

export default Loginform;
