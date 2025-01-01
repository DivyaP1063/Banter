const bcrypt = require("bcryptjs")
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")
const uploadImageToCloudinary = require("../utils/imageUploader");
const { query } = require("express");
require("dotenv").config()

// Signup Controller for Registering USers

exports.signup = async (req, res) => {
  try {
    // Destructure fields from the request body
    const {
      name,
      email,
      password,
      confirmPassword,
      image,
      
    } = req.body
    // Check if All Details are there or not
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword) 
      {
      return res.status(403).send({
        success: false,
        message: "All Fields are required",
      })
    }
    // Check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      })
    }

    if(image){
      const imageUrl=uploadImageToCloudinary(image,process.env.FOLDER_NAME,100,100) 
    }



    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      image:"",
    })

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
  }
}

// Login controller for authenticating users
exports.login = async (req, res) => {
  try {
    // Get email and password from request body
    const { email, password } = req.body

    // Check if email or password is missing
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      })
    }

    // Find user with provided email
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us Please SignUp to Continue`,
      })
    }

    // Generate JWT token and Compare Password
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id},
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      )

      

      // Save token to user document in database
      const userResponse = {
        ...user.toObject(),
        token: token,
      };

      // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user: userResponse,
        message: `User Login Success`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `Password is incorrect`,
      })
    }
  } catch (error) {
    console.error(error)
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    })
  }
}
// // Send OTP For Email Verification
// exports.sendotp = async (req, res) => {
//   try {
//     const { email } = req.body

//     // Check if user is already present
//     // Find user with provided email
//     const checkUserPresent = await User.findOne({ email })
//     // to be used in case of signup

//     // If user found with provided email
//     if (checkUserPresent) {
//       // Return 401 Unauthorized status code with error message
//       return res.status(401).json({
//         success: false,
//         message: `User is Already Registered`,
//       })
//     }

//     var otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       lowerCaseAlphabets: false,
//       specialChars: false,
//     })
//     const result = await OTP.findOne({ otp: otp })
//     console.log("Result is Generate OTP Func")
//     console.log("OTP", otp)
//     console.log("Result", result)
//     while (result) {
//       otp = otpGenerator.generate(6, {
//         upperCaseAlphabets: false,
//       })
//     }
//     const otpPayload = { email, otp }
//     const otpBody = await OTP.create(otpPayload)
//     console.log("OTP Body", otpBody)
//     res.status(200).json({
//       success: true,
//       message: `OTP Sent Successfully`,
//       otp,
//     })
//   } catch (error) {
//     console.log(error.message)
//     return res.status(500).json({ success: false, error: error.message })
//   }
// }

// // Controller for Changing Password
// exports.changePassword = async (req, res) => {
//   try {
//     // Get user data from req.user
//     const userDetails = await User.findById(req.user.id)

//     // Get old password, new password, and confirm new password from req.body
//     const { oldPassword, newPassword } = req.body

//     // Validate old password
//     const isPasswordMatch = await bcrypt.compare(
//       oldPassword,
//       userDetails.password
//     )
//     if (!isPasswordMatch) {
//       // If old password does not match, return a 401 (Unauthorized) error
//       return res
//         .status(401)
//         .json({ success: false, message: "The password is incorrect" })
//     }

//     // Update password
//     const encryptedPassword = await bcrypt.hash(newPassword, 10)
//     const updatedUserDetails = await User.findByIdAndUpdate(
//       req.user.id,
//       { password: encryptedPassword },
//       { new: true }
//     )

//     // Send notification email
//     try {
//       const emailResponse = await mailSender(
//         updatedUserDetails.email,
//         "Password for your account has been updated",
//         passwordUpdated(
//           updatedUserDetails.email,
//           `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
//         )
//       )
//       console.log("Email sent successfully:", emailResponse.response)
//     } catch (error) {
//       // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
//       console.error("Error occurred while sending email:", error)
//       return res.status(500).json({
//         success: false,
//         message: "Error occurred while sending email",
//         error: error.message,
//       })
//     }

//     // Return success response
//     return res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully" })
//   } catch (error) {
//     // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
//     console.error("Error occurred while updating password:", error)
//     return res.status(500).json({
//       success: false,
//       message: "Error occurred while updating password",
//       error: error.message,
//     })
//   }
// }


exports.allUsers = async (req,res)=>{
  try{
    const keyword = req.query.search?{
      $or:[
        {name:{$regex: req.query.search,$options:"i"}},
        {email:{$regex: req.query.search,$options:"i"}},
      ]
    }
    :{};

    const users= await User.find(keyword).find({_id:{$ne:req.user.id}});
    
      return res
      .status(200)
      .json({ success: true, message: "Found the users",users })
  } catch (error) {
    
    console.error("Error occurred while finding allusers", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while finding allusers",
      error: error.message,
    })
  }
}