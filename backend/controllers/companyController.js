// const Company = require('../models/Company');
// const Job = require('../models/Job');
// const Application = require('../models/Application');
// const Student = require('../models/Student');

// const Student = require('../models/Student');
// exports.getProfile = async (req, res) => {
//     try {
//         const company = await Company.findOne({ userId: req.userId });
//         if (!company) {
//             return res.status(404).json({ success: false, message: 'Company profile not found' });
//         }
//         res.json({ success: true, data: company });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.updateProfile = async (req, res) => {
//     try {
//         try {
//             const {
//                 companyName, companyEmail, website, logo,
//                 hrName, hrEmail, hrPhone,
//                 industry, companySize, headquartersLocation, about
//             } = req.body;

//             const company = await Company.findOneAndUpdate(
//                 { userId: req.userId },
//                 {
//                     companyName, companyEmail, website, logo,
//                     hrName, hrEmail, hrPhone,
//                     industry, companySize, headquartersLocation, about,
//                     isVerified: true // Mocking verification for now, usually admin does this
//                 },
//                 { new: true, runValidators: true }
//             );

//             if (!company) {
//                 return res.status(404).json({ success: false, message: 'Company profile not found' });
//             }

//             res.json({ success: true, message: 'Profile updated', data: company });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.postJob = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

//             const job = new Job({
//                 ...req.body,
//                 companyId: company._id
//             });

//             await job.save();

//             // Add to company jobs list
//             company.jobsPosted.push(job._id);
//             company.activeJobs += 1;
//             await company.save();

//             res.status(201).json({ success: true, message: 'Job posted successfully', data: job });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.getCompanyJobs = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

//             const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });

//             res.json({ success: true, count: jobs.length, data: jobs });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.getJobDetails = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

//             if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//             res.json({ success: true, data: job });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.editJob = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             let job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

//             if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//             // Update fields
//             Object.assign(job, req.body);
//             await job.save();

//             res.json({ success: true, message: 'Job updated', data: job });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.deleteJob = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             const job = await Job.findOneAndDelete({ _id: req.params.jobId, companyId: company._id });

//             if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//             // Update company stats
//             await Company.updateOne({ _id: company._id }, {
//                 $pull: { jobsPosted: job._id },
//                 $inc: { activeJobs: -1 }
//             });

//             res.json({ success: true, message: 'Job deleted' });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }


//     exports.getJobApplications = async (req, res) => {
//         try {
//             const company = await Company.findOne({ userId: req.userId });
//             // Verify job belongs to company
//             const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });
//             if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

//             const applications = await Application.find({ jobId: job._id })
//                 .populate('studentId', 'fullName email phone degree branch resume')
//                 .sort({ matchScore: -1 }); // Sort by AI match score

//             res.json({ success: true, count: applications.length, data: applications });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


//     exports.updateApplicationStatus = async (req, res) => {
//         try {
//             const { status } = req.body;
//             const company = await Company.findOne({ userId: req.userId });

//             const application = await Application.findOne({
//                 _id: req.params.applicationId,
//                 companyId: company._id
//             });

//             if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

//             application.status = status;

//             // Add to timeline
//             application.timeline.push({
//                 stage: 'Status Update',
//                 status: status,
//                 timestamp: new Date(),
//                 notes: `Status updated to ${status} by Company`
//             });

//             // If rejected
//             if (status === 'Rejected') {
//                 application.rejectedAt = new Date();
//                 application.rejectedBy = 'Company';
//             }

//             await application.save();
//             res.json({ success: true, message: `Application status updated to ${status}`, data: application });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     };


const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Student = require('../models/Student');

// Get Company Profile
exports.getProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId })
            .populate('userId', 'email isActive');
            
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company profile not found' 
            });
        }
        
        res.json({ 
            success: true, 
            data: company 
        });
    } catch (error) {
        console.error('Get Company Profile Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch profile',
            error: error.message 
        });
    }
};

// Update Company Profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            companyName, 
            companyEmail, 
            website, 
            logo,
            hrName, 
            hrEmail, 
            hrPhone,
            industry, 
            companySize, 
            headquartersLocation, 
            about
        } = req.body;

        const company = await Company.findOneAndUpdate(
            { userId: req.userId },
            {
                companyName, 
                companyEmail, 
                website, 
                logo,
                hrName, 
                hrEmail, 
                hrPhone,
                industry, 
                companySize, 
                headquartersLocation, 
                about
            },
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company profile not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Profile updated successfully', 
            data: company 
        });
    } catch (error) {
        console.error('Update Company Profile Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update profile',
            error: error.message 
        });
    }
};

// Post a Job
exports.postJob = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        // Create new job with company ID
        const job = new Job({
            ...req.body,
            companyId: company._id
        });

        await job.save();

        // Update company's job list
        company.jobsPosted.push(job._id);
        company.activeJobs += 1;
        await company.save();

        res.status(201).json({ 
            success: true, 
            message: 'Job posted successfully', 
            data: job 
        });
    } catch (error) {
        console.error('Post Job Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to post job',
            error: error.message 
        });
    }
};

// Get All Company's Jobs
exports.getCompanyJobs = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        const jobs = await Job.find({ companyId: company._id })
            .sort({ createdAt: -1 });

        res.json({ 
            success: true, 
            count: jobs.length, 
            data: jobs 
        });
    } catch (error) {
        console.error('Get Company Jobs Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch jobs',
            error: error.message 
        });
    }
};

// Get Single Job Details
exports.getJobDetails = async (req, res) => {
    try {
        const { jobId } = req.params;
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        const job = await Job.findOne({ 
            _id: jobId, 
            companyId: company._id 
        });

        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or you do not have permission to view it' 
            });
        }

        res.json({ 
            success: true, 
            data: job 
        });
    } catch (error) {
        console.error('Get Job Details Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch job details',
            error: error.message 
        });
    }
};

// Edit/Update Job
exports.editJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        let job = await Job.findOne({ 
            _id: jobId, 
            companyId: company._id 
        });

        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or you do not have permission to edit it' 
            });
        }

        // Update job fields
        Object.assign(job, req.body);
        await job.save();

        res.json({ 
            success: true, 
            message: 'Job updated successfully', 
            data: job 
        });
    } catch (error) {
        console.error('Edit Job Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update job',
            error: error.message 
        });
    }
};

// Delete Job
exports.deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        const job = await Job.findOneAndDelete({ 
            _id: jobId, 
            companyId: company._id 
        });

        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or you do not have permission to delete it' 
            });
        }

        // Update company stats
        await Company.updateOne(
            { _id: company._id }, 
            {
                $pull: { jobsPosted: job._id },
                $inc: { activeJobs: -1 }
            }
        );

        res.json({ 
            success: true, 
            message: 'Job deleted successfully' 
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

// Get Applications for a Specific Job
exports.getJobApplications = async (req, res) => {
    try {
        const { jobId } = req.params;
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        // Verify job belongs to company
        const job = await Job.findOne({ 
            _id: jobId, 
            companyId: company._id 
        });
        
        if (!job) {
            return res.status(404).json({ 
                success: false, 
                message: 'Job not found or you do not have permission to view applications' 
            });
        }

        const applications = await Application.find({ jobId: job._id })
            .populate('studentId', 'fullName email phone degree branch resume currentCGPA')
            .sort({ matchScore: -1 }); // Sort by AI match score

        res.json({ 
            success: true, 
            count: applications.length, 
            data: applications 
        });
    } catch (error) {
        console.error('Get Job Applications Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch applications',
            error: error.message 
        });
    }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, notes } = req.body;
        
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        const application = await Application.findOne({
            _id: applicationId,
            companyId: company._id
        });

        if (!application) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found or you do not have permission to update it' 
            });
        }

        // Update status
        application.status = status;

        // Add to timeline
        application.timeline.push({
            stage: 'Status Update',
            status: status,
            timestamp: new Date(),
            notes: notes || `Status updated to ${status} by Company`
        });

        // Handle rejection
        if (status === 'Rejected') {
            application.rejectedAt = new Date();
            application.rejectedBy = 'Company';
            if (notes) {
                application.rejectionReason = notes;
            }
        }

        await application.save();
        
        res.json({ 
            success: true, 
            message: `Application status updated to ${status}`, 
            data: application 
        });
    } catch (error) {
        console.error('Update Application Status Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update application status',
            error: error.message 
        });
    }
};

// Get Company Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Company not found' 
            });
        }

        const totalJobs = await Job.countDocuments({ companyId: company._id });
        const activeJobs = await Job.countDocuments({ companyId: company._id, isActive: true });
        const totalApplications = await Application.countDocuments({ companyId: company._id });
        const pendingApplications = await Application.countDocuments({ 
            companyId: company._id, 
            status: 'Applied' 
        });

        res.json({
            success: true,
            data: {
                totalJobs,
                activeJobs,
                totalApplications,
                pendingApplications,
                companyInfo: {
                    name: company.companyName,
                    verified: company.isVerified
                }
            }
        });
    } catch (error) {
        console.error('Get Company Dashboard Stats Error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch dashboard stats',
            error: error.message 
        });
    }
};

module.exports = exports;