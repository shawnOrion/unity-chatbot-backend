const ChatService = require("../services/user");
const OpenAIService = require("../services/openai");

async function createChat(req, res) {
  const { userId } = req.params;

  const result = await ChatService.createChat(userId);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json({ chat: result.chat });
}

async function getChats(req, res) {
  const { userId } = req.params;

  const result = await ChatService.getChats(userId);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json({ chats: result.chats });
}

async function getMessages(req, res) {
  const { chat } = req.body;

  const result = await ChatService.getMessages(chat);
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  res.status(result.status).json({ messages: result.messages });
}

async function createUserMessage(req, res) {
  const { message } = req.body;
  if (!message.content || !message.chatId) {
    return res.status(400).json({ error: "Invalid message format" });
  }

  const result = await ChatService.createMessage(
    "user",
    message.content,
    message.chatId
  );
  if (result.error) {
    return res.status(result.status).json({ error: result.error });
  }

  await ChatService.updateChat(result.message);

  res.status(result.status).json({ message: result.message });
}

async function createChatbotMessage(req, res) {
  const { chat } = req.body;
  if (!chat._id || !chat.messages || !chat.title) {
    return res.status(400).json({ error: "Invalid chat format" });
  }

  const messagesResult = await ChatService.getMessages(chat);
  if (messagesResult.error) {
    return res
      .status(messagesResult.status)
      .json({ error: messagesResult.error });
  }

  const newMessage = await OpenAIService.createMessage(messagesResult.messages);
  const newMessageDocResult = await ChatService.createMessage(
    "assistant",
    newMessage.content,
    chat._id
  );
  if (newMessageDocResult.error) {
    return res
      .status(newMessageDocResult.status)
      .json({ error: newMessageDocResult.error });
  }

  await ChatService.updateChat(newMessageDocResult.message);
  res
    .status(newMessageDocResult.status)
    .json({ message: newMessageDocResult.message });
}

module.exports = {
  getMessages,
  getChats,
  createChat,
  createUserMessage,
  createChatbotMessage,
};
