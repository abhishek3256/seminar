// const User = require('../models/User');
// const Student = require('../models/Student');
// const Company = require('../models/Company');
// const Job = require('../models/Job');
// const Application = require('../models/Application');

// const Application = require('../models/Application');
// exports.getPlatformStats = async (req, res) => {
//     try {
//         const totalStudents = await Student.countDocuments();
//         const totalCompanies = await Company.countDocuments();
//         const totalJobs = await Job.countDocuments();
//         const totalApplications = await Application.countDocuments();

//         // Additional stats
//         const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
//         const verifiedCompanies = await Company.countDocuments({ isVerified: true });

//         res.json({
//             success: true,
//             data: {
//                 users: { students: totalStudents, companies: totalCompanies },
//                 jobs: { total: totalJobs, active: await Job.countDocuments({ isActive: true }) },
//                 applications: { total: totalApplications },
//                 outcomes: { placed: placedStudents, verifiedCompanies }
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.getAllUsers = async (req, res) => {
//     try {
//         const { role, status } = req.query;
//         let query = {};
//         if (role) query.role = role;
//         if (status) query.isActive = status === 'active';

//         const users = await User.find(query).select('-password').sort({ createdAt: -1 });
//         res.json({ success: true, count: users.length, data: users });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.updateUserStatus = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const { isActive } = req.body;

//         const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
//         if (!user) return res.status(404).json({ success: false, message: 'User not found' });

//         res.json({ success: true, message: `User ${isActive ? 'activated' : 'deactivated'}`, data: user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.verifyCompany = async (req, res) => {
//     try {
//         const { companyId } = req.params; // companyId here refers to the Company Model _id, not User _id
//         const { isVerified } = req.body;

//         const company = await Company.findByIdAndUpdate(
//             companyId,
//             { isVerified },
//             { new: true }
//         );

//         if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

//         res.json({ success: true, message: `Company ${isVerified ? 'verified' : 'unverified'}`, data: company });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.getAllCompanies = async (req, res) => {
//     try {
//         const companies = await Company.find().populate('userId', 'email isActive');
//         res.json({ success: true, count: companies.length, data: companies });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.getAllJobs = async (req, res) => {
//     try {
//         const jobs = await Job.find()
//             .populate('companyId', 'companyName')
//             .sort({ createdAt: -1 });
//         res.json({ success: true, count: jobs.length, data: jobs });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.deleteJob = async (req, res) => {
//     try {
//         const job = await Job.findByIdAndDelete(req.params.jobId);
//         if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//         // Update company stats
//         await Company.updateOne({ _id: job.companyId }, {
//             $pull: { jobsPosted: job._id },
//             $inc: { activeJobs: -1 }
//         });

//         res.json({ success: true, message: 'Job deleted by admin' });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// }


const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get Platform Statistics
exports.getPlatformStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Additional stats
        const placedStudents = await Student.countDocuments({ placementStatus: 'Placed' });
        const verifiedCompanies = await Company.countDocuments({ isVerified: true });
        const activeJobs = await Job.countDocuments({ isActive: true });

        res.json({
            success: true,
            data: {
                users: { 
                    students: totalStudents, 
                    companies: totalCompanies 
                },
                jobs: { 
                    total: totalJobs, 
                    active: activeJobs 
                },
                applications: { 
                    total: totalApplications 
                },
                outcomes: { 
                    placed: placedStudents, 
                    verifiedCompanies 
                }
            }
        });
    } catch (error) {
        console.error('Get Platform Stats Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch platform statistics',
            error: error.message 
        });
    }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const { role, status } = req.query;
        let query = {};
        
        if (role) query.role = role;
        if (status) query.isActive = status === 'active';

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });
            
        res.json({ 
            success: true, 
            count: users.length, 
            data: users 
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch users',
            error: error.message 
        });
    }
};

// Update User Status (Activate/Deactivate)
exports.updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isActive must be a boolean value'
            });
        }

        const user = await User.findByIdAndUpdate(
            userId, 
            { isActive }, 
            { new: true, select: '-password' }
        );
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.json({ 
            success: true, 
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, 
            data: user 
        });
    } catch (error) {
        console.error('Update User Status Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update user status',
            error: error.message 
        });
    }
};

// Verify/Unverify Company
exports.verifyCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { isVerified } = req.body;

        if (typeof isVerified !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'isVerified must be a boolean value'
            });
        }

        const company = await Company.findByIdAndUpdate(
            companyId,
            { isVerified },
            { new: true }
        ).populate('userId', 'email isActive');

        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        res.json({ 
            success: true, 
            message: `Company ${isVerified ? 'verified' : 'unverified'} successfully`, 
            data: company 
        });
    } catch (error) {
        console.error('Verify Company Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify company',
            error: error.message 
        });
    }
};

// Get All Companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('userId', 'email isActive')
            .sort({ createdAt: -1 });
            
        res.json({ 
            success: true, 
            count: companies.length, 
            data: companies 
        });
    } catch (error) {
        console.error('Get All Companies Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch companies',
            error: error.message 
        });
    }
};

// Get All Students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('userId', 'email isActive')
            .sort({ createdAt: -1 });
            
        res.json({ 
            success: true, 
            count: students.length, 
            data: students 
        });
    } catch (error) {
        console.error('Get All Students Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch students',
            error: error.message 
        });
    }
};

// Get All Jobs
exports.getAllJobs = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status === 'active') {
            query.isActive = true;
        } else if (status === 'inactive') {
            query.isActive = false;
        }

        const jobs = await Job.find(query)
            .populate('companyId', 'companyName logo')
            .sort({ createdAt: -1 });
            
        res.json({ 
            success: true, 
            count: jobs.length, 
            data: jobs 
        });
    } catch (error) {
        console.error('Get All Jobs Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch jobs',
            error: error.message 
        });
    }
};

// Delete Job (Admin can delete any job)
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);
        
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found' 
            });
        }

        // Delete the job
        await Job.findByIdAndDelete(jobId);

        // Update company stats
        await Company.updateOne(
            { _id: job.companyId }, 
            {
                $pull: { jobsPosted: job._id },
                $inc: { activeJobs: -1 }
            }
        );

        res.json({ 
            success: true, 
            message: 'Job deleted successfully by admin' 
        });
    } catch (error) {
        console.error('Delete Job Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete job',
            error: error.message 
        });
    }
};

// Get All Applications
exports.getAllApplications = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .populate('studentId', 'fullName email phone')
            .populate('jobId', 'title jobType')
            .populate('companyId', 'companyName logo')
            .sort({ appliedAt: -1 });
            
        res.json({ 
            success: true, 
            count: applications.length, 
            data: applications 
        });
    } catch (error) {
        console.error('Get All Applications Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch applications',
            error: error.message 
        });
    }
};

module.exports = exports;