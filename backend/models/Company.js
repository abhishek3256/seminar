const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    industry: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
    logoConfig: { type: String }, // Placeholder for logo generation config or URL
});

module.exports = mongoose.model('Company', companySchema);
