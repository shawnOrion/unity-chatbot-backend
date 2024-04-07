// services/openai.js
const { OpenAI } = require("openai");

class OpenAIService {
  constructor(apiKey) {
    this.openai = new OpenAI({ apiKey });
  }
  formatMessage(role, content) {
    return {
      role: role,
      content: content,
    };
  }

  async createCompletion(messages) {
    return await this.openai.chat.completions.create({
      messages: messages,
      model: "gpt-4-1106-preview",
    });
  }

  async createMessage(messages) {
    const formattedMessages = messages.map((message) =>
      this.formatMessage(message.role, message.content)
    );
    const completion = await this.createCompletion(formattedMessages);
    return this.formatMessage(
      "assistant",
      completion.choices[0].message.content
    );
  }
}

module.exports = new OpenAIService(process.env.OPENAI_API_KEY);
