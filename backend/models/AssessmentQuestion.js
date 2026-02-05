const mongoose = require('mongoose');

const assessmentQuestionSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },

    // Question Details
    question: { type: String, required: true },
    type: {
        type: String,
        enum: ['MCQ', 'True/False', 'Coding', 'Subjective'],
        default: 'MCQ'
    },

    // For MCQ/True-False
    options: [String],
    correctAnswer: String,

    // For Coding
    codingDetails: {
        language: String,
        starterCode: String,
        testCases: [{
            input: String,
            expectedOutput: String
        }],
        difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
    },

    // Categorization
    topic: String,
    skillTested: String,
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },

    // AI Generated
    aiGenerated: { type: Boolean, default: false },
    generatedAt: Date,

    // Usage Stats
    timesUsed: { type: Number, default: 0 },
    averageScore: Number

}, { timestamps: true });

assessmentQuestionSchema.index({ jobId: 1, skillTested: 1 });

module.exports = mongoose.model('AssessmentQuestion', assessmentQuestionSchema);
