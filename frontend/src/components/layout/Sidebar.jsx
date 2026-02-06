import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Calendar,
    User,
    Settings,
    LogOut,
    X,
    BookOpen,
    Brain,
    PenTool,
    CheckSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Job Openings', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
        { name: 'Schedule', path: '/schedule', icon: Calendar },
        { name: 'Skill Quizzes', path: '/quizzes', icon: CheckSquare },
        { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
        { name: 'AI Interview', path: '/ai-interview-prep', icon: Brain },
        { name: 'Resources', path: '/study-materials', icon: BookOpen },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:block flex-shrink-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            CampusAI
                        </span>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="p-4 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => window.innerWidth < 1024 && onClose()}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                                }
                            `}
                        >
                            <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                            <span className="font-medium">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Section (User Profile & Logout) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-slate-400 truncate capitalize">{user?.role || 'Student'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
