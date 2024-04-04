// routes/chat.js
var express = require("express");
var router = express.Router();
const {
  GetMessages,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
} = require("../controllers/chat");
const logger = require("../middleware/logger");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/user-message", logger, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message.content || !message.chatId) {
      return res.status(400).json({ error: "Invalid message format" });
    }
    const newUserMessage = await CreateUserMessage(message);
    res.json({ message: newUserMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/chatbot-message", logger, async (req, res) => {
  try {
    const { chat } = req.body;
    if (!chat.id || !chat.messages || !chat.title) {
      return res.status(400).json({ error: "Invalid chat format" });
    }
    const newMessage = await CreateChatbotMessage(chat);
    res.json({ message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const chat = await CreateChat();
    res.json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await GetMessages();
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
