const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Testing gemini-1.5-flash...");
    const result = await model.generateContent("Hello");
    console.log("Success! Response:", result.response.text());
  } catch (error) {
    console.error("Error with 1.5-flash:", error.message);

    console.log("\nListing available models...");
    // Note: listModels might not be directly exposed easily in all SDK versions without digging, 
    // but let's try a standard model fallback test if the above failed.
    try {
      const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
      console.log("Testing gemini-pro...");
      const resultPro = await modelPro.generateContent("Hello");
      console.log("Success with gemini-pro! Response:", resultPro.response.text());
    } catch (e) {
      console.error("Error with gemini-pro:", e.message);
    }
  }
}

listModels();
