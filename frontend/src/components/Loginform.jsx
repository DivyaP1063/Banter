import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";
import apiConnector from "../services/apiconnector";
import { setUser,setToken } from "../slices/userSlice"; 
import { useNavigate } from "react-router-dom";
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
        return;
      }
  
      try {
            const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/user/login", {
              email,
              password,
            });
  
            console.log("LOGIN API RESPONSE............", response)
  
        if (!response.data.success) {
          throw new Error(response.data.message)
        }

      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image;
      dispatch(setUser({ ...response.data.user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(response.data.token))
      localStorage.setItem("Userinfo", JSON.stringify(response.data.user))
      navigate("/chats");

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
      <div className="font-bold text-lg">
        <p>Login</p>
      </div>

      <form onSubmit={handleOnSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={handlechange}
        />

        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={handlechange}
        />

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Login
        </button>
      </form>
      <div onClick={() => dispatch(toggleAuth())} className=" cursor-pointer">
        <p>
          Don't have an account?
          <span className="text-blue-500">SignUp here</span>
        </p>
      </div>
    </div>
  );
};

export default Loginform;
