// For testing if openai is working properly and we have credits or not

require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testTranscription() {
  try {
    // Example using a text completion to minimize dependencies
    const response = await openai.completions.create({
      model: "whisper-1",
      prompt: "This is a test prompt.",
      max_tokens: 5,
    });

    console.log(response.data);
  } catch (error) {
    console.error("Encountered an error:", error);
  }
}

testTranscription();