const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  title: {
    type: String,
    default: "Untitled",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
// Example Chat document:
// const exampleChat = new Chat({
//     messages: [
//         ObjectId('someObjectIdForMessage1'),
//         ObjectId('someObjectIdForMessage2')
//     ]
// });
// Result:
// {
//     "_id": "someGeneratedId",
//     "messages": [
//         "someObjectIdForMessage1",
//         "someObjectIdForMessage2"
//     ],
//     "title": "Untitled"
// }
