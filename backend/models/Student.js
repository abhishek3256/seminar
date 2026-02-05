const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Personal Information
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    profileImage: String,

    // Academic Information
    rollNumber: { type: String, unique: true, sparse: true },
    branch: String,
    semester: Number,
    currentCGPA: { type: Number, min: 0, max: 10 },

    // 10th Details
    tenth: {
        board: String,
        yearOfPassing: Number,
        percentage: { type: Number, min: 0, max: 100 },
        certificate: String, // PDF URL
        verified: { type: Boolean, default: false },
        verificationDetails: {
            verifiedBy: String, // AI or Admin
            verifiedAt: Date,
            extractedData: Object
        }
    },

    // 12th Details
    twelfth: {
        board: String,
        yearOfPassing: Number,
        percentage: { type: Number, min: 0, max: 100 },
        stream: String,
        certificate: String, // PDF URL
        verified: { type: Boolean, default: false },
        verificationDetails: {
            verifiedBy: String,
            verifiedAt: Date,
            extractedData: Object
        }
    },

    // Skills & Experience
    skills: [String],
    technicalSkills: [{
        name: String,
        proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
    }],
    certifications: [{
        name: String,
        issuer: String,
        dateObtained: Date,
        certificateUrl: String
    }],
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        role: String,
        duration: String,
        projectUrl: String
    }],
    experience: [{
        company: String,
        position: String,
        duration: String,
        description: String,
        type: { type: String, enum: ['Internship', 'Full-time', 'Part-time', 'Freelance'] }
    }],

    // Resume
    resume: {
        url: String,
        uploadedAt: Date,
        parsedData: {
            extractedSkills: [String],
            extractedExperience: [String],
            extractedEducation: Object,
            extractedProjects: [Object],
            contactInfo: Object,
            summary: String
        },
        aiAnalysis: {
            score: Number,
            strengths: [String],
            improvements: [String],
            analyzedAt: Date
        }
    },

    // Placement Status
    placementStatus: {
        type: String,
        enum: ['Not Applied', 'Applied', 'Shortlisted', 'Interview Scheduled', 'Offered', 'Placed', 'Rejected'],
        default: 'Not Applied'
    },
    placedCompany: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    offerLetter: {
        url: String,
        generatedAt: Date,
        salary: Number,
        joiningDate: Date
    },

    // Applications tracking
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }]

}, { timestamps: true });

studentSchema.index({ 'skills': 1 });
studentSchema.index({ currentCGPA: -1 });

module.exports = mongoose.model('Student', studentSchema);
