// services/chat.js
const User = require("../models/user");

class UserService {
  static async userExists(email) {
    try {
      const existingUser = await User.findOne({ email });
      return existingUser != null;
    } catch (error) {
      console.error(error);
      throw new Error("Error checking user existence");
    }
  }

  static async createUser(email) {
    try {
      if (await this.userExists(email)) {
        return { error: "User already exists", status: 400 };
      }
      const user = new User({
        email,
        chats: [],
      });
      return await user.save();
    } catch (error) {
      console.error(error);
      throw new Error("Error creating user");
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return { error: "User not found", status: 404 };
      }
      return { user, status: 200 };
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching user");
    }
  }
}

module.exports = UserService;
