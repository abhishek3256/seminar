import React from 'react';
import { Bell, Menu, Search, Upload } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
    const location = useLocation();

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/dashboard': return 'Dashboard';
            case '/jobs': return 'Job Openings';
            case '/applications': return 'My Applications';
            case '/schedule': return 'Schedule';
            case '/profile': return 'My Profile';
            default: return 'Campus Placement';
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 h-16 px-4 lg:px-8 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-400 hover:text-white rounded-lg lg:hidden hover:bg-slate-800 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-white">{getPageTitle(location.pathname)}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 w-64 focus-within:border-blue-500/50 transition-colors">
                    <Search size={18} className="text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
                    />
                </div>

                <div className="relative">
                    <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse border border-slate-900"></span>
                    </button>
                </div>

                {/* CTA Button */}
                <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all">
                    <Upload size={16} />
                    <span>Upload Resume</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
