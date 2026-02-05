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

        // 1. Create Admin User
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

        // 2. Create Users (Students)
        const studentsData = [
            { name: "Aarav Sharma", email: "aarav@example.com", text: "AS", skills: ["React", "Node.js", "Python"], branch: "CSE" },
            { name: "Sneha Patel", email: "sneha@example.com", text: "SP", skills: ["Java", "SQL", "Spring Boot"], branch: "IT" },
            { name: "Rohan Gupta", email: "rohan@example.com", text: "RG", skills: ["C++", "DSA", "System Design"], branch: "CSE" },
            { name: "Priya Singh", email: "priya@example.com", text: "PS", skills: ["Figma", "UI/UX", "Frontend"], branch: "ECE" },
            { name: "Vikram Malhotra", email: "vikram@example.com", text: "VM", skills: ["Python", "ML", "TensorFlow"], branch: "CSE" },
        ];

        const studentUsers = [];
        const studentsModels = [];

        let rollCounter = 101;
        for (const s of studentsData) {
            const user = await User.create({
                email: s.email,
                password: "password123",
                role: "student",
                isActive: true,
                isVerified: true,
                profileCompleted: true
            });
            studentUsers.push(user);

            const student = await Student.create({
                userId: user._id,
                fullName: s.name,
                phone: `98765${rollCounter}`, // Dummy phone
                rollNumber: `ROLL-${rollCounter++}`,
                gender: 'Male', // Dummy
                currentCGPA: (7 + Math.random() * 3).toFixed(2),
                branch: s.branch,
                skills: s.skills,
                resume: {
                    url: "https://example.com/resume.pdf",
                    uploadedAt: new Date(),
                    parsedData: {
                        extractedSkills: s.skills,
                        contactInfo: { email: s.email, phone: "9876543210" }
                    }
                }
            });
            studentsModels.push(student);
        }
        console.log(`✅ Created ${studentsData.length} Students`);

        // 3. Create Users (Companies)
        const companiesData = [
            { name: "TechCorp India", email: "hr@techcorp.com", industry: "IT Services", location: "Bangalore" },
            { name: "InnovateAI", email: "jobs@innovateai.com", industry: "Artificial Intelligence", location: "Hyderabad" },
            { name: "FinServe Global", email: "careers@finserve.com", industry: "Fintech", location: "Mumbai" },
            { name: "CloudSystems", email: "hiring@cloudsys.com", industry: "Cloud Computing", location: "Pune" },
            { name: "GreenEnergy", email: "recruitment@greenenergy.com", industry: "Renewable Energy", location: "Delhi" },
        ];

        const companyModels = [];

        for (const c of companiesData) {
            const user = await User.create({
                email: c.email,
                password: "password123",
                role: "company",
                isActive: true,
                isVerified: true,
                profileCompleted: true
            });

            const company = await Company.create({
                userId: user._id,
                companyName: c.name,
                companyEmail: c.email,
                industry: c.industry,
                headquartersLocation: c.location,
                about: `Leading company in ${c.industry} based in ${c.location}.`,
                isVerified: true
            });
            companyModels.push(company);
        }
        console.log(`✅ Created ${companiesData.length} Companies`);

        // 4. Create Jobs
        const jobsData = [
            { title: "SDE-1", desc: "Junior Software Developer role.", type: "Full-time", salaryMin: 1200000, salaryMax: 1500000 },
            { title: "Frontend Intern", desc: "React.js internship.", type: "Internship", salaryMin: 300000, salaryMax: 400000 },
            { title: "Data Analyst", desc: "Analyze business metrics.", type: "Full-time", salaryMin: 1000000, salaryMax: 1200000 },
            { title: "Backend Engineer", desc: "Node.js & Microservices.", type: "Full-time", salaryMin: 1800000, salaryMax: 2200000 },
            { title: "AI Researcher", desc: "Work on LLMs.", type: "Full-time", salaryMin: 2500000, salaryMax: 3000000 },
        ];

        const jobModels = [];

        for (const company of companyModels) {
            // Each company posts 1-2 jobs
            const numJobs = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < numJobs; i++) {
                const jobInfo = jobsData[Math.floor(Math.random() * jobsData.length)];
                const job = await Job.create({
                    companyId: company._id,
                    title: jobInfo.title,
                    description: `${jobInfo.desc} Join ${company.companyName}`,
                    requirements: ["Bachelor's Degree", "Good Communication"],
                    location: company.headquartersLocation,
                    jobType: jobInfo.type,
                    salary: {
                        min: jobInfo.salaryMin,
                        max: jobInfo.salaryMax,
                        currency: 'INR'
                    },
                    isActive: true,
                    applicationDeadline: new Date(new Date().setMonth(new Date().getMonth() + 1))
                });
                jobModels.push(job);

                // Update Company stats
                company.jobsPosted.push(job._id);
                company.activeJobs += 1;
                await company.save();
            }
        }
        console.log(`✅ Created ${jobModels.length} Jobs`);

        // 5. Create Applications
        for (const student of studentsModels) {
            // Each student applies to 1-2 jobs
            const numApps = Math.floor(Math.random() * 2) + 1;
            const shuffledJobs = jobModels.sort(() => 0.5 - Math.random());
            const selectedJobs = shuffledJobs.slice(0, numApps);

            for (const job of selectedJobs) {
                // Fetch company from job (since job.companyId is just an ID)
                // Or we can just use job.companyId directly

                await Application.create({
                    studentId: student._id,
                    jobId: job._id,
                    companyId: job.companyId,
                    status: ['Submitted', 'Shortlisted', 'Rejected'][Math.floor(Math.random() * 3)],
                    resumeSnapshot: {
                        url: student.resume.url,
                        parsedSkills: student.skills,
                        matchScore: Math.floor(Math.random() * 40) + 60
                    }
                });
            }
        }
        console.log("✅ Created Applications");

        console.log("🎉 Data Seeding Completed Successfully!");
        process.exit();

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        console.error(error.message); // Print concise message
        if (error.errors) console.error(JSON.stringify(error.errors, null, 2)); // Print validation details
        process.exit(1);
    }
};

seedData();
