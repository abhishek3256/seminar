const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// All routes require authentication & role 'admin'
router.use(authenticate);
router.use(authorize('admin'));

// Stats
router.get('/stats', adminController.getPlatformStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/status', adminController.updateUserStatus);

// Company Verification
router.get('/companies', adminController.getAllCompanies);
router.put('/companies/:companyId/verify', adminController.verifyCompany);

// Job Moderation
router.get('/jobs', adminController.getAllJobs);
router.delete('/jobs/:jobId', adminController.deleteJob);

module.exports = router;
