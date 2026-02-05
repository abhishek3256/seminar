import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, FileText, TrendingUp } from 'lucide-react';
import { mockJobs, mockStats } from '../data/mockJobsData';

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to prevent infinite loading
        const loadingTimeout = setTimeout(() => {
            console.warn('Dashboard loading timeout - using mock data');
            setLoading(false);
        }, 3000); // 3 second timeout

        // Try to fetch from backend, fallback to mock data
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch('http://localhost:5000/api/dashboard/stats', {
            headers: headers
        })
            .then(res => {
                clearTimeout(loadingTimeout); // Clear timeout on success
                if (!res.ok) {
                    throw new Error('Unauthorized or server error');
                }
                return res.json();
            })
            .then(data => {
                if (data.stats) {
                    // Merge with defaults to ensure all properties exist
                    const mergedStats = {
                        students: 0,
                        companies: 0,
                        jobs: 0,
                        applications: 0,
                        ...mockStats,
                        ...data.stats
                    };
                    setStats(mergedStats);
                    if (data.recentJobs && data.recentJobs.length > 0) {
                        setRecentJobs(data.recentJobs);
                        setAllJobs(data.recentJobs);
                    }
                }
                setLoading(false);
            })
            .catch(err => {
                clearTimeout(loadingTimeout); // Clear timeout on error
                console.log("Using mock data (backend unavailable or unauthorized):", err.message);
                setLoading(false);
            });

        // Cleanup timeout on unmount
        return () => clearTimeout(loadingTimeout);
    }, []);

    const displayedJobs = showAll ? allJobs : recentJobs;

    if (loading) return (
        <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
            <div className="text-white text-xl">Loading Dashboard...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard icon={<Users className="text-blue-400" />} title="Students" value={stats.students} />
                <StatCard icon={<Building2 className="text-purple-400" />} title="Companies" value={stats.companies} />
                <StatCard icon={<Briefcase className="text-green-400" />} title="Active Jobs" value={stats.jobs} />
                <StatCard icon={<FileText className="text-yellow-400" />} title="Applications" value={stats.applications} />
            </div>

            {/* Recent Jobs Section */}
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
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
                            <tr className="text-slate-400 border-b border-slate-800">
                                <th className="pb-3 pl-2">Job Title</th>
                                <th className="pb-3">Company</th>
                                <th className="pb-3">Location</th>
                                <th className="pb-3">Type</th>
                                <th className="pb-3">Salary</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {displayedJobs.map((job) => (
                                <tr key={job.id || job._id} className="hover:bg-slate-800/50 transition">
                                    <td className="py-4 pl-2 font-medium">{job.title}</td>
                                    <td className="py-4 text-slate-300">{job.company?.name || job.company || "Unknown"}</td>
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
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 flex items-center space-x-4">
        <div className="p-3 bg-slate-800 rounded-lg">{icon}</div>
        <div>
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

export default Dashboard;
