require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import Models
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Import Middleware
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
};
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root route for health check
app.get('/', (req, res) => {
  res.send('CampusAI Backend is Running');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusplacement')
  .then(() => console.log('✅ MongoDB Connected: campusplacement'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---
// Mount Student Routes
app.use('/api/student', require('./routes/studentRoutes'));
// Mount Company Routes
app.use('/api/company', require('./routes/companyRoutes'));
// Mount Admin Routes
app.use('/api/admin', require('./routes/adminRoutes'));
// Mount Assessment Routes
app.use('/api/assessment', require('./routes/assessmentRoutes'));

// Auth Routes (Minimal implementation for testing)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ email, password, role });
    await user.save();

    // Create specific profile based on role
    // Note: This is partial, real flow should happen in specific controllers
    if (role === 'student') {
      const { fullName, phone } = req.body; // Expect these in body
      if (fullName && phone) {
        await Student.create({
          userId: user._id,
          fullName,
          phone
        });
      }
    } else if (role === 'company') {
      const { companyName, companyEmail } = req.body;
      if (companyName && companyEmail)
        await Company.create({
          userId: user._id,
          companyName,
          companyEmail
        });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user._id, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
