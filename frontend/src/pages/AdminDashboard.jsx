import { useState, useEffect } from 'react';
import { Users, Briefcase, Building2, TrendingUp, Edit, Trash2, Search, Plus, X, Save } from 'lucide-react';

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
            setError(null); // Clear previous errors
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            
            if (!token || !userStr) {
                setError('No authentication token found. Please log in again.');
                setLoading(false);
                // Clear any invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return;
            }

            // Check if user has admin role
            let user = null;
            try {
                user = JSON.parse(userStr);
            } catch (e) {
                console.error('Error parsing user:', e);
                setError('Invalid user data. Please log in again.');
                setLoading(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return;
            }

            if (!user || user.role !== 'admin') {
                setError(`Access denied. Admin role required. Your current role: ${user?.role || 'Not assigned'}. Please log in with an admin account.`);
                setLoading(false);
                return;
            }

            // Validate token format (basic check)
            if (token.split('.').length !== 3) {
                setError('Invalid token format. Please log in again.');
                setLoading(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                return;
            }

            const response = await fetch('http://localhost:5000/api/admin/stats', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = { message: response.statusText };
                }
                
                if (response.status === 401) {
                    const errorMsg = errorData.message || 'Authentication failed';
                    setError(`Authentication failed: ${errorMsg}. Please log in again.`);
                    // Clear invalid token
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                } else if (response.status === 403) {
                    setError(`Access denied: ${errorData.message || 'Admin role required'}`);
                } else {
                    setError(`Server error (HTTP ${response.status}): ${errorData.message || response.statusText}`);
                }
                setLoading(false);
                return;
            }

            const data = await response.json();
            setStats(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                setError('Cannot connect to server. Make sure the backend is running on port 5000.');
            } else {
                setError(error.message || 'Failed to load admin dashboard. Please try again.');
            }
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'companies', label: 'Companies', icon: Building2 },
    ];

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading Admin Dashboard...</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20 p-8">
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 max-w-2xl">
                    <div className="text-6xl mb-4 text-center">⚠️</div>
                    <h1 className="text-2xl font-bold text-white mb-4 text-center">Error Loading Dashboard</h1>
                    <p className="text-red-400 mb-4 text-center">{error}</p>
                    <div className="bg-slate-950 p-4 rounded-lg mb-4">
                        <p className="text-sm text-slate-400">Troubleshooting:</p>
                        <ul className="text-sm text-slate-300 mt-2 space-y-1">
                            <li>• Make sure backend is running on port 5000</li>
                            <li>• Check if you're logged in as admin</li>
                            <li>• Try refreshing the page</li>
                        </ul>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchStats}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition text-white font-medium"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition text-white font-medium"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your campus placement platform</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${activeTab === tab.id
                                            ? 'border-purple-500 text-purple-400'
                                            : 'border-transparent text-slate-400 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto p-6">
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'jobs' && <JobsTab />}
                {activeTab === 'companies' && <CompaniesTab />}
            </div>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">No statistics available</p>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Users', value: stats.stats?.totalUsers || 0, icon: Users, color: 'blue' },
        { label: 'Students', value: stats.stats?.totalStudents || 0, icon: Users, color: 'green' },
        { label: 'Companies', value: stats.stats?.totalCompanies || 0, icon: Building2, color: 'purple' },
        { label: 'Active Jobs', value: stats.stats?.totalJobs || 0, icon: Briefcase, color: 'orange' },
    ];

    return (
        <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-${stat.color}-500/20 rounded-lg`}>
                                    <Icon className={`text-${stat.color}-400`} size={24} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-slate-400 text-sm">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Users</h3>
                    <div className="space-y-3">
                        {stats.recentActivity?.recentUsers?.length > 0 ? (
                            stats.recentActivity.recentUsers.map(user => (
                                <div key={user._id} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-slate-400">{user.email}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                            user.role === 'company' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-green-500/20 text-green-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-4">No recent users</p>
                        )}
                    </div>
                </div>

                {/* Recent Jobs */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Recent Jobs</h3>
                    <div className="space-y-3">
                        {stats.recentActivity?.recentJobs?.length > 0 ? (
                            stats.recentActivity.recentJobs.map(job => (
                                <div key={job._id} className="p-3 bg-slate-800 rounded-lg">
                                    <p className="font-medium">{job.title}</p>
                                    <p className="text-sm text-slate-400">{job.company?.industry || 'N/A'} • {job.location}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-4">No recent jobs</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Users Tab Component
const UsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [currentPage, search, roleFilter]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const queryParams = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(search && { search }),
                ...(roleFilter && { role: roleFilter })
            });

            const response = await fetch(`http://localhost:5000/api/admin/users?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) return <div className="text-center py-8">Loading users...</div>;

    return (
        <div>
            {/* Search and Filter */}
            <div className="mb-6 flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                >
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="company">Company</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-800">
                        <tr>
                            <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                            <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                            <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                            <th className="text-left p-4 text-slate-400 font-medium">Created</th>
                            <th className="text-right p-4 text-slate-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user._id} className="hover:bg-slate-800/50 transition">
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4 text-slate-400">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' :
                                                user.role === 'company' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-green-500/20 text-green-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 hover:bg-slate-700 rounded-lg transition"
                                            >
                                                <Trash2 size={18} className="text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition ${currentPage === page
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// Jobs Tab - Placeholder
const JobsTab = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Briefcase size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-2xl font-bold mb-2">Job Management</h3>
            <p className="text-slate-400 mb-6">Full CRUD operations for job postings</p>
            <p className="text-sm text-slate-500">Feature coming soon...</p>
        </div>
    );
};

// Companies Tab - Placeholder
const CompaniesTab = () => {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
            <Building2 size={64} className="mx-auto mb-4 text-slate-600" />
            <h3 className="text-2xl font-bold mb-2">Company Management</h3>
            <p className="text-slate-400 mb-6">Manage company profiles and information</p>
            <p className="text-sm text-slate-500">Feature coming soon...</p>
        </div>
    );
};

export default AdminDashboard;
