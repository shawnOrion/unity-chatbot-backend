var express = require("express");
var router = express.Router();
const {
  getMessages,
  getChats,
  createChat,
  createUserMessage,
  createChatbotMessage,
} = require("../controllers/chat");

router.post("/user-message", createUserMessage);

router.post("/chatbot-message", createChatbotMessage);

router.post("/chat/:userId", createChat);

router.get("/chats/:userId", getChats);

router.get("/messages", getMessages);

module.exports = router;
