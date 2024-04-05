const Chat = require("../models/chat");
const Message = require("../models/message");

class ChatService {
  constructor() {
    this.chat = Chat;
  }
  async GetMessages(chat) {
    try {
      const messageIds = chat.messages;
      const messages = await Message.find({ _id: { $in: messageIds } });
      return messages;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async GetChats() {
    try {
      const chats = await this.chat.find();
      return chats;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async CreateChat() {
    try {
      const chat = new this.chat();
      await chat.save();
      return chat;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async UpdateChat(messageDoc) {
    try {
      return await Chat.findOneAndUpdate(
        { _id: messageDoc.chatId },
        { $push: { messages: messageDoc._id } },
        { new: true }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async CreateMessage(role, content, chatId) {
    try {
      if (typeof chatId !== "object") {
        // in case chatId is a string
        chatId = new mongoose.Types.ObjectId(chatId);
      }
      const newMessageDoc = new Message({
        role: role,
        content: content,
        chatId: chatId,
      });
      return await newMessageDoc.save();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = new ChatService();
