const AssessmentQuestion = require('../models/AssessmentQuestion');

// Create Question
exports.createQuestion = async (req, res) => {
    try {
        const question = new AssessmentQuestion(req.body);
        await question.save();
        res.status(201).json({ success: true, message: 'Question added', data: question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Questions (with advanced filters)
exports.getQuestions = async (req, res) => {
    try {
        const { skill, difficulty, types } = req.query;
        let query = {};
        if (skill) query.skillTested = skill;
        if (difficulty) query.difficulty = difficulty;
        if (types) query.type = { $in: types.split(',') };

        const questions = await AssessmentQuestion.find(query);
        res.json({ success: true, count: questions.length, data: questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Question
exports.updateQuestion = async (req, res) => {
    try {
        const question = await AssessmentQuestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
        res.json({ success: true, data: question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete Question
exports.deleteQuestion = async (req, res) => {
    try {
        const question = await AssessmentQuestion.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });
        res.json({ success: true, message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
