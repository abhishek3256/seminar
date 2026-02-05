const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    companyType: {
        type: String,
        default: 'Technology'
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['technical', 'behavioral', 'situational'],
            required: true
        },
        expectedAnswer: String,
        studentAnswer: String,
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        feedback: String,
        strengths: [String],
        improvements: [String],
        answeredAt: Date
    }],
    overallScore: {
        type: Number,
        min: 0,
        max: 100
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed'],
        default: 'in-progress'
    },
    completedAt: Date
}, {
    timestamps: true
});

// Calculate overall score when session is completed
interviewSessionSchema.methods.calculateOverallScore = function () {
    const answeredQuestions = this.questions.filter(q => q.score !== undefined);
    if (answeredQuestions.length === 0) return 0;

    const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
    return Math.round(totalScore / answeredQuestions.length);
};

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
