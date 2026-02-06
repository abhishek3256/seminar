require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected for Seeding");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing data
        await User.deleteMany({});
        await Student.deleteMany({});
        await Company.deleteMany({});
        await Job.deleteMany({});
        await Application.deleteMany({});
        console.log("🗑️  Cleared existing data");

        // Create Admin User Only
        // All other data (students, companies, jobs, applications) will be created via CRUD operations
        const adminUser = new User({
            email: 'admin@example.com',
            password: 'Admin@2024#Secure',
            role: 'admin',
            isActive: true,
            isVerified: true,
            profileCompleted: true
        });
        await adminUser.save();
        console.log('✅ Admin user created');

        console.log("🎉 Data Seeding Completed Successfully!");
        console.log("ℹ️  Note: All students, companies, jobs, and applications should be created through CRUD operations.");
        process.exit();

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        console.error(error.message); // Print concise message
        if (error.errors) console.error(JSON.stringify(error.errors, null, 2)); // Print validation details
        process.exit(1);
    }
};

seedData();
