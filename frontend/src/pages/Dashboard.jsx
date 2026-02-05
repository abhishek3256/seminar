import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { mockJobs, mockStats } from '../data/mockJobsData';
import { motion } from 'framer-motion';
import api from '../api/axios';

const Dashboard = () => {
    // Ensure stats always has default values
    const defaultStats = {
        students: 0,
        companies: 0,
        jobs: 0,
        applications: 0,
        ...mockStats
    };

    const [stats, setStats] = useState(defaultStats);
    const [recentJobs, setRecentJobs] = useState(mockJobs.slice(0, 20)); // Show first 20
    const [allJobs, setAllJobs] = useState(mockJobs);
    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch Stats
                const statsResponse = await api.get('/student/dashboard/stats');
                const statsData = statsResponse.data.data;

                // Fetch Recent Jobs
                const jobsResponse = await api.get('/student/jobs');
                const jobsData = jobsResponse.data.data;

                setStats(prev => ({
                    ...prev,
                    applications: statsData.totalApplications || 0,
                    jobs: jobsData.length || 0,
                    // Map other backend stats if available
                }));

                if (jobsData && jobsData.length > 0) {
                    setRecentJobs(jobsData.slice(0, 5)); // Show top 5 recent
                    setAllJobs(jobsData);
                }

                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);

                // Fallback to mock data for demo purposes if backend fails
                setStats(prev => ({ ...prev, ...mockStats }));
                setRecentJobs(mockJobs.slice(0, 5));
                setAllJobs(mockJobs);

                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const displayedJobs = showAll ? allJobs : recentJobs;



    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-8 px-8" style={{ position: 'relative', zIndex: 1 }}>
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold mb-8 text-white"
            >
                Dashboard Overview
            </motion.h1>

            {/* Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            >
                <StatCard icon={<Users className="text-blue-400" />} title="Students" value={stats.students} variants={itemVariants} />
                <StatCard icon={<Building2 className="text-purple-400" />} title="Companies" value={stats.companies} variants={itemVariants} />
                <StatCard icon={<Briefcase className="text-green-400" />} title="Active Jobs" value={stats.jobs} variants={itemVariants} />
                <StatCard icon={<FileText className="text-yellow-400" />} title="Applications" value={stats.applications} variants={itemVariants} />
            </motion.div>

            {/* Recent Jobs Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-panel rounded-xl p-6"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold flex items-center">
                        <TrendingUp className="mr-2 text-blue-500" /> Recent Job Postings
                    </h2>
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition"
                    >
                        {showAll ? 'Show Less' : `View All (${allJobs.length})`}
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700/50">
                                <th className="pb-3 pl-2">Job Title</th>
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Location</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {displayedJobs.map((job) => (
                                <tr key={job.id || job._id} className="hover:bg-slate-700/30 transition">
                                    <td className="py-4 pl-2 font-medium">{job.title}</td>
                                    <td className="py-4 text-slate-300">
                                        {typeof job.company === 'object' ? (job.company?.name || "Unknown") : (job.company || "Unknown")}
                                    </td>
                                    <td className="py-4 text-slate-400">{job.location}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${job.type === 'Full-time' ? 'bg-blue-500/20 text-blue-300' :
                                            job.type === 'Internship' ? 'bg-green-500/20 text-green-300' :
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-300">{job.salaryRange}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {displayedJobs.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                        No jobs found. Run seed script!
                    </div>
                )}
            </motion.div>
        </div>
    );
};

const StatCard = ({ icon, title, value, variants }) => (
    <motion.div
        variants={variants}
        whileHover={{ y: -5 }}
        className="glass-card p-6 rounded-xl flex items-center space-x-4"
    >
        <div className="p-3 bg-slate-800/50 rounded-lg">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </motion.div>
);

export default Dashboard;
