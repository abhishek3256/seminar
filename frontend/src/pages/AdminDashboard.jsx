import { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, TrendingUp, Edit, Trash2, Search, Plus, X, Save, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
            setError("Failed to load dashboard data");
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'companies', label: 'Companies', icon: Building2 },
    ];

    if (loading && !stats) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12 px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Admin Dashboard
                </h1>
                <p className="text-slate-400 mt-1">Manage platform users, companies, and content</p>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto mb-8 bg-slate-900 border border-slate-800 rounded-xl p-1 flex overflow-x-auto">
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto">
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'jobs' && <JobsTab />}
                {activeTab === 'companies' && <CompaniesTab />}
            </div>
        </div>
    );
};

// Overview Tab
const OverviewTab = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        { label: 'Total Users', value: (stats.users?.students || 0) + (stats.users?.companies || 0), icon: Users, color: 'blue' },
        { label: 'Students', value: stats.users?.students || 0, icon: GraduationCap, color: 'green' },
        { label: 'Companies', value: stats.users?.companies || 0, icon: Building2, color: 'purple' },
        { label: 'Active Jobs', value: stats.jobs?.active || 0, icon: Briefcase, color: 'orange' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, idx) => {
                const Icon = card.icon; // Handle different icons if imported
                return (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-${card.color}-500/20 rounded-lg`}>
                                {/* Fallback icon if not defined */}
                                <Users className={`text-${card.color}-400`} size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-1">{card.value}</h3>
                        <p className="text-slate-400 text-sm">{card.label}</p>
                    </div>
                );
            })}
        </div>
    );
};
// Add GraduationCap import to make the above work, or use Users for all.
import { GraduationCap } from 'lucide-react'; // Adding this import to top level


// Users Tab
const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
            fetchUsers(); // Refresh
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                        <th className="p-4 font-medium text-slate-400">User</th>
                        <th className="p-4 font-medium text-slate-400">Role</th>
                        <th className="p-4 font-medium text-slate-400">Status</th>
                        <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {users.map(user => (
                        <tr key={user._id} className="hover:bg-slate-800/50 transition">
                            <td className="p-4">
                                <p className="font-bold text-white">{user.name || 'No Name'}</p>
                                <p className="text-sm text-slate-400">{user.email}</p>
                            </td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs capitalize ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                        user.role === 'company' ? 'bg-blue-500/20 text-blue-300' :
                                            'bg-green-500/20 text-green-300'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <span className={`flex items-center gap-1.5 text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                    <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                                    {user.isActive ? 'Active' : 'Blocked'}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => toggleStatus(user._id, user.isActive)}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${user.isActive
                                            ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                        }`}
                                >
                                    {user.isActive ? 'Block' : 'Activate'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Companies Tab (Verification)
const CompaniesTab = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await api.get('/admin/companies');
            setCompanies(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch companies", error);
        }
    };

    const verifyCompany = async (companyId, currentStatus) => {
        try {
            await api.put(`/admin/companies/${companyId}/verify`, { isVerified: !currentStatus });
            fetchCompanies();
        } catch (error) {
            console.error("Failed to verify", error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading companies...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                        <th className="p-4 font-medium text-slate-400">Company</th>
                        <th className="p-4 font-medium text-slate-400">Contact</th>
                        <th className="p-4 font-medium text-slate-400">Verification</th>
                        <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {companies.map(company => (
                        <tr key={company._id} className="hover:bg-slate-800/50 transition">
                            <td className="p-4">
                                <p className="font-bold text-white">{company.companyName}</p>
                                <p className="text-sm text-slate-400">{company.industry}</p>
                            </td>
                            <td className="p-4 text-sm text-slate-400">
                                <p>{company.companyEmail}</p>
                                <p>{company.hrName}</p>
                            </td>
                            <td className="p-4">
                                {company.isVerified ? (
                                    <span className="flex items-center text-green-400 text-sm gap-1">
                                        <CheckCircle size={16} /> Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center text-yellow-400 text-sm gap-1">
                                        <Loader2 size={16} className="animate-spin" /> Pending
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => verifyCompany(company._id, company.isVerified)}
                                    className={`px-3 py-1.5 rounded text-xs font-medium transition ${company.isVerified
                                            ? 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20'
                                        }`}
                                >
                                    {company.isVerified ? 'Revoke' : 'Verify Now'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Jobs Tab (Moderation)
const JobsTab = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/admin/jobs');
            setJobs(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        }
    };

    const deleteJob = async (jobId) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            await api.delete(`/admin/jobs/${jobId}`);
            fetchJobs();
        } catch (error) {
            console.error("Failed to delete job", error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading jobs...</div>;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-800 border-b border-slate-700">
                    <tr>
                        <th className="p-4 font-medium text-slate-400">Job Title</th>
                        <th className="p-4 font-medium text-slate-400">Company</th>
                        <th className="p-4 font-medium text-slate-400">Posted</th>
                        <th className="p-4 font-medium text-slate-400 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {jobs.map(job => (
                        <tr key={job._id} className="hover:bg-slate-800/50 transition">
                            <td className="p-4">
                                <p className="font-bold text-white">{job.title}</p>
                                <span className={`text-xs px-2 py-0.5 rounded ${job.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {job.isActive ? 'Active' : 'Closed'}
                                </span>
                            </td>
                            <td className="p-4 text-slate-300">
                                {job.companyId?.companyName || 'Unknown Corp'}
                            </td>
                            <td className="p-4 text-sm text-slate-400">
                                {new Date(job.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => deleteJob(job._id)}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-red-400 transition"
                                    title="Delete Job"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
