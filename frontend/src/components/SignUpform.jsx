import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";
import { apiConnector } from "../services/apiconnector";

const SignUpform = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const { name, email, password, confirmPassword,image } = formData;

  // Update form data for text inputs
  function handlechange(e) {
    setFormdata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  // Handle file input change
  function handleFileChange(e) {
    setFormdata((prev) => ({
      ...prev,
      image: e.target.files[0], // Save file object
    }));
  }

  async function handleOnSubmit(e){
    e.preventDefault();
    if (password !== confirmPassword) {
      console.log("Passwords Do Not Match");
      return;
    }

    try {
          const response = await apiConnector("POST", "http://localhost:4000/api/v1/auth/user/signup", {
            name,
            email,
            password,
            confirmPassword,
            image,
          });

          console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      localStorage.setItem("Userinfo",JSON.stringify(response));

    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      
    }


    dispatch(toggleAuth());

    // Reset
    setFormdata({
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
      image: null,
    });

  }

  return (
    <div
      className={`w-full h-full p-6 flex flex-col gap-3 items-center justify-center bg-white ${
        isLogin ? "rounded-l-2xl" : "rounded-r-2xl"
      } `}
    >
      <div className="font-bold">
        <p>Create an account</p>
      </div>
      <div className="w-full flex justify-center gap-3">
        <div className="border-[1px] rounded-md border-black hover:border-blue-600">
          <button className="p-2">SignUp with Google</button>
        </div>

        <div className="border-[1px] rounded-md border-black hover:border-blue-600">
          <button className=" p-2">SignUp with Facebook</button>
        </div>
      </div>

      <p>OR</p>

      <form className="flex flex-col gap-2" onSubmit={handleOnSubmit}>
        <input
          type="text"
          name="name"
          value={name}
          placeholder="Full Name"
          onChange={handlechange}
        />
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
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={handlechange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md"
        >
          Signup
        </button>
      </form>
      <div onClick={() => dispatch(toggleAuth())} className=" cursor-pointer">
        <p>
          Don't have an account?
          <span className="text-blue-500">Login here</span>
        </p>
      </div>
    </div>
  );
};

export default SignUpform;
