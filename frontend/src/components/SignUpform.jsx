import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleAuth } from "../slices/authslice";
import { apiConnector } from "../services/apiconnector";
import { toast } from "react-toastify";

const SignUpform = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [formData, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  const { name, email, password, confirmPassword, image } = formData;

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
      image: e.target.files[0], // File object to be uploaded
    }));
  }

  // Handle form submission
  async function handleOnSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Password Incorrect")
      return;
    }

    try {
      const toastId = toast.loading("Creating Account");
      // Prepare FormData
      const dataToSend = new FormData();
      dataToSend.append("name", name);
      dataToSend.append("email", email);
      dataToSend.append("password", password);
      dataToSend.append("confirmPassword", confirmPassword);
      if (image) dataToSend.append("image", image); // Append image file

      // Send request using apiConnector
      const response = await apiConnector(
        "POST",
        "https://banter-backend-vdd3.onrender.com/api/v1/auth/user/signup",
        dataToSend
      );

      if (!response.data.success) {
        toast.update(toastId, {
          render: "Signup Unsuccessful!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      }

      toast.update(toastId, {
        render: "Sign Up Successful!",
        type: "success",
        isLoading: false, // Remove the loading indicator
        autoClose: 3000, // Automatically close after 3 seconds
      });

      // Store user info in localStorage
      localStorage.setItem("Userinfo", JSON.stringify(response.data));

      // Reset form data
      setFormdata({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: null,
      });

      // Toggle authentication state

      dispatch(toggleAuth());
    } catch (error) {
      toast.dismiss(); // This will close any lingering toast messages
      toast.error("Signup Unsuccessful");
      console.log("SIGNUP API ERROR:", error);
    }
  }

  return (
    <div
      className={`w-full h-full p-6 flex flex-col gap-3 items-center justify-center bg-white ${
        isLogin ? "rounded-l-2xl" : "rounded-r-2xl"
      } `}
    >
      <div className="w-[50%] h-fit flex flex-col gap-y-7">
        <div className="font-bold text-xl">
          <p>Create Account</p>
        </div>

        <form className="flex flex-col gap-y-4" onSubmit={handleOnSubmit}>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Full Name"
            onChange={handlechange}
            className="border-b-2 focus:border-blue-500 outline-none hover:border-blue-500 pb-2"
          />

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
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={handlechange}
            className="border-b-2 focus:border-blue-500 outline-none hover:border-blue-500 pb-2"
          />
          <div className="flex  items-center w-full gap-4">
            <p className="bg-gray-200 rounded-md p-2 text-gray-500">
              {image ? "Profile Pic Uploaded" : "Upload a Profile Pic"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-fit  p-2 hover:bg-cyan-300 bg-cyan-400 text-white rounded-md transition-colors duration-200 ease-in-out"
            >
              Browse
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-2 transition-colors duration-200 ease-in-out hover:bg-blue-400 bg-blue-500 text-white rounded-md"
          >
            Signup
          </button>
        </form>
        <div
          onClick={() => dispatch(toggleAuth())}
          className=" cursor-pointer text-center"
        >
          <p>
            Don't have an account?
            <span className="text-blue-500 hover:text-blue-300 transition-colors duration-200 ease-in-out">
              {` Login here`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpform;
