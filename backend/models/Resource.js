const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Resume Templates', 'Study Materials', 'Interview Prep', 'Coding Practice', 'Aptitude', 'Other']
    },
    type: {
        type: String,
        enum: ['PDF', 'Video', 'Link', 'Document', 'Image'],
        required: true
    },
    url: {
        type: String, // File URL or external link
        required: true
    },
    fileSize: String, // e.g., "2.5 MB"
    tags: [String],
    isPublic: {
        type: Boolean,
        default: true
    },
    downloads: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
