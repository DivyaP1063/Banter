// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup
} = require("../controllers/chatcontrollers");


const { auth } = require("../middlewares/auth")



router.post("/",auth, accessChat);
router.get("/",auth, fetchChats);
router.post("/group",auth, createGroupChat);
router.put("/rename",auth, renameGroup);
router.put("/groupremove",auth, removeFromGroup);
router.put("/groupadd",auth, addToGroup);

module.exports = router