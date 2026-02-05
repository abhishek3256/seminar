import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, Users, Plus, TrendingUp, MapPin, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';

const CompanyDashboard = () => {
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplications: 0,
        views: 0 // Placeholder
    });
    const [jobs, setJobs] = useState([]);
    const [companyProfile, setCompanyProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Profile
                const profileRes = await api.get('/company/profile');
                if (profileRes.data.success) {
                    setCompanyProfile(profileRes.data.data);
                }

                // Fetch Jobs
                const jobsRes = await api.get('/company/jobs');
                if (jobsRes.data.success) {
                    const companyJobs = jobsRes.data.data;
                    setJobs(companyJobs);

                    // Calculate stats
                    const totalApps = companyJobs.reduce((sum, job) => sum + (job.totalApplications || 0), 0);
                    // Filter active jobs based on some criteria? (e.g. isActive flag if exists, or just all for now)
                    // Job model has isActive default true.
                    const activeCount = companyJobs.filter(j => j.isActive).length;

                    setStats({
                        activeJobs: activeCount,
                        totalApplications: totalApps,
                        views: 145 // Mock value
                    });
                }
            } catch (error) {
                console.error("Failed to fetch company dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Building2 className="text-blue-500" />
                            {companyProfile?.companyName || 'Company'} Dashboard
                        </h1>
                        <p className="text-slate-400 mt-2">Manage your job postings and view applications</p>
                    </div>
                    <Link
                        to="/company/post-job"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition shadow-lg shadow-blue-500/20 font-medium"
                    >
                        <Plus size={20} />
                        Post New Job
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        icon={<Briefcase className="text-blue-400" />}
                        title="Active Jobs"
                        value={stats.activeJobs}
                        color="bg-blue-500/10 border-blue-500/20"
                    />
                    <StatCard
                        icon={<Users className="text-purple-400" />}
                        title="Total Applications"
                        value={stats.totalApplications}
                        color="bg-purple-500/10 border-purple-500/20"
                    />
                    <StatCard
                        icon={<TrendingUp className="text-green-400" />}
                        title="Profile Views"
                        value={stats.views}
                        color="bg-green-500/10 border-green-500/20"
                    />
                </div>

                {/* Jobs List */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Job Postings</h2>
                    </div>

                    {jobs.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Briefcase className="mx-auto w-12 h-12 mb-4 opacity-50" />
                            <p className="text-lg mb-4">No jobs posted yet</p>
                            <Link to="/company/post-job" className="text-blue-400 hover:underline">Create your first job posting</Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {jobs.map((job) => (
                                <div key={job._id} className="p-6 hover:bg-slate-800/50 transition flex flex-col md:flex-row justify-between gap-4 group">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">{job.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded border ${job.isActive ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-700 text-slate-400 border-slate-600'}`}>
                                                {job.isActive ? 'Active' : 'Closed'}
                                            </span>
                                            <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">{job.type}</span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-2">
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                            <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salaryRange}</span>
                                            <span className="flex items-center gap-1"><Calendar size={14} /> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-center px-4">
                                            <div className="text-xl font-bold text-white mb-0.5">{job.totalApplications}</div>
                                            <div className="text-xs text-slate-500 uppercase tracking-wider">Applicants</div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/company/jobs/${job._id}`}
                                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition"
                                            >
                                                Manage
                                            </Link>
                                            {/* Link to view applications specifically? */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className={`p-6 rounded-xl border ${color} bg-opacity-50 backdrop-blur-sm`}
    >
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-slate-950/30 rounded-lg">{icon}</div>
        </div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-slate-400 text-sm">{title}</p>
    </motion.div>
);

export default CompanyDashboard;
