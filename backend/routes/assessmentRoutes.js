const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const assessmentController = require('../controllers/assessmentController');

// All routes require authentication
router.use(authenticate);

// Only Admin and Company can manage Question Bank
router.use(authorize('admin', 'company'));

router.post('/', assessmentController.createQuestion);
router.get('/', assessmentController.getQuestions);
router.put('/:id', assessmentController.updateQuestion);
router.delete('/:id', assessmentController.deleteQuestion);

module.exports = router;
