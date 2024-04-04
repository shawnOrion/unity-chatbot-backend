// controllers/chat.js
const openai = require("./openai");
const { format_message, get_response } = openai;
const Message = require("../models/message");

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

async function CreateChatMessage(userMessage) {
  try {
    const userMessageDoc = new Message(userMessage);
    await userMessageDoc.save();
    // update log
    console.log("Added user message");
    const messages = await Message.find();
    const formattedMessages = messages.map((message) =>
      format_message(message.role, message.content)
    );

    const newMessage = await get_response(formattedMessages);
    console.log("Response: ", newMessage);
    const newMessageDoc = new Message({
      role: newMessage.role,
      content: newMessage.content,
    });
    await newMessageDoc.save();
    console.log("Added assistant message");

    return newMessage;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  CreateChatMessage,
  GetMessages,
};
