import { useState, useEffect } from 'react';
import { Search, MapPin, Building, DollarSign, Briefcase, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import { mockJobs } from '../data/mockJobsData';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const Jobs = () => {
    const [jobs, setJobs] = useState(mockJobs);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterLocation, setFilterLocation] = useState('All');
    const [savedJobs, setSavedJobs] = useState([]);

    // Load saved jobs from localStorage
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(saved);
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/student/jobs');
                if (res.data.success) {
                    setJobs(res.data.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Get unique locations for filter
    const locations = ['All', ...new Set(mockJobs.map(job => job.location))];

    const filteredJobs = jobs.filter(job => {
        const companyName = job.companyId?.companyName || '';
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            companyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || job.type === filterType;
        const matchesLocation = filterLocation === 'All' || job.location === filterLocation;
        return matchesSearch && matchesType && matchesLocation;
    });

    const toggleBookmark = (job) => {
        const isBookmarked = savedJobs.some(saved => saved.id === job.id);
        let updated;
        if (isBookmarked) {
            updated = savedJobs.filter(saved => saved.id !== job.id);
        } else {
            updated = [...savedJobs, job];
        }
        setSavedJobs(updated);
        localStorage.setItem('savedJobs', JSON.stringify(updated));
    };

    const isJobSaved = (jobId) => savedJobs.some(saved => saved.id === jobId);

    const getCompanyName = (job) => {
        if (!job.companyId) return "Unknown Company";
        if (typeof job.companyId === 'string') return job.companyId;
        return job.companyId.companyName || "Unknown Company";
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen pt-40 pb-8 px-8" style={{ position: 'relative', zIndex: 1 }}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
                    >
                        Find Your Dream Job
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 mt-2"
                    >
                        Explore {jobs.length} opportunities from top companies
                    </motion.p>
                </div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-panel rounded-xl p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 min-w-[150px] cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                        <select
                            className="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 min-w-[150px] cursor-pointer"
                            value={filterLocation}
                            onChange={(e) => setFilterLocation(e.target.value)}
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                        <Filter size={14} />
                        <span>Showing {filteredJobs.length} of {jobs.length} jobs</span>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="text-center text-slate-500 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        Loading jobs...
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredJobs.map(job => (
                                <motion.div
                                    key={job.id || job._id}
                                    variants={cardVariants}
                                    layout
                                    className="glass-card rounded-xl p-6 group relative"
                                >
                                    {/* Bookmark Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleBookmark(job); }}
                                        className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition z-10"
                                        title={isJobSaved(job.id) ? "Remove from saved" : "Save job"}
                                    >
                                        {isJobSaved(job.id) ? (
                                            <BookmarkCheck size={18} className="text-blue-400" />
                                        ) : (
                                            <Bookmark size={18} className="text-slate-400" />
                                        )}
                                    </button>

                                    <div className="flex justify-between items-start mb-4 pr-12">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition line-clamp-1">
                                                {job.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm flex items-center mt-1">
                                                <Building size={14} className="mr-1 flex-shrink-0" />
                                                <span className="line-clamp-1">
                                                    {getCompanyName(job)}
                                                </span>
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ml-2 flex-shrink-0 ${job.type === 'Internship' ? 'bg-green-500/20 text-green-300' :
                                            job.type === 'Full-time' ? 'bg-blue-500/20 text-blue-300' :
                                                'bg-slate-700 text-slate-300'
                                            }`}>
                                            {job.type}
                                        </span>
                                    </div>

                                    {job.description && (
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            {job.description}
                                        </p>
                                    )}

                                    <div className="flex flex-col gap-2 text-sm text-slate-500 mb-6">
                                        <span className="flex items-center">
                                            <MapPin size={14} className="mr-2 flex-shrink-0" />
                                            <span className="line-clamp-1">{job.location}</span>
                                        </span>
                                        <span className="flex items-center">
                                            <DollarSign size={14} className="mr-2 flex-shrink-0" />
                                            <span className="line-clamp-1">{job.salaryRange}</span>
                                        </span>
                                    </div>

                                    <button className="btn-primary w-full py-2.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                        Apply Now
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 text-slate-500"
                    >
                        <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No jobs found matching your criteria.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
