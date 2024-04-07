// routes/chat.js
var express = require("express");
var router = express.Router();
const {
  CreateUser,
  GetUser,
  GetMessages,
  GetChats,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
} = require("../controllers/chat");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/user", CreateUser);

router.get("/user", GetUser);

router.post("/user-message", CreateUserMessage);

router.post("/chatbot-message", CreateChatbotMessage);

router.post("/chat/:userId", CreateChat);

router.get("/chats/:userId", GetChats);

router.get("/messages", GetMessages);

module.exports = router;
