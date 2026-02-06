import React from 'react';
import Layout from '../components/layout/Layout';
import { Calendar } from 'lucide-react';

const PlacementCalendar = () => {
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Calendar className="text-blue-400" size={28} />
                    <div>
                        <h1 className="text-3xl font-bold text-white">Placement Calendar</h1>
                        <p className="text-slate-400">
                            View important placement dates, interviews, and company visit schedules.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-300">
                    <p className="mb-2">
                        This is a placeholder calendar view. You can extend this page later with a full
                        calendar component and real schedule data from the backend.
                    </p>
                    <p className="text-sm text-slate-500">
                        For now, the route is wired correctly so the navigation link works and the layout
                        remains consistent with the rest of the dashboard.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default PlacementCalendar;

