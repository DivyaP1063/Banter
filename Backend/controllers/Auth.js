const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Signup Controller for Registering Users
exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

      console.log(req.files);

    // Validate request body
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match. Please try again.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please log in.",
      });
    }

    // Handle image upload or default avatar
    let imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}`;
    if (req.files) {
      const result = await uploadImageToCloudinary(
        req.files.image,
        process.env.FOLDER_NAME
      );
      console.log(result)
      imageUrl = result.secure_url;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

// Login Controller for Authenticating Users
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not registered. Please sign up.",
      });
    }

    // Validate password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive data
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    // Set token in cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User logged in successfully.",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

// Fetch All Users Controller
exports.allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user.id } });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully.",
      users,
    });
  } catch (error) {
    console.error("Fetch All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while fetching users.",
    });
  }
};
