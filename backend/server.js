// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const jwt = require('jsonwebtoken');

// const { authenticate } = require('./middleware/auth');

// const app = express();
// const PORT = process.env.PORT || 5001;
// const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// // Middleware
// const corsOptions = {
//   origin: ['http://localhost:5173', 'http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
// };
// app.use(cors(corsOptions));
// app.use(express.json());



// // Root route for health check
// app.get('/', (req, res) => {
//   res.send('CampusAI Backend is Running');
// });

// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusplacement')
//   .then(() => console.log('✅ MongoDB Connected: campusplacement'))
//   .catch(err => console.error('❌ MongoDB Connection Error:', err));

// app.use('/api/student', require('./routes/studentRoutes'));
// app.use('/api/company', require('./routes/companyRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/assessment', require('./routes/assessmentRoutes'));

// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: "User already exists" });

//     user = new User({ email, password, role });
//     await user.save();

//     // Create specific profile based on role
//     // Note: This is partial, real flow should happen in specific controllers
//     if (role === 'student') {
//       const { fullName, phone } = req.body; // Expect these in body
//       if (fullName && phone) {
//         await Student.create({
//           userId: user._id,
//           fullName,
//           phone
//         });
//       }
//     } else if (role === 'company') {
//       const { companyName, companyEmail } = req.body;
//       if (companyName && companyEmail)
//         await Company.create({
//           userId: user._id,
//           companyName,
//           companyEmail
//         });
//     }

//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
//     res.status(201).json({ token, user: { id: user._id, email, role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

// Import models
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');

const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET;

// Basic env validation
if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Please configure it in your environment.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI is not set. Falling back to local MongoDB instance.');
}

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting for auth endpoints to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Root route for health check
app.get('/', (req, res) => {
  res.json({ message: 'CampusAI Backend is Running', status: 'OK' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/campusplacement')
  .then(() => console.log('✅ MongoDB Connected: campusplacement'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Auth Routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, role, fullName, phone, companyName, companyEmail } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required"
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Create user
    user = new User({ email, password, role });
    await user.save();

    // Create specific profile based on role
    let profileData = null;

    if (role === 'student') {
      if (!fullName || !phone) {
        return res.status(400).json({
          success: false,
          message: "Full name and phone are required for student registration"
        });
      }

      const student = await Student.create({
        userId: user._id,
        fullName,
        phone,
        email
      });
      profileData = { fullName, phone };

    } else if (role === 'company') {
      if (!companyName || !companyEmail) {
        return res.status(400).json({
          success: false,
          message: "Company name and email are required for company registration"
        });
      }

      const company = await Company.create({
        userId: user._id,
        companyName,
        companyEmail
      });
      profileData = { companyName, companyEmail };
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: err.message
    });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact support."
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Get additional profile data
    let profileData = {};
    if (user.role === 'student') {
      const student = await Student.findOne({ userId: user._id });
      if (student) {
        profileData = {
          fullName: student.fullName,
          phone: student.phone,
          profileComplete: !!(student.resume && student.resume.url)
        };
      }
    } else if (user.role === 'company') {
      const company = await Company.findOne({ userId: user._id });
      if (company) {
        profileData = {
          companyName: company.companyName,
          companyEmail: company.companyEmail
        };
      }
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        ...profileData
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: err.message
    });
  }
});

// Verify token endpoint (useful for checking if user is logged in)
app.get('/api/auth/verify', authenticate, async (req, res) => {
  try {
    let profileData = {};

    if (req.userRole === 'student') {
      const student = await Student.findOne({ userId: req.userId });
      if (student) {
        profileData = {
          fullName: student.fullName,
          phone: student.phone,
          profileComplete: !!(student.resume && student.resume.url)
        };
      }
    } else if (req.userRole === 'company') {
      const company = await Company.findOne({ userId: req.userId });
      if (company) {
        profileData = {
          companyName: company.companyName,
          companyEmail: company.companyEmail
        };
      }
    }

    res.json({
      success: true,
      user: {
        id: req.userId,
        email: req.user.email,
        role: req.userRole,
        ...profileData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
});

// Logout endpoint (optional - mainly for clearing server-side sessions if any)
app.post('/api/auth/logout', authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
});

// API Routes
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/assessment', require('./routes/assessmentRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/`);
});

module.exports = app;