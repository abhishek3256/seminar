require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Import Middleware
const { protect } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected: campusplacement'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));


// 1. Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, email, password, role });
    await user.save();

    // Create specific profile based on role
    if (role === 'student') {
      await Student.create({ user: user._id });
    } else if (role === 'company') {
      await Company.create({ user: user._id, industry: "Technology" }); // Default
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Dashboard Stats Route (Protected - requires authentication)
app.get('/api/dashboard/stats', protect, async (req, res) => {
  try {
    const students = await Student.countDocuments();
    const companies = await Company.countDocuments();
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();

    // Get recent jobs
    const recentJobs = await Job.find().sort({ postedAt: -1 }).limit(5).populate('company', 'name location');

    res.json({
      stats: { students, companies, jobs, applications },
      recentJobs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Jobs Route (Protected - requires authentication)
app.get('/api/jobs', protect, async (req, res) => {
  try {
    const jobs = await Job.find().populate('company', 'name location industry');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
