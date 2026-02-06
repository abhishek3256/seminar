import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-slate-950 flex font-sans text-slate-200 selection:bg-blue-500/30 overflow-hidden">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-6 pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
