const Student = require('../models/Student');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Company = require('../models/Company');
const geminiService = require('../services/geminiService');
const pdfService = require('../services/pdfService');
const offerLetterService = require('../services/offerLetterService');

// Get Student Profile
exports.getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.userId })
            .populate('placedCompany', 'companyName logo')
            .populate({
                path: 'applications',
                populate: {
                    path: 'jobId companyId',
                    select: 'title companyName logo'
                }
            });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
};

// Get All Jobs (for Student)
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true })
            .populate('companyId', 'companyName logo headquartersLocation')
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

// Update Student Profile
exports.updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            phone,
            dateOfBirth,
            gender,
            branch,
            semester,
            currentCGPA,
            skills,
            technicalSkills,
            certifications,
            projects,
            experience
        } = req.body;

        const student = await Student.findOneAndUpdate(
            { userId: req.userId },
            {
                fullName,
                phone,
                dateOfBirth,
                gender,
                branch,
                semester,
                currentCGPA,
                skills,
                technicalSkills,
                certifications,
                projects,
                experience
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student profile not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: student
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
};

// Upload and Parse Resume
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No resume file uploaded'
            });
        }

        console.log('📄 Parsing resume...');

        // Parse resume using Gemini AI
        const fileBuffer = req.file.buffer;
        const resumeText = await pdfService.extractTextFromPDF(fileBuffer);

        // Use Gemini to parse resume
        const parsedData = await geminiService.parseResume(resumeText);

        // Analyze resume quality
        const aiAnalysis = await geminiService.analyzeResumeQuality(resumeText);

        // Save resume URL (upload to cloud storage like S3/Cloudinary)
        const resumeUrl = await uploadToCloudStorage(req.file); // Implement this

        // Update student profile
        const student = await Student.findOneAndUpdate(
            { userId: req.userId },
            {
                'resume.url': resumeUrl,
                'resume.uploadedAt': new Date(),
                'resume.parsedData': parsedData,
                'resume.aiAnalysis': aiAnalysis,
                profileCompleted: true
            },
            { new: true }
        );

        console.log('✅ Resume uploaded and parsed successfully');

        res.json({
            success: true,
            message: 'Resume uploaded and analyzed successfully',
            data: {
                resumeUrl,
                parsedData,
                aiAnalysis
            }
        });
    } catch (error) {
        console.error('Upload Resume Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload resume',
            error: error.message
        });
    }
};

// Upload 10th Certificate
exports.uploadTenthCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No certificate uploaded'
            });
        }

        const certificateUrl = await uploadToCloudStorage(req.file);

        const student = await Student.findOneAndUpdate(
            { userId: req.userId },
            {
                'tenth.certificate': certificateUrl,
                'tenth.board': req.body.board,
                'tenth.yearOfPassing': req.body.yearOfPassing,
                'tenth.percentage': req.body.percentage
            },
            { new: true }
        );

        res.json({
            success: true,
            message: '10th certificate uploaded successfully',
            data: student.tenth
        });
    } catch (error) {
        console.error('Upload 10th Certificate Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload certificate',
            error: error.message
        });
    }
};

// Upload 12th Certificate
exports.uploadTwelfthCertificate = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No certificate uploaded'
            });
        }

        const certificateUrl = await uploadToCloudStorage(req.file);

        const student = await Student.findOneAndUpdate(
            { userId: req.userId },
            {
                'twelfth.certificate': certificateUrl,
                'twelfth.board': req.body.board,
                'twelfth.yearOfPassing': req.body.yearOfPassing,
                'twelfth.percentage': req.body.percentage,
                'twelfth.stream': req.body.stream
            },
            { new: true }
        );

        res.json({
            success: true,
            message: '12th certificate uploaded successfully',
            data: student.twelfth
        });
    } catch (error) {
        console.error('Upload 12th Certificate Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload certificate',
            error: error.message
        });
    }
};

// Verify Certificates with AI
exports.verifyCertificates = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.userId });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        let verified = { tenth: false, twelfth: false };

        // Verify 10th Certificate
        if (student.tenth.certificate) {
            console.log('🔍 Verifying 10th certificate with AI...');
            const tenthPDF = await downloadFromCloudStorage(student.tenth.certificate);
            const tenthText = await pdfService.extractTextFromPDF(tenthPDF);
            const tenthVerification = await geminiService.verifyCertificate(tenthText, {
                expectedPercentage: student.tenth.percentage,
                expectedYear: student.tenth.yearOfPassing,
                expectedBoard: student.tenth.board
            });

            student.tenth.verified = tenthVerification.isValid;
            student.tenth.verificationDetails = {
                verifiedBy: 'AI',
                verifiedAt: new Date(),
                extractedData: tenthVerification.extractedData
            };

            verified.tenth = tenthVerification.isValid;
        }

        // Verify 12th Certificate
        if (student.twelfth.certificate) {
            console.log('🔍 Verifying 12th certificate with AI...');
            const twelfthPDF = await downloadFromCloudStorage(student.twelfth.certificate);
            const twelfthText = await pdfService.extractTextFromPDF(twelfthPDF);
            const twelfthVerification = await geminiService.verifyCertificate(twelfthText, {
                expectedPercentage: student.twelfth.percentage,
                expectedYear: student.twelfth.yearOfPassing,
                expectedBoard: student.twelfth.board
            });

            student.twelfth.verified = twelfthVerification.isValid;
            student.twelfth.verificationDetails = {
                verifiedBy: 'AI',
                verifiedAt: new Date(),
                extractedData: twelfthVerification.extractedData
            };

            verified.twelfth = twelfthVerification.isValid;
        }

        await student.save();

        res.json({
            success: true,
            message: 'Certificates verified successfully',
            data: {
                tenth: {
                    verified: verified.tenth,
                    details: student.tenth.verificationDetails
                },
                twelfth: {
                    verified: verified.twelfth,
                    details: student.twelfth.verificationDetails
                }
            }
        });
    } catch (error) {
        console.error('Verify Certificates Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify certificates',
            error: error.message
        });
    }
};

// Apply to Job
exports.applyToJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { coverLetterText } = req.body;

        // Check if student exists and has complete profile
        const student = await Student.findOne({ userId: req.userId });

        if (!student || !student.resume.url) {
            return res.status(403).json({
                success: false,
                message: 'Please complete your profile and upload resume before applying'
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId).populate('companyId');

        if (!job || !job.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Job not found or inactive'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            studentId: student._id,
            jobId: jobId
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        }

        // Check eligibility (CGPA, branches, etc.)
        if (job.minCGPA && student.currentCGPA < job.minCGPA) {
            return res.status(403).json({
                success: false,
                message: `Minimum CGPA required: ${job.minCGPA}. Your CGPA: ${student.currentCGPA}`
            });
        }

        if (job.eligibleBranches && job.eligibleBranches.length > 0) {
            if (!job.eligibleBranches.includes(student.branch)) {
                return res.status(403).json({
                    success: false,
                    message: 'Your branch is not eligible for this job'
                });
            }
        }

        // Calculate match score
        const matchScore = await geminiService.calculateJobMatchScore(
            student.resume.parsedData.extractedSkills,
            job.requiredSkills
        );

        // Generate AI cover letter if not provided
        let coverLetter = {
            text: coverLetterText,
            aiGenerated: false
        };

        if (!coverLetterText) {
            const generatedCoverLetter = await geminiService.generateCoverLetter(
                student.resume.parsedData,
                job
            );
            coverLetter = {
                text: generatedCoverLetter,
                aiGenerated: true,
                generatedAt: new Date()
            };
        }

        // Create application
        const application = new Application({
            studentId: student._id,
            jobId: job._id,
            companyId: job.companyId._id,
            resumeSnapshot: {
                url: student.resume.url,
                parsedSkills: student.resume.parsedData.extractedSkills,
                matchScore: matchScore
            },
            coverLetter: coverLetter,
            timeline: [{
                stage: 'Application Submitted',
                status: 'Submitted',
                timestamp: new Date(),
                notes: 'Application submitted successfully'
            }]
        });

        await application.save();

        // Update student and job
        student.applications.push(application._id);
        await student.save();

        job.applications.push(application._id);
        job.totalApplications += 1;
        await job.save();

        console.log(`✅ Application submitted for job: ${job.title}`);

        res.json({
            success: true,
            message: 'Application submitted successfully',
            data: {
                applicationId: application._id,
                matchScore: matchScore,
                status: application.status
            }
        });
    } catch (error) {
        console.error('Apply to Job Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application',
            error: error.message
        });
    }
};

// Get My Applications
exports.getMyApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.userId });

        const applications = await Application.find({ studentId: student._id })
            .populate('jobId', 'title jobType location salary')
            .populate('companyId', 'companyName logo')
            .sort({ appliedAt: -1 });

        res.json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Get Applications Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications',
            error: error.message
        });
    }
};

// Get Application Details
exports.getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const student = await Student.findOne({ userId: req.userId });

        const application = await Application.findOne({
            _id: applicationId,
            studentId: student._id
        })
            .populate('jobId')
            .populate('companyId');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Get Application Details Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application details',
            error: error.message
        });
    }
};

// Withdraw Application
exports.withdrawApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const student = await Student.findOne({ userId: req.userId });

        const application = await Application.findOne({
            _id: applicationId,
            studentId: student._id
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Can't withdraw if offer extended or accepted
        if (['Offer Extended', 'Offer Accepted'].includes(application.status)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot withdraw application after offer is extended'
            });
        }

        application.status = 'Rejected';
        application.rejectionReason = 'Withdrawn by student';
        application.rejectedAt = new Date();
        application.rejectedBy = 'Student';

        application.timeline.push({
            stage: 'Application Withdrawn',
            status: 'Rejected',
            timestamp: new Date(),
            notes: 'Student withdrew the application'
        });

        await application.save();

        // Update job total applications
        await Job.findByIdAndUpdate(application.jobId, {
            $inc: { totalApplications: -1 }
        });

        res.json({
            success: true,
            message: 'Application withdrawn successfully'
        });
    } catch (error) {
        console.error('Withdraw Application Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to withdraw application',
            error: error.message
        });
    }
};

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.userId });
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // basic stats
        const totalApplications = student.applications.length;
        res.json({
            success: true,
            data: {
                totalApplications,
                // Add more stats as needed
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const AssessmentQuestion = require('../models/AssessmentQuestion');

// Get Assessment (Start or Continue)
exports.getAssessment = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const student = await Student.findOne({ userId: req.userId });

        const application = await Application.findOne({ _id: applicationId, studentId: student._id })
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // If assessment not started, generate questions
        if (!application.assessment.questions || application.assessment.questions.length === 0) {

            // Fetch questions from bank based on skills
            const requiredSkills = application.jobId.requiredSkills || [];

            // Simple logic: fetch 5 questions matching skills, or random if no match
            let questions = await AssessmentQuestion.find({
                skillTested: { $in: requiredSkills }
            }).limit(5);

            if (questions.length < 5) {
                const randomQuestions = await AssessmentQuestion.find().limit(5 - questions.length);
                questions = [...questions, ...randomQuestions];
            }

            // Map to application structure (hide correct answer)
            application.assessment.questions = questions.map(q => ({
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer, // Stored but should be hidden in response
                _id: q._id
            }));

            application.assessment.scheduled = true;
            application.assessment.scheduledFor = new Date();
            application.status = 'Assessment Scheduled';

            await application.save();
        }

        // Return questions without correct answers
        const questionsForStudent = application.assessment.questions.map(q => ({
            _id: q._id,
            question: q.question,
            options: q.options
        }));

        res.json({ success: true, data: questionsForStudent });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit Assessment
exports.submitAssessment = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { answers } = req.body; // { questionId: answer, ... }

        const student = await Student.findOne({ userId: req.userId });
        const application = await Application.findOne({ _id: applicationId, studentId: student._id });

        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        let correctCount = 0;

        application.assessment.questions.forEach(q => {
            const studentAns = answers[q._id];
            if (studentAns) {
                q.studentAnswer = studentAns;
                q.isCorrect = (studentAns === q.correctAnswer);
                if (q.isCorrect) correctCount++;
            }
        });

        const score = (correctCount / application.assessment.questions.length) * 100;

        application.assessment.score = score;
        application.assessment.completed = true;
        application.assessment.completedAt = new Date();
        application.assessment.correctAnswers = correctCount;
        application.status = 'Assessment Completed';

        await application.save();

        res.json({
            success: true,
            message: 'Assessment submitted',
            data: { score, passed: score >= 60 }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get AI Interview
exports.getAIInterview = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const student = await Student.findOne({ userId: req.userId });
        const application = await Application.findOne({ _id: applicationId, studentId: student._id })
            .populate('jobId');

        if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

        // Generate questions if not exist
        if (!application.aiInterview.questions || application.aiInterview.questions.length === 0) {
            // Use Gemini to generate interview questions
            const questionsText = await geminiService.generateInterviewQuestions(
                student.resume.parsedData,
                application.jobId
            );
            // Assume service returns array of strings
            application.aiInterview.questions = questionsText.map(q => ({
                question: q
            }));

            application.status = 'AI Interview Scheduled';
            await application.save();
        }

        res.json({ success: true, data: application.aiInterview.questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit AI Interview Answer
exports.submitAIInterviewAnswer = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { questionId, answer } = req.body;

        const student = await Student.findOne({ userId: req.userId });
        const application = await Application.findOne({ _id: applicationId, studentId: student._id });

        const question = application.aiInterview.questions.id(questionId);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

        question.studentAnswer = answer;

        // Evaluate with AI
        const evaluation = await geminiService.evaluateAnswer(question.question, answer);
        question.aiEvaluation = evaluation;

        await application.save();

        res.json({ success: true, data: evaluation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Complete AI Interview
exports.completeAIInterview = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const student = await Student.findOne({ userId: req.userId });
        const application = await Application.findOne({ _id: applicationId, studentId: student._id });

        application.aiInterview.completed = true;
        application.aiInterview.completedAt = new Date();
        application.status = 'AI Interview Completed';

        // Calculate overall score (simple average of individual question scores)
        const totalScore = application.aiInterview.questions.reduce((sum, q) => sum + (q.aiEvaluation?.score || 0), 0);
        application.aiInterview.overallScore = totalScore / (application.aiInterview.questions.length || 1);

        await application.save();
        res.json({ success: true, message: 'Interview completed', overallScore: application.aiInterview.overallScore });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Offer Letter Logic (Basic)
exports.getOfferLetter = async (req, res) => {
    const { applicationId } = req.params;
    // Implementation would fetch offer details from application.offerLetter
    res.json({ message: 'Offer letter details' });
};

exports.acceptOffer = async (req, res) => {
    // Logic to update status to 'Offer Accepted'
    res.json({ message: 'Offer Accepted' });
};

exports.rejectOffer = async (req, res) => {
    // Logic to update status to 'Offer Rejected'
    res.json({ message: 'Offer Rejected' });
};

// Helper function (implement cloud storage)
async function uploadToCloudStorage(file) {
    // TODO: Implement S3/Cloudinary upload
    // For now, return a placeholder URL
    return `https://storage.example.com/${Date.now()}_${file.originalname}`;
}

async function downloadFromCloudStorage(url) {
    // TODO: Implement download from cloud storage
    return Buffer.from('');
}
