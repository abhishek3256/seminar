const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function quickTest() {
    console.log("Testing gemini-pro with your API key...\n");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    try {
        const result = await model.generateContent("Say 'Hello World'");
        const response = await result.response;
        console.log("✅ SUCCESS! Response:", response.text());
    } catch (error) {
        console.error("❌ ERROR:", error.message);
        console.error("Full error:", error);
    }
}

quickTest();
