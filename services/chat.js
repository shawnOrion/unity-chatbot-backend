const User = require("../models/user");
const Chat = require("../models/chat");
const Message = require("../models/message");
const mongoose = require("mongoose");

class ChatService {
  static async getMessages(chat) {
    try {
      const messageIds = chat.messages;
      const messages = await Message.find({ _id: { $in: messageIds } });
      return { messages, status: 200 };
    } catch (error) {
      console.error(error);
      return { error: error.message, status: 500 };
    }
  }

  static async getChats(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { error: "User not found", status: 404 };
      }
      const chats = await Chat.find({ userId: user._id });
      return { chats, status: 200 };
    } catch (error) {
      console.error(error);
      return { error: error.message, status: 500 };
    }
  }

  static async createChat(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { error: "User not found", status: 404 };
      }
      const chat = new Chat({ userId: user._id });
      await chat.save();
      user.chats.push(chat._id);
      await user.save();
      console.log("Chat created successfully", { chat: chat, user: user });
      return { chat, status: 201 };
    } catch (error) {
      console.error(error);
      return { error: error.message, status: 500 };
    }
  }

  static async updateChat(messageDoc) {
    try {
      const updatedChat = await Chat.findOneAndUpdate(
        { _id: messageDoc.chatId },
        { $push: { messages: messageDoc._id } },
        { new: true }
      );
      if (!updatedChat) {
        return { error: "Chat not found", status: 404 };
      }
      return { updatedChat, status: 200 };
    } catch (error) {
      console.error(error);
      return { error: error.message, status: 500 };
    }
  }

  static async createMessage(role, content, chatId) {
    try {
      const chatExists = await Chat.findById(chatId);
      if (!chatExists) {
        return { error: "Chat not found", status: 404 };
      }

      if (typeof chatId !== "object") {
        // in case chatId is a string
        chatId = new mongoose.Types.ObjectId(chatId);
      }
      const newMessageDoc = new Message({
        role: role,
        content: content,
        chatId: chatId,
      });
      await newMessageDoc.save();
      return { message: newMessageDoc, status: 201 };
    } catch (error) {
      console.error(error);
      return { error: error.message, status: 500 };
    }
  }
}

module.exports = ChatService;
