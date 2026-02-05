const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get Platform Stats
exports.getPlatformStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Additional stats
        const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
        const verifiedCompanies = await Company.countDocuments({ isVerified: true });

        res.json({
            success: true,
            data: {
                users: { students: totalStudents, companies: totalCompanies },
                jobs: { total: totalJobs, active: await Job.countDocuments({ isActive: true }) },
                applications: { total: totalApplications },
                outcomes: { placed: placedStudents, verifiedCompanies }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Users (with filter)
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status } = req.query;
        let query = {};
        if (role) query.role = role;
        if (status) query.isActive = status === 'active';

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update User Status (Block/Unblock)
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}`, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Verify Company
exports.verifyCompany = async (req, res) => {
    try {
        const { companyId } = req.params; // companyId here refers to the Company Model _id, not User _id
        const { isVerified } = req.body;

        const company = await Company.findByIdAndUpdate(
            companyId,
            { isVerified },
            { new: true }
        );

        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        res.json({ success: true, message: `Company ${isVerified ? 'verified' : 'unverified'}`, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Companies (for verification)
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find().populate('userId', 'email isActive');
        res.json({ success: true, count: companies.length, data: companies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Jobs (for moderation)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('companyId', 'companyName')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Job (Admin override)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Update company stats
        await Company.updateOne({ _id: job.companyId }, {
            $pull: { jobsPosted: job._id },
            $inc: { activeJobs: -1 }
        });

        res.json({ success: true, message: 'Job deleted by admin' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
