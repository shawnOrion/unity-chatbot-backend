const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true
  },
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
