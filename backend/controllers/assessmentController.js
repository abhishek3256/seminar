// const AssessmentQuestion = require('../models/AssessmentQuestion');

// // Create Question
// exports.createQuestion = async (req, res) => {
//     try {
//         const question = new AssessmentQuestion(req.body);
//         await question.save();
//         res.status(201).json({ success: true, message: 'Question added', data: question });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Get Questions (with advanced filters)
// exports.getQuestions = async (req, res) => {
//     try {
//         const { skill, difficulty, types } = req.query;
//         let query = {};
//         if (skill) query.skillTested = skill;
//         if (difficulty) query.difficulty = difficulty;
//         if (types) query.type = { $in: types.split(',') };

//         const questions = await AssessmentQuestion.find(query);
//         res.json({ success: true, count: questions.length, data: questions });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // Update Question
// exports.updateQuestion = async (req, res) => {
//     try {
//         const question = await AssessmentQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
//         res.json({ success: true, data: question });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }

// // Delete Question
// exports.deleteQuestion = async (req, res) => {
//     try {
//         const question = await AssessmentQuestion.findByIdAndDelete(req.params.id);
//         if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
//         res.json({ success: true, message: 'Question deleted' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }
const AssessmentQuestion = require('../models/AssessmentQuestion');

// Create Assessment Question
exports.createQuestion = async (req, res) => {
    try {
        const {
            question,
            options,
            correctAnswer,
            skillTested,
            difficulty,
            type,
            explanation
        } = req.body;

        // Validation
        if (!question || !options || !correctAnswer || !skillTested) {
            return res.status(400).json({
                success: false,
                message: 'Question, options, correct answer, and skill tested are required'
            });
        }

        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Options must be an array with at least 2 choices'
            });
        }

        const newQuestion = new AssessmentQuestion({
            question,
            options,
            correctAnswer,
            skillTested,
            difficulty: difficulty || 'Medium',
            type: type || 'MCQ',
            explanation
        });

        await newQuestion.save();

        res.status(201).json({ 
            success: true, 
            message: 'Question added successfully', 
            data: newQuestion 
        });
    } catch (error) {
        console.error('Create Question Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create question',
            error: error.message 
        });
    }
};

// Get All Assessment Questions (with filters)
exports.getQuestions = async (req, res) => {
    try {
        const { skill, difficulty, type } = req.query;
        let query = {};

        // Build query based on filters
        if (skill) {
            query.skillTested = skill;
        }
        
        if (difficulty) {
            query.difficulty = difficulty;
        }
        
        if (type) {
            // Support multiple types comma-separated
            if (type.includes(',')) {
                query.type = { $in: type.split(',') };
            } else {
                query.type = type;
            }
        }

        const questions = await AssessmentQuestion.find(query)
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            count: questions.length, 
            data: questions 
        });
    } catch (error) {
        console.error('Get Questions Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch questions',
            error: error.message 
        });
    }
};

// Get Single Question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await AssessmentQuestion.findById(id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            data: question
        });
    } catch (error) {
        console.error('Get Question By ID Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question',
            error: error.message
        });
    }
};

// Update Assessment Question
exports.updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await AssessmentQuestion.findByIdAndUpdate(
            id, 
            req.body, 
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Question updated successfully',
            data: question 
        });
    } catch (error) {
        console.error('Update Question Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update question',
            error: error.message 
        });
    }
};

// Delete Assessment Question
exports.deleteQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        const question = await AssessmentQuestion.findByIdAndDelete(id);

        if (!question) {
            return res.status(404).json({ 
                success: false, 
                message: 'Question not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Question deleted successfully' 
        });
    } catch (error) {
        console.error('Delete Question Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete question',
            error: error.message 
        });
    }
};

// Get Questions by Skill (for generating assessments)
exports.getQuestionsBySkill = async (req, res) => {
    try {
        const { skills } = req.query; // Comma-separated skills
        const { limit = 10 } = req.query;

        if (!skills) {
            return res.status(400).json({
                success: false,
                message: 'Skills parameter is required'
            });
        }

        const skillArray = skills.split(',').map(s => s.trim());

        const questions = await AssessmentQuestion.find({
            skillTested: { $in: skillArray }
        }).limit(parseInt(limit));

        res.json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Get Questions By Skill Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions',
            error: error.message
        });
    }
};

// Get Random Questions (for generating diverse assessments)
exports.getRandomQuestions = async (req, res) => {
    try {
        const { count = 5, difficulty, skill } = req.query;
        
        let query = {};
        if (difficulty) query.difficulty = difficulty;
        if (skill) query.skillTested = skill;

        const questions = await AssessmentQuestion.aggregate([
            { $match: query },
            { $sample: { size: parseInt(count) } }
        ]);

        res.json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        console.error('Get Random Questions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch random questions',
            error: error.message
        });
    }
};

// Bulk Import Questions
exports.bulkImportQuestions = async (req, res) => {
    try {
        const { questions } = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Questions must be a non-empty array'
            });
        }

        const insertedQuestions = await AssessmentQuestion.insertMany(questions);

        res.status(201).json({
            success: true,
            message: `${insertedQuestions.length} questions imported successfully`,
            data: insertedQuestions
        });
    } catch (error) {
        console.error('Bulk Import Questions Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import questions',
            error: error.message
        });
    }
};

// Get Assessment Statistics
exports.getAssessmentStats = async (req, res) => {
    try {
        const totalQuestions = await AssessmentQuestion.countDocuments();
        
        const byDifficulty = await AssessmentQuestion.aggregate([
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            }
        ]);

        const bySkill = await AssessmentQuestion.aggregate([
            {
                $group: {
                    _id: '$skillTested',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        const byType = await AssessmentQuestion.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                total: totalQuestions,
                byDifficulty,
                bySkill,
                byType
            }
        });
    } catch (error) {
        console.error('Get Assessment Stats Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assessment statistics',
            error: error.message
        });
    }
};

module.exports = exports;