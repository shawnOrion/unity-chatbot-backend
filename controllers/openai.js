// controllers/openai.js
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

function format_message(role, content) {
  return {
    role: role,
    content: content,
  };
}

async function get_response(messages) {
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4-1106-preview",
  });
  return completion.choices[0].message.content;
}
module.exports = {
  format_message,
  get_response,
};
