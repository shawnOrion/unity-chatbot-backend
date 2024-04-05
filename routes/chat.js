// routes/chat.js
var express = require("express");
var router = express.Router();
const {
  GetMessages,
  GetChats,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
} = require("../controllers/chat");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/user-message", CreateUserMessage);

router.post("/chatbot-message", CreateChatbotMessage);

router.post("/chat", CreateChat);

router.get("/chats", GetChats);

router.get("/messages", GetMessages);

module.exports = router;
