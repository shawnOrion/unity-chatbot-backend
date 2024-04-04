// routes/chat.js
var express = require("express");
var router = express.Router();
const { CreateChatMessage, GetMessages } = require("../controllers/chat");
const logger = require("../middleware/logger");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/send-message", logger, async (req, res) => {
  try {
    const { message } = req.body; // message is a string
    // check if message.role and .content are present
    if (!message.role || !message.content) {
      return res.status(400).json({ error: "Invalid message format" });
    }
    const newMessage = await CreateChatMessage(message);
    res.json({ message: newMessage });
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
