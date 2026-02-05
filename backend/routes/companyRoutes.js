const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const companyController = require('../controllers/companyController');

// All routes require authentication & role 'company'
router.use(authenticate);
router.use(authorize('company'));

// Profile
router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);

// Jobs
router.post('/jobs', companyController.postJob);
router.get('/jobs', companyController.getCompanyJobs);
router.get('/jobs/:jobId', companyController.getJobDetails);
router.put('/jobs/:jobId', companyController.editJob);
router.delete('/jobs/:jobId', companyController.deleteJob);

// Applications
router.get('/jobs/:jobId/applications', companyController.getJobApplications);
router.put('/applications/:applicationId/status', companyController.updateApplicationStatus);

module.exports = router;
