const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    // Company Information
    companyName: { type: String, required: true, unique: true },
    companyEmail: { type: String, required: true },
    website: String,
    logo: String,

    // Contact Details
    hrName: String,
    hrEmail: String,
    hrPhone: String,

    // Company Details
    industry: String,
    companySize: { type: String, enum: ['1-50', '51-200', '201-500', '501-1000', '1000+'] },
    headquartersLocation: String,
    about: { type: String, maxlength: 2000 },

    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{
        type: String,
        url: String,
        uploadedAt: Date
    }],

    // Jobs Posted
    jobsPosted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],

    // Statistics
    totalHires: { type: Number, default: 0 },
    activeJobs: { type: Number, default: 0 },

}, { timestamps: true });



module.exports = mongoose.model('Company', companySchema);
