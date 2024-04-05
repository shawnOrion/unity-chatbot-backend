// controllers/chat.js
const ChatService = require("../services/chat");
const OpenAIService = require("../services/openai");

async function CreateChat(req, res) {
  try {
    const chat = await ChatService.CreateChat();
    res.json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function GetChats(req, res) {
  try {
    const chats = await ChatService.GetChats();
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
  GetMessages,
  GetChats,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
};
