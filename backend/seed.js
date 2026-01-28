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

        // 1. Create Users (Students)
        const studentsData = [
            { name: "Aarav Sharma", email: "aarav@example.com", text: "AS", skills: ["React", "Node.js", "Python"], branch: "CSE" },
            { name: "Sneha Patel", email: "sneha@example.com", text: "SP", skills: ["Java", "SQL", "Spring Boot"], branch: "IT" },
            { name: "Rohan Gupta", email: "rohan@example.com", text: "RG", skills: ["C++", "DSA", "System Design"], branch: "CSE" },
            { name: "Priya Singh", email: "priya@example.com", text: "PS", skills: ["Figma", "UI/UX", "Frontend"], branch: "ECE" },
            { name: "Vikram Malhotra", email: "vikram@example.com", text: "VM", skills: ["Python", "ML", "TensorFlow"], branch: "CSE" },
        ];

        const student users = [];
        const studentsModels = [];

        for (const s of studentsData) {
            const user = await User.create({
                name: s.name,
                email: s.email,
                password: "password123", // Will be hashed by pre-save hook
                role: "student"
            });
            studentUsers.push(user);

            const student = await Student.create({
                user: user._id,
                bio: `Passionate ${s.branch} student skilled in ${s.skills.join(", ")}.`,
                skills: s.skills,
                cgpa: (7 + Math.random() * 3).toFixed(2), // 7.00 - 10.00
                graduationYear: 2025,
                branch: s.branch
            });
            studentsModels.push(student);
        }
        console.log(`✅ Created ${studentsData.length} Students`);

        // 2. Create Users (Companies)
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
                name: c.name,
                email: c.email,
                password: "password123",
                role: "company"
            });

            const company = await Company.create({
                user: user._id,
                industry: c.industry,
                location: c.location,
                description: `Leading company in ${c.industry} based in ${c.location}.`
            });
            companyModels.push(company);
        }
        console.log(`✅ Created ${companiesData.length} Companies`);

        // 3. Create Jobs
        const jobsData = [
            { title: "SDE-1", desc: "Junior Software Developer role.", type: "Full-time", salary: "12-15 LPA" },
            { title: "Frontend Intern", desc: "React.js internship.", type: "Internship", salary: "25k/month" },
            { title: "Data Analyst", desc: "Analyze business metrics.", type: "Full-time", salary: "10-12 LPA" },
            { title: "Backend Engineer", desc: "Node.js & Microservices.", type: "Full-time", salary: "18-22 LPA" },
            { title: "AI Researcher", desc: "Work on LLMs.", type: "Full-time", salary: "25-30 LPA" },
            { title: "Product Manager", desc: "Manage product lifecycle.", type: "Full-time", salary: "15-20 LPA" },
            { title: "DevOps Engineer", desc: "AWS and CI/CD.", type: "Full-time", salary: "14-18 LPA" },
        ];

        const jobModels = [];

        for (const company of companyModels) {
            // Each company posts 1-2 jobs
            const numJobs = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < numJobs; i++) {
                const jobInfo = jobsData[Math.floor(Math.random() * jobsData.length)];
                const job = await Job.create({
                    company: company._id,
                    title: jobInfo.title,
                    description: `${jobInfo.desc} Join ${company.description}`,
                    requirements: ["Bachelor's Degree", "Good Communication"],
                    location: company.location,
                    type: jobInfo.type,
                    salaryRange: jobInfo.salary
                });
                jobModels.push(job);
            }
        }
        console.log(`✅ Created ${jobModels.length} Jobs`);

        // 4. Create Applications
        for (const student of studentsModels) {
            // Each student applies to 2-3 jobs
            const numApps = Math.floor(Math.random() * 3) + 2;
            const shuffledJobs = jobModels.sort(() => 0.5 - Math.random());
            const selectedJobs = shuffledJobs.slice(0, numApps);

            for (const job of selectedJobs) {
                await Application.create({
                    job: job._id,
                    student: student._id,
                    status: ['Applied', 'Shortlisted', 'Rejected'][Math.floor(Math.random() * 3)],
                    aiScore: Math.floor(Math.random() * 100)
                });
            }
        }
        console.log("✅ Created Applications");

        console.log("🎉 Data Seeding Completed Successfully!");
        process.exit();

    } catch (error) {
        console.error("❌ Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
