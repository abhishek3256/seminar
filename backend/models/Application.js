const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

    // Application Details
    appliedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: [
            'Submitted',
            'Under Review',
            'Shortlisted',
            'Assessment Scheduled',
            'Assessment Completed',
            'Technical Interview Scheduled',
            'Technical Interview Completed',
            'AI Interview Scheduled',
            'AI Interview Completed',
            'Managerial Round Scheduled',
            'Managerial Round Completed',
            'HR Round Scheduled',
            'HR Round Completed',
            'Offer Extended',
            'Offer Accepted',
            'Offer Rejected',
            'Rejected'
        ],
        default: 'Submitted'
    },

    // Resume submitted for this application
    resumeSnapshot: {
        url: String,
        parsedSkills: [String],
        matchScore: Number
    },

    // Cover Letter
    coverLetter: {
        text: String,
        aiGenerated: Boolean,
        generatedAt: Date
    },

    // Assessment
    assessment: {
        scheduled: Boolean,
        scheduledFor: Date,
        completed: Boolean,
        completedAt: Date,
        score: Number,
        totalQuestions: Number,
        correctAnswers: Number,
        timeSpent: Number, // in minutes
        questions: [{
            question: String,
            options: [String],
            correctAnswer: String,
            studentAnswer: String,
            isCorrect: Boolean
        }],
        proctoring: {
            violations: [{
                type: String,
                timestamp: Date,
                severity: String
            }],
            totalViolations: Number
        }
    },

    // AI Proctored Interview
    aiInterview: {
        scheduled: Boolean,
        scheduledFor: Date,
        completed: Boolean,
        completedAt: Date,
        overallScore: Number,
        questions: [{
            question: String,
            studentAnswer: String,
            aiEvaluation: {
                score: Number,
                strengths: [String],
                improvements: [String],
                feedback: String
            }
        }],
        videoRecording: String, // URL to recorded interview
        proctoring: {
            emotionAnalysis: Object,
            eyeContactScore: Number,
            confidenceScore: Number
        }
    },

    // Managerial Round
    managerialRound: {
        scheduled: Boolean,
        scheduledFor: Date,
        completed: Boolean,
        completedAt: Date,
        interviewerName: String,
        feedback: String,
        rating: Number,
        recommendation: { type: String, enum: ['Strong Yes', 'Yes', 'Maybe', 'No', 'Strong No'] }
    },

    // HR Round
    hrRound: {
        scheduled: Boolean,
        scheduledFor: Date,
        completed: Boolean,
        completedAt: Date,
        hrName: String,
        feedback: String,
        salaryNegotiation: {
            expectedSalary: Number,
            offeredSalary: Number,
            finalSalary: Number
        }
    },

    // Offer Letter
    offerLetter: {
        generated: Boolean,
        generatedAt: Date,
        url: String,
        details: {
            position: String,
            salary: Number,
            joiningDate: Date,
            location: String,
            bond: {
                required: Boolean,
                duration: Number // in months
            }
        },
        accepted: Boolean,
        acceptedAt: Date
    },

    // Timeline
    timeline: [{
        stage: String,
        status: String,
        timestamp: Date,
        notes: String
    }],

    // Rejection details
    rejectionReason: String,
    rejectedAt: Date,
    rejectedBy: { type: String, enum: ['System', 'Company', 'Student'] }

}, { timestamps: true });

// Compound index for unique application per student per job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ status: 1, appliedAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
