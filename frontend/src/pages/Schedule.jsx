import React from 'react';
import Layout from '../components/layout/Layout';
import { Calendar as CalendarIcon, Clock, Video } from 'lucide-react';

const Schedule = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Interview Schedule</h1>
                    <p className="text-slate-400">Manage your upcoming interviews and events.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar placeholder */}
                    <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                        <CalendarIcon size={64} className="text-slate-700 mb-4" />
                        <h3 className="text-xl font-bold text-slate-300">Calendar View</h3>
                        <p className="text-slate-500 mt-2">Full calendar integration coming soon.</p>
                    </div>

                    {/* Upcoming List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white mb-4">Upcoming</h2>
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-white">Technical Round</h3>
                                        <p className="text-slate-400 text-sm">TechCorp Inc.</p>
                                    </div>
                                    <div className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">
                                        Today
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        <span>2:00 PM - 3:00 PM</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Video size={14} />
                                        <span className="text-blue-400 underline cursor-pointer">Join Meeting</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Schedule;
