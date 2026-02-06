import React, { useState, useEffect } from 'react';
import { FileText, MoreVertical, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import api from '../api/axios';

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/student/applications');
                if (res.data.success) {
                    setApplications(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Under Review': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Interview Scheduled': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Offer Extended': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-slate-700 text-slate-300 border-slate-600';
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
                    <p className="text-slate-400">Track the status of your job applications.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Company & Role</th>
                                    <th className="px-6 py-4">Applied On</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {applications.length > 0 ? (
                                    applications.map((app) => (
                                        <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-white">
                                                        {app.jobId?.title || 'Unknown Role'}
                                                    </p>
                                                    <p className="text-sm text-slate-400">
                                                        {app.jobId?.companyId?.companyName || 'Unknown Company'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300 text-sm">
                                                {new Date(app.appliedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-slate-400 hover:text-white transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                            <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                            <p>No applications yet.</p>
                                            <p className="text-sm mt-1">Start applying to jobs to see them here.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Applications;
