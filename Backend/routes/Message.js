// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  sendMessages,


} = require("../controllers/messagecontrollers");


const { auth } = require("../middlewares/auth")



router.post("/",auth, sendMessages);
// router.get("/",auth, allMessages);


module.exports = router