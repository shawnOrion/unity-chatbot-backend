// routes/chat.js
var express = require("express");
var router = express.Router();
const {
  CreateChatMessage,
  GetMessages,
  CreateChat,
} = require("../controllers/chat");
const logger = require("../middleware/logger");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/message", logger, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message.role || !message.content || !message.chatId) {
      return res.status(400).json({ error: "Invalid message format" });
    }
    const newMessage = await CreateChatMessage(message);
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
