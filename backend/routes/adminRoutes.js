const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { protect, authorize } = require('../middleware/auth');

// Apply protect and authorize middleware to all admin routes
router.use(protect);
router.use(authorize('admin'));

// ============================================
// USER MANAGEMENT
// ============================================

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Admin
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const role = req.query.role || '';

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        if (role) {
            query.role = role;
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            users,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalUsers: total
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user details
// @access  Admin
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get associated profile
        let profile = null;
        if (user.role === 'student') {
            profile = await Student.findOne({ user: user._id });
        } else if (user.role === 'company') {
            profile = await Company.findOne({ user: user._id });
        }

        res.json({ user, profile });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user details
// @access  Admin
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        res.json({ message: 'User updated successfully', user: { ...user._doc, password: undefined } });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Admin
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete associated profile
        if (user.role === 'student') {
            await Student.deleteOne({ user: user._id });
        } else if (user.role === 'company') {
            await Company.deleteOne({ user: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ============================================
// JOB MANAGEMENT
// ============================================

// @route   GET /api/admin/jobs
// @desc    Get all jobs
// @access  Admin
router.get('/jobs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Job.countDocuments();
        const jobs = await Job.find()
            .populate('company', 'industry location')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalJobs: total
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/admin/jobs
// @desc    Create new job
// @access  Admin
router.post('/jobs', async (req, res) => {
    try {
        const { company, title, description, requirements, location, type, salaryRange } = req.body;

        const job = await Job.create({
            company,
            title,
            description,
            requirements: requirements || [],
            location,
            type,
            salaryRange
        });

        res.status(201).json({ message: 'Job created successfully', job });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/jobs/:id
// @desc    Update job
// @access  Admin
router.put('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const { title, description, requirements, location, type, salaryRange } = req.body;

        if (title) job.title = title;
        if (description) job.description = description;
        if (requirements) job.requirements = requirements;
        if (location) job.location = location;
        if (type) job.type = type;
        if (salaryRange) job.salaryRange = salaryRange;

        await job.save();

        res.json({ message: 'Job updated successfully', job });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/jobs/:id
// @desc    Delete job
// @access  Admin
router.delete('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Delete associated applications
        await Application.deleteMany({ job: job._id });

        await Job.findByIdAndDelete(req.params.id);

        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ============================================
// COMPANY MANAGEMENT
// ============================================

// @route   GET /api/admin/companies
// @desc    Get all companies
// @access  Admin
router.get('/companies', async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json({ companies });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/admin/companies/:id
// @desc    Update company
// @access  Admin
router.put('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const { industry, location, description } = req.body;

        if (industry) company.industry = industry;
        if (location) company.location = location;
        if (description) company.description = description;

        await company.save();

        res.json({ message: 'Company updated successfully', company });
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/admin/companies/:id
// @desc    Delete company
// @access  Admin
router.delete('/companies/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Delete associated jobs and applications
        const jobs = await Job.find({ company: company._id });
        for (const job of jobs) {
            await Application.deleteMany({ job: job._id });
        }
        await Job.deleteMany({ company: company._id });

        // Delete company user
        await User.findByIdAndDelete(company.user);

        await Company.findByIdAndDelete(req.params.id);

        res.json({ message: 'Company deleted successfully' });
    } catch (error) {
        console.error('Error deleting company:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ============================================
// STATISTICS
// ============================================

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Admin
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCompanies = await User.countDocuments({ role: 'company' });
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        // Applications by status
        const applicationStats = await Application.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Recent activity
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentJobs = await Job.find()
            .populate('company', 'industry location')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalStudents,
                totalCompanies,
                totalJobs,
                totalApplications,
                applicationStats
            },
            recentActivity: {
                recentUsers,
                recentJobs
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
