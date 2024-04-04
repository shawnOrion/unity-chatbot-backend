// controllers/chat.js
const openai = require("./openai");
const { format_message, get_response } = openai;
const mongoose = require("mongoose");
const Message = require("../models/message");
const Chat = require("../models/chat");

async function GetMessages(chat) {
  try {
    const messageIds = chat.messages;
    // Log the list of message IDs
    console.log("Message IDs: ", messageIds);
    // Log the first message ID
    console.log("First message ID: ", messageIds[0]);
    const messages = await Message.find({ _id: { $in: messageIds } });
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function GetChats() {
  try {
    const chats = await Chat.find();
    return chats;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// async function CreateChat()
async function CreateChat() {
  try {
    const chat = new Chat();
    await chat.save();
    return chat;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function CreateUserMessage(message) {
  const content = message.content;
  const chatIdStr = message.chatId;
  console.log("Creating user message");
  const chatId = new mongoose.Types.ObjectId(chatIdStr);
  console.log("ChatId: ", chatId);
  console.log("Content: ", content);
  const userMessage = {
    role: "user",
    content,
    chatId,
  };
  console.log("User message: ", userMessage);
  const userMessageDoc = new Message(userMessage);
  await userMessageDoc.save();
  console.log("Created user message");
  await Chat.findOneAndUpdate(
    { _id: userMessage.chatId },
    { $push: { messages: userMessageDoc._id } },
    { new: true }
  );
  console.log("Added user message to chat");
  return userMessageDoc;
}

async function CreateChatbotMessage(chat) {
  try {
    const messages = await Message.find({ _id: { $in: chat.messages } });
    const formattedMessages = messages.map((message) =>
      format_message(message.role, message.content)
    );

    const newMessage = await get_response(formattedMessages);
    console.log("Response: ", newMessage);
    const newMessageDoc = new Message({
      role: newMessage.role,
      content: newMessage.content,
      chatId: new mongoose.Types.ObjectId(chat._id),
    });
    await newMessageDoc.save();
    console.log("Created assistant message");
    await Chat.findOneAndUpdate(
      { _id: chat._id },
      { $push: { messages: newMessageDoc._id } },
      { new: true }
    );
    console.log("Added assistant message to chat");
    return newMessageDoc;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  GetMessages,
  GetChats,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
};
