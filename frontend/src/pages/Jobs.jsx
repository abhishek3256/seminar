import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building, DollarSign, Briefcase, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import Layout from '../components/layout/Layout';
import JobCard from '../components/dashboard/JobCard';
import { mockJobs } from '../data/mockJobsData';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/student/jobs');
                if (res.data.success) {
                    setJobs(res.data.data);
                } else {
                    setJobs(mockJobs);
                }
            } catch (error) {
                console.error("Failed to fetch jobs", error);
                setJobs(mockJobs);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Get unique locations
    const locations = ['All', ...new Set(jobs.map(job => job.location).filter(Boolean))];

    const filteredJobs = jobs.filter(job => {
        const companyName = job.companyId?.companyName || (typeof job.company === 'string' ? job.company : job.company?.name) || '';
        const title = job.title || '';

        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || (job.type || job.jobType) === filterType;
        const matchesLocation = filterLocation === 'All' || job.location === filterLocation;

        return matchesSearch && matchesType && matchesLocation;
    });

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Openings</h1>
                    <p className="text-slate-400">Find and apply to valid opportunities from top companies.</p>
                </div>

                {/* Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by role or company..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 text-sm cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 text-slate-200 text-sm cursor-pointer min-w-[140px]"
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Showing {filteredJobs.length} jobs</span>
                    {(searchTerm || filterType !== 'All' || filterLocation !== 'All') && (
                        <button
                            onClick={() => { setSearchTerm(''); setFilterType('All'); setFilterLocation('All'); }}
                            className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                            <X size={14} /> Clear Filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredJobs.map(job => (
                                <JobCard
                                    key={job._id || job.id}
                                    companyName={job.companyId?.companyName || (typeof job.company === 'string' ? job.company : job.company?.name) || "Unknown"}
                                    companyLogo={job.companyId?.logo}
                                    jobTitle={job.title}
                                    jobType={job.type || job.jobType || "Full-time"}
                                    salary={job.salaryRange || job.salary || "Negotiable"}
                                    location={job.location}
                                    postedDate="Recently"
                                    onApply={() => { }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                        <Briefcase size={48} className="mx-auto text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-300">No jobs found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search criteria</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Jobs;
