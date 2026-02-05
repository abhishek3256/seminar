const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['Quantitative', 'Logical', 'Verbal', 'Technical', 'Domain-Specific']
    },
    subcategory: {
        type: String, // e.g., "Software Development", "Data Science"
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number, // Index of correct option
            required: true
        },
        explanation: String,
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium'
        }
    }],
    timeLimit: {
        type: Number, // in minutes
        default: 30
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
