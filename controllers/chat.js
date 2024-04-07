// controllers/chat.js
const ChatService = require("../services/chat");
const OpenAIService = require("../services/openai");
const User = require("../models/user");

// function to create user
async function CreateUser(req, res) {
  try {
    const { email } = req.body;
    console.log(`Creating user with email: ${email}`);
    const user = new User({
      email,
      chats: [],
    });
    await user.save();
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function GetUser(req, res) {
  try {
    const { email } = req.body;
    console.log(`Getting user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User found: ", user);
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function CreateChat(req, res) {
  try {
    const { userId } = req.params;
    const chat = await ChatService.CreateChat(userId);
    res.json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function GetChats(req, res) {
  try {
    const { userId } = req.params;
    const chats = await ChatService.GetChats(userId);
    res.json({ chats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function GetMessages(req, res) {
  try {
    const { chat } = req.body;
    const messages = await ChatService.GetMessages(chat);
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function CreateUserMessage(req, res) {
  try {
    const { message } = req.body;
    if (!message.content || !message.chatId) {
      return res.status(400).json({ error: "Invalid message format" });
    }
    const newMessageDoc = await ChatService.CreateMessage(
      "user",
      message.content,
      message.chatId
    );
    await ChatService.UpdateChat(newMessageDoc);

    res.json({ message: newMessageDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function CreateChatbotMessage(req, res) {
  try {
    const { chat } = req.body;
    if (!chat._id || !chat.messages || !chat.title) {
      return res.status(400).json({ error: "Invalid chat format" });
    }

    const messages = await ChatService.GetMessages(chat);

    const newMessage = await OpenAIService.createMessage(messages);
    const newMessageDoc = await ChatService.CreateMessage(
      "assistant",
      newMessage.content,
      chat._id
    );
    await ChatService.UpdateChat(newMessageDoc);
    res.json({ message: newMessageDoc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  CreateUser,
  GetUser,
  GetMessages,
  GetChats,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
};
