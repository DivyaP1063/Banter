const Chat = require("../models/chatModel");
const User = require("../models/userModel")
const Message = require('../models/messageModel');

exports.sendMessages = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    // Create new message
    let message = await Message.create(newMessage);

    // Populate the sender details
    message = await message.populate("sender", "name image");
    // Populate chat details
    message = await message.populate("chat");
    // Populate user details for the chat users
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email image",
    });

    // Update the chat with the latest message
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.allMessages = async (req, res) => {
  try {
    // Fetch all messages for a specific chat
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name image email")
      .populate("chat");

    // Return the fetched messages
    res.status(200).json(messages);
  } catch (error) {
    // Error handling
    res.status(400).json({ error: error.message });
  }
};
