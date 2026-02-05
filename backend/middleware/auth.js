const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same JWT_SECRET as server.js (with fallback)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123";

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Not authorized, no token provided' });
            }

            // Verify token using the same secret as used for signing
            const decoded = jwt.verify(token, JWT_SECRET);
            
            if (!decoded || !decoded.id) {
                console.error('Invalid token payload:', decoded);
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.error('User not found for token ID:', decoded.id);
                return res.status(401).json({ message: 'User not found. Please log in again.' });
            }
            
            // Log successful authentication for debugging
            console.log(`✅ Authenticated user: ${req.user.email} (${req.user.role})`);

            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired. Please log in again.' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token. Please log in again.' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed: ' + error.message });
        }
    } else {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Authorize specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            console.error('Authorize middleware: req.user is not set');
            return res.status(401).json({ message: 'Not authorized - user not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            console.error(`Authorize middleware: User role '${req.user.role}' not in allowed roles:`, roles);
            return res.status(403).json({
                message: `Access denied. User role '${req.user.role}' is not authorized. Required roles: ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
