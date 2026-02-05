const https = require('https');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log("Checking API key validity...\n");
console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)}\n`);

// Try to list available models
const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${API_KEY}`,
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}\n`);

        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            console.log("✅ API Key is VALID!\n");
            console.log("Available models:");
            if (response.models && response.models.length > 0) {
                response.models.forEach(model => {
                    console.log(`  - ${model.name}`);
                });
            } else {
                console.log("  No models available for this API key");
            }
        } else {
            console.log("❌ API Key ERROR:");
            console.log(data);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.end();
