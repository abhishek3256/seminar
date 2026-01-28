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
});

module.exports = mongoose.model('Student', studentSchema);
