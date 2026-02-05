const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listAvailableModels() {
    console.log("Checking available models for your API key...\n");

    if (!process.env.GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY not found in .env");
        return;
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Test different model names that might work
    const modelsToTest = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-1.0-pro'
    ];

    for (const modelName of modelsToTest) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Say 'OK' if you can read this.");
            const response = await result.response;
            console.log(`✅ ${modelName}: WORKS!`);
            console.log(`   Response: ${response.text()}\n`);
        } catch (error) {
            console.log(`❌ ${modelName}: ${error.message}\n`);
        }
    }
}

listAvailableModels();
