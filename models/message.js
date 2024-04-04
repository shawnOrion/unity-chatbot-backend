const mongoose = require("mongoose");
const Chat = require("./chat");

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;

// // Example usage:
// const newMessage = new Message({
//   role: "user",
//   content: "Hello, how are you?",
//   chatId: chat._id,
// });
// // Resulting document:
// {
//   _id: ObjectId("..."),
//   role: "user",
//   content: "Hello, how are you?",
//   chatId: ObjectId("...")
// }
