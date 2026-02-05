const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Student = require('../models/Student');

// Get Company Profile
exports.getProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company profile not found' });
        }
        res.json({ success: true, data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Company Profile
exports.updateProfile = async (req, res) => {
    try {
        // fields to update
        const {
            companyName, companyEmail, website, logo,
            hrName, hrEmail, hrPhone,
            industry, companySize, headquartersLocation, about
        } = req.body;

        const company = await Company.findOneAndUpdate(
            { userId: req.userId },
            {
                companyName, companyEmail, website, logo,
                hrName, hrEmail, hrPhone,
                industry, companySize, headquartersLocation, about,
                isVerified: true // Mocking verification for now, usually admin does this
            },
            { new: true, runValidators: true }
        );

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company profile not found' });
        }

        res.json({ success: true, message: 'Profile updated', data: company });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Post a new Job
exports.postJob = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        const job = new Job({
            ...req.body,
            companyId: company._id
        });

        await job.save();

        // Add to company jobs list
        company.jobsPosted.push(job._id);
        company.activeJobs += 1;
        await company.save();

        res.status(201).json({ success: true, message: 'Job posted successfully', data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all jobs posted by company
exports.getCompanyJobs = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        if (!company) return res.status(404).json({ success: false, message: 'Company not found' });

        const jobs = await Job.find({ companyId: company._id }).sort({ createdAt: -1 });

        res.json({ success: true, count: jobs.length, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get details of a specific job
exports.getJobDetails = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit Job
exports.editJob = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        let job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Update fields
        Object.assign(job, req.body);
        await job.save();

        res.json({ success: true, message: 'Job updated', data: job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Job
exports.deleteJob = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        const job = await Job.findOneAndDelete({ _id: req.params.jobId, companyId: company._id });

        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        // Update company stats
        await Company.updateOne({ _id: company._id }, {
            $pull: { jobsPosted: job._id },
            $inc: { activeJobs: -1 }
        });

        res.json({ success: true, message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Get Applications for a Job
exports.getJobApplications = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.userId });
        // Verify job belongs to company
        const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

        const applications = await Application.find({ jobId: job._id })
            .populate('studentId', 'fullName email phone degree branch resume')
            .sort({ matchScore: -1 }); // Sort by AI match score

        res.json({ success: true, count: applications.length, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Application Status
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const company = await Company.findOne({ userId: req.userId });

        const application = await Application.findOne({
            _id: req.params.applicationId,
            companyId: company._id
        });

        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        application.status = status;

        // Add to timeline
        application.timeline.push({
            stage: 'Status Update',
            status: status,
            timestamp: new Date(),
            notes: `Status updated to ${status} by Company`
        });

        // If rejected
        if (status === 'Rejected') {
            application.rejectedAt = new Date();
            application.rejectedBy = 'Company';
        }

        await application.save();
        res.json({ success: true, message: `Application status updated to ${status}`, data: application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
