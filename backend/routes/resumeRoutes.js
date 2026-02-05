// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const pdfParse = require('pdf-parse');
// const mammoth = require('mammoth');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// // --- 1. Configuration & Security ---

// // Configure Multer for MEMORY STORAGE (Critical for privacy)
// // Files are held in RAM only and never written to disk.
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = [
//             'application/pdf',
//             'application/msword',
//             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//         ];
//         if (allowedTypes.includes(file.mimetype)) {
//             cb(null, true);
//         } else {
//             cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
//         }
//     }
// });

// // Initialize Gemini API
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // Using gemini-1.5-pro - Supported model for v1beta API
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// // --- 2. Helper Functions ---

// async function analyzeWithGemini(resumeText, jobDetails) {
//     const prompt = `
// You are an expert ATS (Applicant Tracking System) and resume analyzer. 

// ANALYZE this resume against the job requirements and provide a detailed match analysis.

// JOB DETAILS:
// - Job Title: ${jobDetails.jobTitle}
// - Experience Level Required: ${jobDetails.experienceLevel}
// - Job Description: ${jobDetails.jobDescription}
// - Required Skills: ${Array.isArray(jobDetails.requiredSkills) ? jobDetails.requiredSkills.join(', ') : jobDetails.requiredSkills}
// - Nice-to-Have Skills: ${jobDetails.niceToHaveSkills ? (Array.isArray(jobDetails.niceToHaveSkills) ? jobDetails.niceToHaveSkills.join(', ') : jobDetails.niceToHaveSkills) : 'None'}

// RESUME TEXT:
// ${resumeText}

// PROVIDE YOUR ANALYSIS IN THE FOLLOWING JSON FORMAT ONLY (no markdown, no extra text):

// {
//   "candidateName": "extracted name or Unknown",
//   "candidateEmail": "extracted email or Not found",
//   "candidatePhone": "extracted phone or Not found",
//   "matchPercentage": 85,
//   "overallFit": "Excellent Match",
//   "experienceYears": "5 years",
//   "experienceMatch": {
//     "score": 90,
//     "feedback": "Candidate's experience aligns well with requirements"
//   },
//   "skillsAnalysis": {
//     "matchedRequiredSkills": ["React", "Node.js"],
//     "missingRequiredSkills": ["AWS"],
//     "matchedNiceToHaveSkills": ["Docker"],
//     "additionalRelevantSkills": ["TypeScript"],
//     "skillMatchScore": 75
//   },
//   "strengths": [
//     "Strong technical background",
//     "Relevant project experience"
//   ],
//   "gaps": [
//     "Limited cloud experience"
//   ],
//   "recommendations": [
//     "Consider AWS certification"
//   ],
//   "keyHighlights": [
//     "Led successful project migration"
//   ],
//   "summaryFeedback": "Strong candidate with good technical alignment."
// }

// SCORING GUIDELINES:
// - Match Percentage: Based on skills (50%), experience (30%), overall fit (20%)
// - Be honest and objective
// - Extract actual information from the resume
// `;

//     try {
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();

//         console.log('Raw Gemini Response:', text.substring(0, 200) + '...'); // Debug log

//         // Clean the response - remove markdown code blocks if present
//         let cleanedText = text.trim();
//         cleanedText = cleanedText.replace(/```json\s*/g, '');
//         cleanedText = cleanedText.replace(/```\s*/g, '');
//         cleanedText = cleanedText.trim();

//         // Parse JSON
//         const analysisData = JSON.parse(cleanedText);

//         // Validate required fields
//         if (!analysisData.matchPercentage || !analysisData.overallFit) {
//             throw new Error('Invalid response format from Gemini');
//         }

//         return analysisData;

//     } catch (error) {
//         console.error('Gemini API Error:', error);

//         if (error.message.includes('404')) {
//             throw new Error('Model not found. Please check API key permissions');
//         } else if (error.message.includes('API key')) {
//             throw new Error('Invalid API key. Please check your GEMINI_API_KEY');
//         } else if (error instanceof SyntaxError) {
//             throw new Error('Failed to parse AI response. Please try again.');
//         } else {
//             throw new Error(`AI analysis failed: ${error.message}`);
//         }
//     }
// }

// async function generateJobDescription(title, skills, experience) {
//     const prompt = `
// Write a professional and concise job description (max 200 words) for a "${title}" position.

// Context:
// - Experience Level: ${experience}
// - Key Skills Required: ${Array.isArray(skills) ? skills.join(', ') : skills}

// Structure:
// - Brief Role Summary
// - Key Responsibilities (bullet points)
// - Technical Stack requirements

// Tone: Professional, engaging, and inclusive.
// Return ONLY the raw text description, no markdown headers or extra formatting.
// `;

//     try {
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         return response.text();
//     } catch (error) {
//         console.error('Gemini Generation Error:', error);
//         throw new Error('Failed to generate description');
//     }
// }

// // --- 3. Route Handlers ---

// router.post('/analyze', upload.single('resume'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No resume file uploaded' });
//         }

//         // 1. Extract job details
//         const { jobTitle, jobDescription, requiredSkills, niceToHaveSkills, experienceLevel } = req.body;

//         if (!jobTitle || !jobDescription || !requiredSkills) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: jobTitle, jobDescription, or requiredSkills'
//             });
//         }

//         // 2. Extract text from buffer
//         const fileBuffer = req.file.buffer;
//         const fileType = req.file.mimetype;
//         let resumeText = '';

//         try {
//             if (fileType === 'application/pdf') {
//                 const pdfData = await pdfParse(fileBuffer);
//                 resumeText = pdfData.text;
//             } else if (fileType.includes('word') || fileType.includes('officedocument')) {
//                 const result = await mammoth.extractRawText({ buffer: fileBuffer });
//                 resumeText = result.value;
//             }
//         } catch (extractError) {
//             console.error('Text extraction error:', extractError);
//             return res.status(400).json({
//                 success: false,
//                 message: 'Failed to extract text from resume. File may be corrupted.'
//             });
//         }

//         if (!resumeText.trim() || resumeText.trim().length < 50) {
//             return res.status(400).json({ success: false, message: 'Resume appears to be empty or too short.' });
//         }

//         // 3. Parse skills if they're strings
//         let skillsArray = requiredSkills;
//         let niceToHaveArray = niceToHaveSkills;

//         if (typeof requiredSkills === 'string') {
//             skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s);
//         }
//         if (typeof niceToHaveSkills === 'string') {
//             niceToHaveArray = niceToHaveSkills.split(',').map(s => s.trim()).filter(s => s);
//         }

//         // 4. Analyze with Gemini
//         const analysisResult = await analyzeWithGemini(resumeText, {
//             jobTitle,
//             jobDescription,
//             requiredSkills: skillsArray,
//             niceToHaveSkills: niceToHaveArray,
//             experienceLevel: experienceLevel || 'Not specified'
//         });

//         // 5. Send Response & Cleanup
//         res.json({
//             success: true,
//             data: analysisResult,
//             message: 'Resume analyzed successfully. Data has been deleted.'
//         });

//     } catch (error) {
//         console.error('Resume Analysis Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Analysis failed',
//             error: error.message
//         });
//     }
// });

// router.post('/generate-description', async (req, res) => {
//     try {
//         const { jobTitle, requiredSkills, experienceLevel } = req.body;

//         if (!jobTitle || !requiredSkills) {
//             return res.status(400).json({ success: false, message: 'Job Title and Skills are required' });
//         }

//         const description = await generateJobDescription(jobTitle, requiredSkills, experienceLevel);

//         res.json({ success: true, description });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Generation failed', error: error.message });
//     }
// });

// // Test endpoint
// router.get('/test-gemini', async (req, res) => {
//     try {
//         const result = await model.generateContent('Say "API is working" in JSON format');
//         const response = await result.response;

//         res.json({
//             success: true,
//             message: 'Gemini API is working correctly',
//             model: 'gemini-1.5-pro',
//             response: response.text()
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Gemini API test failed',
//             error: error.message
//         });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// --- 1. Configuration & Security ---

// Configure Multer for MEMORY STORAGE (Critical for privacy)
// Files are held in RAM only and never written to disk.
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'), false);
        }
    }
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED: Use models that are ACTUALLY AVAILABLE in your API key
// Based on your API test, these models are available:
// - gemini-2.5-flash (NEWEST, FASTEST - RECOMMENDED)
// - gemini-2.0-flash (FAST)
// - gemini-flash-latest (Always uses latest flash model)
// - gemini-2.5-pro (BEST QUALITY, SLOWER)

const MODEL_NAME = 'gemini-2.5-flash'; // RECOMMENDED: Newest and fastest

// --- 2. Helper Functions ---

async function analyzeWithGemini(resumeText, jobDetails) {
    // Create model instance
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are an expert ATS (Applicant Tracking System) and resume analyzer. 

ANALYZE this resume against the job requirements and provide a detailed match analysis.

JOB DETAILS:
- Job Title: ${jobDetails.jobTitle}
- Experience Level Required: ${jobDetails.experienceLevel}
- Job Description: ${jobDetails.jobDescription}
- Required Skills: ${Array.isArray(jobDetails.requiredSkills) ? jobDetails.requiredSkills.join(', ') : jobDetails.requiredSkills}
- Nice-to-Have Skills: ${jobDetails.niceToHaveSkills ? (Array.isArray(jobDetails.niceToHaveSkills) ? jobDetails.niceToHaveSkills.join(', ') : jobDetails.niceToHaveSkills) : 'None'}

RESUME TEXT:
${resumeText}

PROVIDE YOUR ANALYSIS IN THE FOLLOWING JSON FORMAT ONLY (no markdown, no extra text):

{
  "candidateName": "extracted name or Unknown",
  "candidateEmail": "extracted email or Not found",
  "candidatePhone": "extracted phone or Not found",
  "matchPercentage": 85,
  "overallFit": "Excellent Match",
  "experienceYears": "5 years",
  "experienceMatch": {
    "score": 90,
    "feedback": "Candidate's experience aligns well with requirements"
  },
  "skillsAnalysis": {
    "matchedRequiredSkills": ["React", "Node.js"],
    "missingRequiredSkills": ["AWS"],
    "matchedNiceToHaveSkills": ["Docker"],
    "additionalRelevantSkills": ["TypeScript"],
    "skillMatchScore": 75
  },
  "strengths": [
    "Strong technical background",
    "Relevant project experience"
  ],
  "gaps": [
    "Limited cloud experience"
  ],
  "recommendations": [
    "Consider AWS certification"
  ],
  "keyHighlights": [
    "Led successful project migration"
  ],
  "summaryFeedback": "Strong candidate with good technical alignment."
}

SCORING GUIDELINES:
- Match Percentage: Based on skills (50%), experience (30%), overall fit (20%)
- Be honest and objective
- Extract actual information from the resume
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✓ Gemini Response received, length:', text.length);

        // Clean the response - remove markdown code blocks if present
        let cleanedText = text.trim();
        cleanedText = cleanedText.replace(/```json\s*/g, '');
        cleanedText = cleanedText.replace(/```\s*/g, '');
        cleanedText = cleanedText.trim();

        // Parse JSON
        const analysisData = JSON.parse(cleanedText);

        // Validate required fields
        if (!analysisData.matchPercentage || !analysisData.overallFit) {
            throw new Error('Invalid response format from Gemini');
        }

        return analysisData;

    } catch (error) {
        console.error('Gemini API Error:', error);

        if (error.message.includes('404')) {
            throw new Error('Model not found. Please check model name.');
        } else if (error.message.includes('API key')) {
            throw new Error('Invalid API key. Please check your GEMINI_API_KEY');
        } else if (error instanceof SyntaxError) {
            console.error('Failed to parse JSON. Raw response:', error);
            throw new Error('Failed to parse AI response. Please try again.');
        } else {
            throw new Error(`AI analysis failed: ${error.message}`);
        }
    }
}

async function generateJobDescription(title, skills, experience) {
    // Create model instance
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
Write a professional and concise job description (max 200 words) for a "${title}" position.

Context:
- Experience Level: ${experience}
- Key Skills Required: ${Array.isArray(skills) ? skills.join(', ') : skills}

Structure:
- Brief Role Summary
- Key Responsibilities (bullet points)
- Technical Stack requirements

Tone: Professional, engaging, and inclusive.
Return ONLY the raw text description, no markdown headers or extra formatting.
`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini Generation Error:', error);
        throw new Error(`Failed to generate description: ${error.message}`);
    }
}

// --- 3. Route Handlers ---

router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No resume file uploaded' });
        }

        // 1. Extract job details
        const { jobTitle, jobDescription, requiredSkills, niceToHaveSkills, experienceLevel } = req.body;

        if (!jobTitle || !jobDescription || !requiredSkills) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: jobTitle, jobDescription, or requiredSkills'
            });
        }

        console.log('\n📄 Processing resume for:', jobTitle);

        // 2. Extract text from buffer
        const fileBuffer = req.file.buffer;
        const fileType = req.file.mimetype;
        let resumeText = '';

        try {
            if (fileType === 'application/pdf') {
                console.log('  ↳ Extracting text from PDF...');
                const pdfData = await pdfParse(fileBuffer);
                resumeText = pdfData.text;
            } else if (fileType.includes('word') || fileType.includes('officedocument')) {
                console.log('  ↳ Extracting text from Word document...');
                const result = await mammoth.extractRawText({ buffer: fileBuffer });
                resumeText = result.value;
            }
        } catch (extractError) {
            console.error('Text extraction error:', extractError);
            return res.status(400).json({
                success: false,
                message: 'Failed to extract text from resume. File may be corrupted.'
            });
        }

        if (!resumeText.trim() || resumeText.trim().length < 50) {
            return res.status(400).json({ success: false, message: 'Resume appears to be empty or too short.' });
        }

        console.log('  ✓ Text extracted, length:', resumeText.length, 'characters');

        // 3. Parse skills if they're strings
        let skillsArray = requiredSkills;
        let niceToHaveArray = niceToHaveSkills;

        if (typeof requiredSkills === 'string') {
            skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(s => s);
        }
        if (typeof niceToHaveSkills === 'string') {
            niceToHaveArray = niceToHaveSkills.split(',').map(s => s.trim()).filter(s => s);
        }

        console.log('  ↳ Analyzing with Gemini AI...');

        // 4. Analyze with Gemini
        const analysisResult = await analyzeWithGemini(resumeText, {
            jobTitle,
            jobDescription,
            requiredSkills: skillsArray,
            niceToHaveSkills: niceToHaveArray,
            experienceLevel: experienceLevel || 'Not specified'
        });

        console.log('  ✅ Analysis complete! Match:', analysisResult.matchPercentage + '%\n');

        // 5. Send Response & Cleanup
        res.json({
            success: true,
            data: analysisResult,
            message: 'Resume analyzed successfully. Data has been deleted.'
        });

        // Buffer is automatically garbage collected - no manual cleanup needed

    } catch (error) {
        console.error('❌ Resume Analysis Error:', error);
        res.status(500).json({
            success: false,
            message: 'Analysis failed',
            error: error.message
        });
    }
});

router.post('/generate-description', async (req, res) => {
    try {
        const { jobTitle, requiredSkills, experienceLevel } = req.body;

        if (!jobTitle || !requiredSkills) {
            return res.status(400).json({ success: false, message: 'Job Title and Skills are required' });
        }

        console.log('📝 Generating job description for:', jobTitle);

        const description = await generateJobDescription(jobTitle, requiredSkills, experienceLevel || 'Not specified');

        console.log('  ✅ Job description generated\n');

        res.json({ success: true, description });
    } catch (error) {
        console.error('❌ Generation Error:', error);
        res.status(500).json({ success: false, message: 'Generation failed', error: error.message });
    }
});

// Test endpoint
router.get('/test-gemini', async (req, res) => {
    try {
        console.log('🧪 Testing Gemini API connection...');
        const testModel = genAI.getGenerativeModel({ model: MODEL_NAME });
        const result = await testModel.generateContent('Say "API is working" in JSON format');
        const response = await result.response;

        console.log('  ✅ Gemini API test successful\n');

        res.json({
            success: true,
            message: 'Gemini API is working correctly',
            model: MODEL_NAME,
            response: response.text()
        });
    } catch (error) {
        console.error('❌ Gemini API test failed:', error);
        res.status(500).json({
            success: false,
            message: 'Gemini API test failed',
            error: error.message,
            model: MODEL_NAME
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Resume Parser API is running',
        model: MODEL_NAME,
        features: {
            privacyFirst: 'Files processed in memory only, never stored',
            aiPowered: 'Google Gemini AI for intelligent matching',
            formats: 'PDF, DOC, DOCX'
        },
        endpoints: {
            analyze: 'POST /api/resume/analyze',
            generateDescription: 'POST /api/resume/generate-description',
            test: 'GET /api/resume/test-gemini',
            health: 'GET /api/resume/health'
        }
    });
});

module.exports = router;