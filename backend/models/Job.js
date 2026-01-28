const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    location: { type: String },
    type: { type: String, enum: ['Full-time', 'Internship', 'Part-time'], default: 'Full-time' },
    salaryRange: { type: String }, // e.g., "12 LPA - 18 LPA"
    postedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Open', 'Closed'], default: 'Open' }
});

module.exports = mongoose.model('Job', jobSchema);
