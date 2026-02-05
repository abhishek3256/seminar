const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testConnection() {
    console.log("-----------------------------------------");
    console.log("Testing Gemini API Connection...");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ ERROR: GEMINI_API_KEY is missing in .env file");
        return;
    }

    console.log("✅ API Key found");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        console.log("Attempting to generate content with 'gemini-pro'...");
        const result = await model.generateContent("Say 'Connection Successful' if you can read this.");
        const response = await result.response;
        console.log("✅ API SUCCESS! Response:", response.text());
        console.log("-----------------------------------------");
    } catch (error) {
        console.error("❌ API FAILURE:", error.message);
        if (error.message.includes("404")) {
            console.log("Hint: This might be due to the model name. Try updating the SDK or checking available models.");
        }
        console.log("-----------------------------------------");
    }
}

testConnection();
