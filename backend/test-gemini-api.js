// test-gemini-api.js
// Run this to verify your API key and see available models
// Usage: node test-gemini-api.js

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
    console.log('🔍 Testing Gemini API Connection...\n');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ ERROR: GEMINI_API_KEY not found in environment variables!');
        console.log('   Please add GEMINI_API_KEY to your .env file\n');
        return;
    }

    console.log(`✓ API Key found: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

    const genAI = new GoogleGenerativeAI(apiKey);

    // Test different models
    const modelsToTest = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-2.0-flash-exp'
    ];

    console.log('Testing available models:\n');

    for (const modelName of modelsToTest) {
        try {
            console.log(`Testing: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent('Say "Hello" in one word');
            const response = await result.response;
            console.log(`  ✅ ${modelName} is WORKING`);
            console.log(`     Response: ${response.text().trim()}\n`);
        } catch (error) {
            if (error.message.includes('404')) {
                console.log(`  ❌ ${modelName} - NOT AVAILABLE (404)\n`);
            } else if (error.message.includes('429')) {
                console.log(`  ⚠️  ${modelName} - RATE LIMITED (wait a moment)\n`);
            } else {
                console.log(`  ❌ ${modelName} - ERROR: ${error.message}\n`);
            }
        }
    }

    console.log('\n📊 RECOMMENDATION:');
    console.log('   Use gemini-1.5-flash for fast, efficient parsing');
    console.log('   Use gemini-1.5-pro for more complex analysis\n');

    // Try to list all available models via API
    console.log('🔍 Attempting to list all available models...\n');
    try {
        const https = require('https');
        
        await new Promise((resolve, reject) => {
            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1beta/models?key=${apiKey}`,
                method: 'GET'
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        const response = JSON.parse(data);
                        console.log('✅ Available models from API:');
                        if (response.models && response.models.length > 0) {
                            response.models
                                .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                                .forEach(model => {
                                    const name = model.name.replace('models/', '');
                                    console.log(`   - ${name}`);
                                });
                        }
                    } else {
                        console.log(`❌ API returned status ${res.statusCode}`);
                        console.log(data);
                    }
                    resolve();
                });
            });

            req.on('error', (error) => {
                console.error('❌ Request failed:', error.message);
                resolve();
            });

            req.end();
        });
    } catch (error) {
        console.error('Error listing models:', error.message);
    }

    console.log('\n✅ Testing complete!\n');
}

// Run the test
testGeminiAPI().catch(console.error);