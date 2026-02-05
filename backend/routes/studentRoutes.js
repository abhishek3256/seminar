const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');
const upload = require('../config/multer'); // Configure multer for file uploads

// All routes require authentication
router.use(authenticate);

// Profile Management (Student only)
router.get('/profile',
    authorize('student'),
    studentController.getProfile
);

router.put('/profile',
    authorize('student'),
    studentController.updateProfile
);

router.post('/profile/upload-resume',
    authorize('student'),
    upload.single('resume'),
    studentController.uploadResume
);

router.post('/profile/upload-tenth-certificate',
    authorize('student'),
    upload.single('certificate'),
    studentController.uploadTenthCertificate
);

router.post('/profile/upload-twelfth-certificate',
    authorize('student'),
    upload.single('certificate'),
    studentController.uploadTwelfthCertificate
);

// Verify certificates with AI
router.post('/profile/verify-certificates',
    authorize('student'),
    studentController.verifyCertificates
);

// Get All Jobs
router.get('/jobs',
    authorize('student'),
    studentController.getAllJobs
);

// Job Application
router.post('/apply/:jobId',
    authorize('student'),
    studentController.applyToJob
);

router.get('/applications',
    authorize('student'),
    studentController.getMyApplications
);

router.get('/applications/:applicationId',
    authorize('student'),
    studentController.getApplicationDetails
);

router.delete('/applications/:applicationId',
    authorize('student'),
    studentController.withdrawApplication
);

// Assessment
router.get('/assessment/:applicationId',
    authorize('student'),
    studentController.getAssessment
);

router.post('/assessment/:applicationId/submit',
    authorize('student'),
    studentController.submitAssessment
);

// AI Interview
router.get('/ai-interview/:applicationId',
    authorize('student'),
    studentController.getAIInterview
);

router.post('/ai-interview/:applicationId/submit-answer',
    authorize('student'),
    studentController.submitAIInterviewAnswer
);

router.post('/ai-interview/:applicationId/complete',
    authorize('student'),
    studentController.completeAIInterview
);

// Offer Management
router.get('/offer/:applicationId',
    authorize('student'),
    studentController.getOfferLetter
);

router.post('/offer/:applicationId/accept',
    authorize('student'),
    studentController.acceptOffer
);

router.post('/offer/:applicationId/reject',
    authorize('student'),
    studentController.rejectOffer
);

// Dashboard Stats
router.get('/dashboard/stats',
    authorize('student'),
    studentController.getDashboardStats
);

module.exports = router;
