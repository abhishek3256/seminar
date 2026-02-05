const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Try different models - gemini-pro is more widely available
const getModel = () => {
    try {
        // Try gemini-pro first (most compatible)
        return genAI.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
        console.error('Error initializing Gemini model:', error);
        return null;
    }
};

class GeminiService {
    /**
     * Generate job recommendations based on student profile and available jobs
     */
    async generateJobRecommendations(studentProfile, jobs) {
        try {
            const prompt = `
You are an expert career advisor and job matching AI. Analyze the student profile and available jobs to provide personalized recommendations.

STUDENT PROFILE:
- Name: ${studentProfile.name}
- Skills: ${studentProfile.skills?.join(', ') || 'Not specified'}
- GPA: ${studentProfile.gpa || 'Not specified'}
- Experience: ${studentProfile.experience || 'Fresher'}
- Interests: ${studentProfile.interests?.join(', ') || 'Not specified'}
- Preferred Location: ${studentProfile.preferences?.location || 'Any'}
- Preferred Salary: ${studentProfile.preferences?.salary || 'Not specified'}

AVAILABLE JOBS:
${JSON.stringify(jobs.slice(0, 20), null, 2)}

TASK:
1. Analyze each job against the student's profile
2. Calculate a match score (0-100) for each job
3. Provide top 10 recommendations
4. For each recommendation, explain:
   - Why it's a good match
   - Which skills align
   - What skills are missing (if any)
   - Growth potential

Return ONLY a valid JSON array in this exact format:
[
  {
    "jobId": "job_id_here",
    "matchScore": 85,
    "matchReason": "Strong match because...",
    "alignedSkills": ["React", "Node.js"],
    "missingSkills": ["AWS"],
    "growthPotential": "High - opportunity to learn cloud technologies"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            const recommendations = JSON.parse(jsonMatch[0]);
            return recommendations;
        } catch (error) {
            console.error('Error generating job recommendations:', error);
            throw new Error('Failed to generate job recommendations: ' + error.message);
        }
    }

    /**
     * Generate interview questions for a specific role
     */
    async generateInterviewQuestions(jobRole, companyType, difficulty = 'medium', count = 5) {
        try {
            const model = getModel();
            if (!model) {
                // Fallback to mock questions if model unavailable
                return this.getMockInterviewQuestions(jobRole, count);
            }

            const prompt = `
Generate ${count} interview questions for a ${jobRole} position at a ${companyType} company.

Difficulty Level: ${difficulty}
Question Types: Mix of technical, behavioral, and situational questions

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "Question text here",
    "type": "technical|behavioral|situational",
    "difficulty": "easy|medium|hard",
    "expectedAnswer": "Brief outline of what a good answer should cover",
    "evaluationCriteria": ["Criterion 1", "Criterion 2"]
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                console.warn('Invalid AI response, using fallback');
                return this.getMockInterviewQuestions(jobRole, count);
            }

            const questions = JSON.parse(jsonMatch[0]);
            return questions;
        } catch (error) {
            console.error('Error generating interview questions:', error);
            // Return mock questions as fallback
            return this.getMockInterviewQuestions(jobRole, count);
        }
    }

    /**
     * Fallback mock interview questions
     */
    getMockInterviewQuestions(jobRole, count = 5) {
        const mockQuestions = [
            {
                question: `Tell me about your experience with ${jobRole} and why you're interested in this position.`,
                type: "behavioral",
                difficulty: "easy",
                expectedAnswer: "Should discuss relevant experience, passion for the role, and alignment with career goals.",
                evaluationCriteria: ["Clarity", "Relevance", "Enthusiasm"]
            },
            {
                question: `Describe a challenging project you worked on. What was your role and how did you overcome obstacles?`,
                type: "behavioral",
                difficulty: "medium",
                expectedAnswer: "Should use STAR method, demonstrate problem-solving, and show impact.",
                evaluationCriteria: ["Problem-solving", "Communication", "Results"]
            },
            {
                question: `What technical skills do you have that make you a good fit for this ${jobRole} role?`,
                type: "technical",
                difficulty: "medium",
                expectedAnswer: "Should list relevant technical skills with examples of how they've been applied.",
                evaluationCriteria: ["Technical knowledge", "Practical application", "Depth"]
            },
            {
                question: `How do you stay updated with the latest trends and technologies in your field?`,
                type: "behavioral",
                difficulty: "easy",
                expectedAnswer: "Should mention learning resources, communities, projects, and continuous improvement mindset.",
                evaluationCriteria: ["Learning mindset", "Resourcefulness", "Passion"]
            },
            {
                question: `Where do you see yourself in 5 years, and how does this position align with your goals?`,
                type: "behavioral",
                difficulty: "easy",
                expectedAnswer: "Should show career planning, ambition, and how the role fits into their growth path.",
                evaluationCriteria: ["Career planning", "Alignment", "Ambition"]
            }
        ];

        return mockQuestions.slice(0, count);
    }

    /**
     * Evaluate a student's answer to an interview question
     */
    async evaluateAnswer(question, studentAnswer, expectedAnswer) {
        try {
            const prompt = `
You are an expert interview evaluator. Evaluate the student's answer to the interview question.

QUESTION: ${question}

EXPECTED ANSWER OUTLINE: ${expectedAnswer}

STUDENT'S ANSWER: ${studentAnswer}

Provide a comprehensive evaluation in JSON format:
{
  "score": 75,
  "feedback": "Detailed feedback on the answer",
  "strengths": ["Point 1", "Point 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "overallAssessment": "Brief overall assessment"
}

Score should be 0-100 where:
- 90-100: Excellent answer
- 75-89: Good answer
- 60-74: Satisfactory answer
- 40-59: Needs improvement
- 0-39: Poor answer

IMPORTANT: Return ONLY the JSON object, no additional text.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI');
            }

            const evaluation = JSON.parse(jsonMatch[0]);
            return evaluation;
        } catch (error) {
            console.error('Error evaluating answer:', error);
            throw new Error('Failed to evaluate answer: ' + error.message);
        }
    }

    /**
     * Generate a personalized cover letter
     */
    async generateCoverLetter(resumeData, jobDescription, tone = 'professional') {
        try {
            const model = getModel();
            if (!model) {
                // Fallback to template if model unavailable
                return this.getMockCoverLetter(resumeData, jobDescription, tone);
            }

            const prompt = `
Generate a personalized cover letter based on the resume and job description.

RESUME DATA:
- Name: ${resumeData.name}
- Email: ${resumeData.email}
- Skills: ${resumeData.skills?.join(', ')}
- Experience: ${resumeData.experience || 'Fresher'}
- Education: ${resumeData.education}
- Projects: ${JSON.stringify(resumeData.projects || [])}

JOB DESCRIPTION:
${jobDescription}

TONE: ${tone}
(professional = formal and business-like, enthusiastic = energetic and passionate, technical = focus on technical skills)

Generate a compelling cover letter that:
1. Opens with a strong introduction
2. Highlights relevant skills and experiences
3. Shows enthusiasm for the role
4. Demonstrates knowledge of the company
5. Closes with a call to action

Return the cover letter as plain text (not JSON), approximately 300-400 words.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const coverLetter = response.text();

            return coverLetter;
        } catch (error) {
            console.error('Error generating cover letter:', error);
            // Return template as fallback
            return this.getMockCoverLetter(resumeData, jobDescription, tone);
        }
    }

    /**
     * Fallback cover letter template
     */
    getMockCoverLetter(resumeData, jobDescription, tone) {
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        return `${date}

Dear Hiring Manager,

I am writing to express my strong interest in the position described in your job posting. As a ${resumeData.experience || 'motivated candidate'} with skills in ${resumeData.skills?.slice(0, 3).join(', ') || 'various technologies'}, I am excited about the opportunity to contribute to your team.

Throughout my academic and professional journey, I have developed a strong foundation in ${resumeData.education || 'my field'}. My technical expertise includes ${resumeData.skills?.join(', ') || 'modern technologies and best practices'}, which aligns well with the requirements outlined in the job description.

I am particularly drawn to this opportunity because it offers the chance to apply my skills in a dynamic environment while continuing to grow professionally. I am confident that my background and enthusiasm make me a strong candidate for this position.

I would welcome the opportunity to discuss how my qualifications align with your needs. Thank you for considering my application. I look forward to hearing from you soon.

Sincerely,
${resumeData.name}
${resumeData.email}`;
    }

    /**
     * Refine an existing cover letter based on user instructions
     */
    async refineCoverLetter(existingLetter, refinementInstructions) {
        try {
            const prompt = `
Refine the following cover letter based on the user's instructions.

EXISTING COVER LETTER:
${existingLetter}

REFINEMENT INSTRUCTIONS:
${refinementInstructions}

Return the refined cover letter as plain text, maintaining the overall structure but incorporating the requested changes.
`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const refinedLetter = response.text();

            return refinedLetter;
        } catch (error) {
            console.error('Error refining cover letter:', error);
            throw new Error('Failed to refine cover letter: ' + error.message);
        }
    }
}

module.exports = new GeminiService();
