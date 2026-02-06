import React, { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, FileText, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import StatsCard from '../components/Dashboard/StatsCard';
import JobCard from '../components/Dashboard/JobCard';
import InterviewCard from '../components/Dashboard/InterviewCard';
import { mockJobs } from '../data/mockJobsData';

const Dashboard = () => {
    const [stats, setStats] = useState({
        activeOpenings: 0,
        applications: 0,
        interviews: 0,
        offers: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [upcomingInterviews, setUpcomingInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsResponse, jobsResponse, appsResponse] = await Promise.all([
                    api.get('/student/dashboard/stats'),
                    api.get('/student/jobs'),
                    api.get('/student/applications'),
                ]);

                const statsData = statsResponse.data.data || {};
                const jobsData = jobsResponse.data.data || [];
                const appsData = appsResponse.data.data || [];

                const activeJobsCount = jobsData.length;

                // Calculate derived stats
                const interviewsCount = appsData.filter(
                    (app) =>
                        app.status === 'Interview Scheduled' ||
                        app.status === 'AI Interview Scheduled'
                ).length;
                const offersCount = appsData.filter(
                    (app) =>
                        app.status === 'Offer Extended' ||
                        app.status === 'Offer Accepted'
                ).length;

                setStats({
                    activeOpenings: activeJobsCount,
                    applications: statsData.totalApplications || 0,
                    interviews: interviewsCount,
                    offers: offersCount,
                });

                setRecentJobs(jobsData.slice(0, 4)); // Top 4 jobs

                // Mock Interviews for now if not sufficient real data
                if (interviewsCount > 0) {
                    // In real app, we would map real scheduled interviews here
                    setUpcomingInterviews([
                        { id: 1, companyName: 'TechCorp', type: 'Technical Round', date: 'Today', time: '2:00 PM', color: 'blue' },
                        { id: 2, companyName: 'StartUp Inc', type: 'HR Discussion', date: 'Tomorrow', time: '11:30 AM', color: 'green' },
                    ]);
                } else {
                    // Fallback mock for UI demonstration
                    setUpcomingInterviews([
                        { id: 1, companyName: 'Google', type: 'System Design', date: 'Oct 24', time: '10:00 AM', color: 'purple' },
                        { id: 2, companyName: 'Microsoft', type: 'Coding Round', date: 'Oct 26', time: '2:00 PM', color: 'blue' },
                        { id: 3, companyName: 'Amazon', type: 'Bar Raiser', date: 'Oct 28', time: '11:00 AM', color: 'green' },
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
                // Fallbacks for dev/demo only
                setRecentJobs(mockJobs.slice(0, 4));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <Layout>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-8"
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        icon={Briefcase}
                        title="Active Openings"
                        value={stats.activeOpenings}
                        trend="+12%"
                        trendColor="text-green-400"
                        iconBgColor="bg-blue-600"
                    />
                    <StatsCard
                        icon={FileText}
                        title="Applications"
                        value={stats.applications}
                        trend="8 Pending"
                        trendColor="text-yellow-400"
                        iconBgColor="bg-purple-600"
                    />
                    <StatsCard
                        icon={Calendar}
                        title="Interviews"
                        value={stats.interviews}
                        trend="3 This Week"
                        trendColor="text-blue-400"
                        iconBgColor="bg-green-600"
                    />
                    <StatsCard
                        icon={Users}
                        title="Offers"
                        value={stats.offers}
                        trend="2 New"
                        trendColor="text-green-400"
                        iconBgColor="bg-yellow-600"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Job Openings (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="text-blue-400" size={20} />
                                Recent Job Openings
                            </h2>
                            <button
                                className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                                onClick={() => navigate('/jobs')}
                            >
                                View All Jobs <ArrowRight size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {recentJobs.map(job => (
                                <JobCard
                                    key={job._id || job.id}
                                    companyName={job.companyId?.companyName || job.company || "Unknown Company"}
                                    companyLogo={job.companyId?.logo} // Assuming logo exists
                                    jobTitle={job.title}
                                    jobType={job.jobType || job.type || "Full-time"}
                                    salary={job.salary || job.salaryRange || "Not Disclosed"}
                                    location={job.location}
                                    postedDate="2 days ago" // Mock or calc from createdAt
                                    onApply={() => { }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Interviews Sidebar (1/3 width) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Calendar className="text-purple-400" size={20} />
                                Upcoming Interviews
                            </h2>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            {upcomingInterviews.map(interview => (
                                <InterviewCard
                                    key={interview.id}
                                    companyName={interview.companyName}
                                    interviewType={interview.type}
                                    date={interview.date}
                                    time={interview.time}
                                    color={interview.color}
                                />
                            ))}

                            <button className="w-full mt-4 py-2 border border-purple-500/30 text-purple-400 rounded-lg text-sm font-medium hover:bg-purple-500/10 transition-colors">
                                View Full Calendar
                            </button>
                        </div>

                        {/* Quick Tips or AI Helper (Optional Addition) */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-xl p-6">
                            <h3 className="font-bold text-white mb-2">Resume Score</h3>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-4xl font-bold text-blue-400">85</span>
                                <span className="text-slate-400 mb-1">/ 100</span>
                            </div>
                            <p className="text-sm text-slate-400 mb-4">Your resume is looking good! Add more projects to reach 90+.</p>
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors w-full">
                                Improve Resume
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Layout>
    );
};

export default Dashboard;
