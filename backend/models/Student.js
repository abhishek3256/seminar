const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bio: { type: String },
    skills: [{ type: String }],
    cgpa: { type: Number },
    graduationYear: { type: Number },
    resumeLink: { type: String },
    githubLink: { type: String },
    linkedinLink: { type: String },
    branch: { type: String },
    // AI Features - Job Recommendations
    interests: [{ type: String }], // Career interests
    experience: { type: String, default: 'Fresher' }, // Work experience description
    preferences: {
        location: [{ type: String }], // Preferred job locations
        salary: { type: String }, // Expected salary range
        jobType: { type: String, enum: ['Full-time', 'Internship', 'Part-time', 'Contract'], default: 'Full-time' },
        industry: [{ type: String }] // Preferred industries
    }
});

module.exports = mongoose.model('Student', studentSchema);
