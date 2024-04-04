// controllers/chat.js
const openai = require("./openai");
const { format_message, get_response } = openai;
const Message = require("../models/message");
const Chat = require("../models/chat");

// TODO: remove this function and replace with GetChatMessages?
async function GetMessages() {
  try {
    const messages = await Message.find();
    // return map the messages to role and content
    return messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));
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

async function CreateUserMessage(content, chatId) {
  const userMessage = {
    role: "user",
    content,
    chatId,
  };
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
      chatId: chat._id,
    });
    await newMessageDoc.save();
    console.log("Created assistant message");
    await Chat.findOneAndUpdate(
      { _id: chat._id },
      { $push: { messages: newMessageDoc._id } },
      { new: true }
    );
    console.log("Added assistant message to chat");
    return newMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  GetMessages,
  CreateChat,
  CreateUserMessage,
  CreateChatbotMessage,
};
