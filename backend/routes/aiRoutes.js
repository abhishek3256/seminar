const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const geminiService = require('../services/geminiService');
const Job = require('../models/Job');
const Student = require('../models/Student');
const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');

// ==========================================
// JOB RECOMMENDATIONS
// ==========================================

/**
 * @route   POST /api/ai/job-recommendations
 * @desc    Get AI-powered job recommendations for a student
 * @access  Private (Student only)
 */
router.post('/job-recommendations', protect, async (req, res) => {
    try {
        // Get current user
        const user = await User.findById(req.user.id);
        if (user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can get job recommendations' });
        }

        // Get student profile
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        // Get all available jobs
        const jobs = await Job.find({ status: 'active' })
            .populate('company', 'name industry location')
            .lean();

        if (jobs.length === 0) {
            return res.json({
                success: true,
                recommendations: [],
                message: 'No jobs available at the moment'
            });
        }

        // Prepare student profile for AI
        const studentProfile = {
            name: user.name,
            email: user.email,
            skills: student.skills || [],
            gpa: student.cgpa,
            experience: student.experience || 'Fresher',
            interests: student.interests || [],
            preferences: student.preferences || {}
        };

        // Generate recommendations using AI
        const recommendations = await geminiService.generateJobRecommendations(studentProfile, jobs);

        // Enrich recommendations with full job details
        const enrichedRecommendations = recommendations.map(rec => {
            const job = jobs.find(j => j._id.toString() === rec.jobId);
            return {
                ...rec,
                job: job || null
            };
        }).filter(rec => rec.job !== null); // Remove recommendations for jobs that don't exist

        res.json({
            success: true,
            recommendations: enrichedRecommendations,
            totalJobs: jobs.length
        });

    } catch (error) {
        console.error('Error generating job recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate job recommendations',
            error: error.message
        });
    }
});

// ==========================================
// INTERVIEW PREPARATION
// ==========================================

/**
 * @route   POST /api/ai/interview/start-session
 * @desc    Start a new interview practice session
 * @access  Private
 */
router.post('/interview/start-session', protect, async (req, res) => {
    try {
        const { jobRole, companyType, difficulty, questionCount } = req.body;

        if (!jobRole) {
            return res.status(400).json({ message: 'Job role is required' });
        }

        // Generate interview questions
        const questions = await geminiService.generateInterviewQuestions(
            jobRole,
            companyType || 'Technology',
            difficulty || 'medium',
            questionCount || 5
        );

        // Create new interview session
        const session = new InterviewSession({
            student: req.user.id,
            jobRole,
            companyType: companyType || 'Technology',
            difficulty: difficulty || 'medium',
            questions: questions.map(q => ({
                question: q.question,
                type: q.type,
                expectedAnswer: q.expectedAnswer
            })),
            status: 'in-progress'
        });

        await session.save();

        res.json({
            success: true,
            session: {
                id: session._id,
                jobRole: session.jobRole,
                difficulty: session.difficulty,
                totalQuestions: session.questions.length,
                questions: session.questions.map(q => ({
                    _id: q._id,
                    question: q.question,
                    type: q.type
                }))
            }
        });

    } catch (error) {
        console.error('Error starting interview session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start interview session',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ai/interview/submit-answer
 * @desc    Submit an answer and get AI evaluation
 * @access  Private
 */
router.post('/interview/submit-answer', protect, async (req, res) => {
    try {
        const { sessionId, questionId, answer } = req.body;

        if (!sessionId || !questionId || !answer) {
            return res.status(400).json({ message: 'Session ID, question ID, and answer are required' });
        }

        // Find session
        const session = await InterviewSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: 'Interview session not found' });
        }

        // Verify session belongs to user
        if (session.student.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to this session' });
        }

        // Find question in session
        const question = session.questions.id(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found in session' });
        }

        // Evaluate answer using AI
        const evaluation = await geminiService.evaluateAnswer(
            question.question,
            answer,
            question.expectedAnswer
        );

        // Update question with answer and evaluation
        question.studentAnswer = answer;
        question.score = evaluation.score;
        question.feedback = evaluation.feedback;
        question.strengths = evaluation.strengths;
        question.improvements = evaluation.improvements;
        question.answeredAt = new Date();

        // Check if all questions are answered
        const allAnswered = session.questions.every(q => q.studentAnswer);
        if (allAnswered) {
            session.status = 'completed';
            session.overallScore = session.calculateOverallScore();
            session.completedAt = new Date();
        }

        await session.save();

        res.json({
            success: true,
            evaluation: {
                score: evaluation.score,
                feedback: evaluation.feedback,
                strengths: evaluation.strengths,
                improvements: evaluation.improvements,
                overallAssessment: evaluation.overallAssessment
            },
            sessionComplete: allAnswered,
            overallScore: allAnswered ? session.overallScore : null
        });

    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to evaluate answer',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/ai/interview/history
 * @desc    Get interview practice history
 * @access  Private
 */
router.get('/interview/history', protect, async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ student: req.user.id })
            .sort({ createdAt: -1 })
            .select('-questions.expectedAnswer') // Don't send expected answers
            .lean();

        // Calculate statistics
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const averageScore = completedSessions.length > 0
            ? Math.round(completedSessions.reduce((sum, s) => sum + s.overallScore, 0) / completedSessions.length)
            : 0;

        res.json({
            success: true,
            sessions,
            statistics: {
                totalSessions: sessions.length,
                completedSessions: completedSessions.length,
                averageScore,
                recentScore: completedSessions.length > 0 ? completedSessions[0].overallScore : null
            }
        });

    } catch (error) {
        console.error('Error fetching interview history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch interview history',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/ai/interview/session/:id
 * @desc    Get details of a specific interview session
 * @access  Private
 */
router.get('/interview/session/:id', protect, async (req, res) => {
    try {
        const session = await InterviewSession.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify session belongs to user
        if (session.student.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized access to this session' });
        }

        res.json({
            success: true,
            session
        });

    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch session',
            error: error.message
        });
    }
});

// ==========================================
// COVER LETTER GENERATOR
// ==========================================

/**
 * @route   POST /api/ai/cover-letter/generate
 * @desc    Generate a cover letter
 * @access  Private
 */
router.post('/cover-letter/generate', protect, async (req, res) => {
    try {
        const { jobId, tone } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Get job details
        const job = await Job.findById(jobId).populate('company');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Get user and student profile
        const user = await User.findById(req.user.id);
        const student = await Student.findOne({ user: req.user.id });

        // Prepare resume data
        const resumeData = {
            name: user.name,
            email: user.email,
            skills: student?.skills || [],
            experience: student?.experience || 'Fresher',
            education: student?.branch || 'Not specified',
            projects: [] // Can be expanded later
        };

        // Prepare job description
        const jobDescription = `
Position: ${job.title}
Company: ${job.company?.name || 'Company'}
Location: ${job.location}
Description: ${job.description}
Requirements: ${job.requirements?.join(', ') || 'Not specified'}
`;

        // Generate cover letter
        const coverLetter = await geminiService.generateCoverLetter(
            resumeData,
            jobDescription,
            tone || 'professional'
        );

        res.json({
            success: true,
            coverLetter,
            jobTitle: job.title,
            companyName: job.company?.name || 'Company'
        });

    } catch (error) {
        console.error('Error generating cover letter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate cover letter',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/ai/cover-letter/refine
 * @desc    Refine an existing cover letter
 * @access  Private
 */
router.post('/cover-letter/refine', protect, async (req, res) => {
    try {
        const { coverLetter, instructions } = req.body;

        if (!coverLetter || !instructions) {
            return res.status(400).json({ message: 'Cover letter and instructions are required' });
        }

        // Refine cover letter
        const refinedLetter = await geminiService.refineCoverLetter(coverLetter, instructions);

        res.json({
            success: true,
            coverLetter: refinedLetter
        });

    } catch (error) {
        console.error('Error refining cover letter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to refine cover letter',
            error: error.message
        });
    }
});

module.exports = router;
