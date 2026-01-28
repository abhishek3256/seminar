const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Interview', 'Rejected', 'Hired'], default: 'Applied' },
    appliedAt: { type: Date, default: Date.now },
    aiScore: { type: Number, default: 0 }, // For AI sorting later
    notes: { type: String }
});

module.exports = mongoose.model('Application', applicationSchema);
