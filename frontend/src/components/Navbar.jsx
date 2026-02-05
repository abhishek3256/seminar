import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, User, LogOut, LayoutDashboard, Bell, Bookmark, ChevronDown, GraduationCap, BookOpen, Trophy, Building2, TrendingUp, Calendar, Sparkles, Brain, FileText } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Use state for token and user so they update reactively
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user') || '{}');
        } catch {
            return {};
        }
    });

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showPrepMenu, setShowPrepMenu] = useState(false);
    const [showResourcesMenu, setShowResourcesMenu] = useState(false);
    const [showAIMenu, setShowAIMenu] = useState(false);

    // Refs for dropdown containers
    const profileRef = useRef(null);
    const prepRef = useRef(null);
    const resourcesRef = useRef(null);
    const aiRef = useRef(null);

    // Function to update auth state
    const updateAuthState = () => {
        const newToken = localStorage.getItem('token');
        const newUserStr = localStorage.getItem('user');

        setToken(newToken);
        try {
            setUser(newUserStr ? JSON.parse(newUserStr) : {});
        } catch {
            setUser({});
        }
    };

    // Update token and user when location changes (after login/logout)
    useEffect(() => {
        updateAuthState();
    }, [location.pathname]);

    // Listen for storage changes and window focus
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user' || e.key === null) {
                updateAuthState();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', updateAuthState);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', updateAuthState);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser({});
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (prepRef.current && !prepRef.current.contains(event.target)) {
                setShowPrepMenu(false);
            }
            if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
                setShowResourcesMenu(false);
            }
            if (aiRef.current && !aiRef.current.contains(event.target)) {
                setShowAIMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Close all menus when navigating
    useEffect(() => {
        setShowProfileMenu(false);
        setShowPrepMenu(false);
        setShowResourcesMenu(false);
        setShowAIMenu(false);
    }, [location.pathname]);

    return (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 text-white p-4 sticky top-0 z-50 backdrop-blur-lg shadow-lg">
            <div className="container mx-auto">
                {/* Top Row */}
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 text-xl font-bold group">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform shadow-lg">
                            <GraduationCap size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                CampusAI
                            </span>
                            <p className="text-xs text-slate-400 font-normal">Placement Portal</p>
                        </div>
                    </Link>

                    {/* Right Side */}
                    <div className="flex items-center space-x-6">
                        {token ? (
                            <>
                                {/* Notifications */}
                                <button className="relative hover:text-blue-400 transition group">
                                    <Bell size={20} />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition">3</span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                                        className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg hover:bg-slate-700 transition border border-slate-700"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                            <span className="text-sm font-bold">{user.name?.charAt(0) || 'U'}</span>
                                        </div>
                                        <span className="hidden md:block font-medium">{user.name || 'User'}</span>
                                        <ChevronDown size={16} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                                            <div className="px-4 py-3 border-b border-slate-700">
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-slate-400">{user.email}</p>
                                            </div>
                                            <Link
                                                to="/profile"
                                                className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-700 transition"
                                            >
                                                <User size={16} />
                                                <span>My Profile</span>
                                            </Link>
                                            <Link
                                                to="/resume-dashboard"
                                                className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-700 transition"
                                            >
                                                <Briefcase size={16} />
                                                <span>Resume Dashboard</span>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    to="/admin"
                                                    className="flex items-center space-x-2 px-4 py-2 hover:bg-purple-600/20 transition border-t border-slate-700"
                                                >
                                                    <LayoutDashboard size={16} className="text-purple-400" />
                                                    <span className="flex items-center gap-2">
                                                        Admin Panel
                                                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">ADMIN</span>
                                                    </span>
                                                </Link>
                                            )}
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-600/20 text-red-400 transition"
                                            >
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition shadow-lg"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Row - Navigation */}
                {token && (
                    <div className="flex items-center space-x-1 mt-4 border-t border-slate-700 pt-3">
                        <Link
                            to="/dashboard"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${isActive('/dashboard') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                                }`}
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>

                        <Link
                            to="/jobs"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${isActive('/jobs') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                                }`}
                        >
                            <Briefcase size={18} />
                            <span>Jobs</span>
                        </Link>

                        <Link
                            to="/saved-jobs"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${isActive('/saved-jobs') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                                }`}
                        >
                            <Bookmark size={18} />
                            <span>Saved Jobs</span>
                        </Link>

                        {/* AI Tools Mega Menu */}
                        <div className="relative" ref={aiRef}>
                            <button
                                onClick={() => setShowAIMenu(!showAIMenu)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${showAIMenu ? 'bg-purple-600/20 border border-purple-500/50' : 'hover:bg-slate-800'
                                    }`}
                            >
                                <Sparkles size={18} className="text-purple-400" />
                                <span>AI Tools</span>
                                <ChevronDown size={16} className={`transition-transform ${showAIMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showAIMenu && (
                                <div className="absolute left-0 mt-2 w-72 bg-slate-800 border border-purple-500/50 rounded-lg shadow-xl overflow-hidden z-50">
                                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-4 py-2 border-b border-purple-500/30">
                                        <p className="text-xs text-purple-300 font-semibold">AI-POWERED FEATURES</p>
                                    </div>

                                    <Link
                                        to="/job-recommendations"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-purple-500/20 p-2 rounded-lg">
                                            <Sparkles size={20} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Job Recommendations</p>
                                            <p className="text-xs text-slate-400">AI-powered job matching</p>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/ai-interview-prep"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <Brain size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Interview Preparation</p>
                                            <p className="text-xs text-slate-400">Practice with AI feedback</p>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/interview-history"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-green-500/20 p-2 rounded-lg">
                                            <TrendingUp size={20} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Interview History</p>
                                            <p className="text-xs text-slate-400">Track your progress</p>
                                        </div>
                                    </Link>

                                    <Link
                                        to="/cover-letter"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition"
                                    >
                                        <div className="bg-pink-500/20 p-2 rounded-lg">
                                            <FileText size={20} className="text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Cover Letter Generator</p>
                                            <p className="text-xs text-slate-400">Create personalized letters</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Preparation Mega Menu */}
                        <div className="relative" ref={prepRef}>
                            <button
                                onClick={() => setShowPrepMenu(!showPrepMenu)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${showPrepMenu ? 'bg-slate-800' : 'hover:bg-slate-800'
                                    }`}
                            >
                                <span>Preparation</span>
                                <ChevronDown size={16} className={`transition-transform ${showPrepMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showPrepMenu && (
                                <div className="absolute left-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                                    <Link
                                        to="/quizzes"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-yellow-500/20 p-2 rounded-lg">
                                            <Trophy size={20} className="text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Aptitude Tests</p>
                                            <p className="text-xs text-slate-400">Practice quizzes</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/interview-prep"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <User size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Interview Prep</p>
                                            <p className="text-xs text-slate-400">Common questions</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/study-materials"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition"
                                    >
                                        <div className="bg-green-500/20 p-2 rounded-lg">
                                            <BookOpen size={20} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Study Materials</p>
                                            <p className="text-xs text-slate-400">Resources & PDFs</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Resources Mega Menu */}
                        <div className="relative" ref={resourcesRef}>
                            <button
                                onClick={() => setShowResourcesMenu(!showResourcesMenu)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${showResourcesMenu ? 'bg-slate-800' : 'hover:bg-slate-800'
                                    }`}
                            >
                                <span>Resources</span>
                                <ChevronDown size={16} className={`transition-transform ${showResourcesMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {showResourcesMenu && (
                                <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                                    {/* Top Companies Section */}
                                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-700">
                                        <p className="text-xs font-semibold text-slate-400 uppercase">Top Recruiters</p>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 p-3 border-b border-slate-700">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Google">
                                            <span className="text-white font-bold text-sm">Google</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Microsoft">
                                            <span className="text-white font-bold text-sm">Microsoft</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Amazon">
                                            <span className="text-white font-bold text-sm">Amazon</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-600 to-yellow-500 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Flipkart">
                                            <span className="text-white font-bold text-sm">Flipkart</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-700 to-purple-600 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="TCS">
                                            <span className="text-white font-bold text-xs">TCS</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Infosys">
                                            <span className="text-white font-bold text-xs">Infosys</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Wipro">
                                            <span className="text-white font-bold text-sm">Wipro</span>
                                        </div>
                                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded p-2 hover:scale-105 transition cursor-pointer flex items-center justify-center" title="Accenture">
                                            <span className="text-white font-bold text-xs">Accenture</span>
                                        </div>
                                    </div>

                                    {/* Menu Links */}
                                    <Link
                                        to="/companies"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-purple-500/20 p-2 rounded-lg">
                                            <Building2 size={20} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">All Companies</p>
                                            <p className="text-xs text-slate-400">View all recruiting companies</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/placement-stats"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition border-b border-slate-700"
                                    >
                                        <div className="bg-green-500/20 p-2 rounded-lg">
                                            <TrendingUp size={20} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Placement Stats</p>
                                            <p className="text-xs text-slate-400">Analytics & data</p>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/placement-calendar"
                                        className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-700 transition"
                                    >
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <Calendar size={20} className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Calendar</p>
                                            <p className="text-xs text-slate-400">Important dates</p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link
                            to="/resume-analyzer"
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${isActive('/resume-analyzer') ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                                }`}
                        >
                            <Briefcase size={18} />
                            <span>Resume Analyzer</span>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
