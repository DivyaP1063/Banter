const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        // Extract token
        const token =
            req.cookies.token ||
            req.body.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        // If token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred during token validation",
        });
    }
};



module.exports = { auth };
