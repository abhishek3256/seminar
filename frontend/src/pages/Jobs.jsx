import { useState, useEffect } from 'react';
import { Search, MapPin, Building, DollarSign, Briefcase, Filter, Bookmark, BookmarkCheck } from 'lucide-react';
import { mockJobs } from '../data/mockJobsData';

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
        // Try to fetch from backend, fallback to mock data
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch('http://localhost:5000/api/jobs', {
            headers: headers
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unauthorized or server error');
                }
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setJobs(data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.log("Using mock data (backend unavailable or unauthorized)");
                setLoading(false);
            });
    }, []);

    // Get unique locations for filter
    const locations = ['All', ...new Set(mockJobs.map(job => job.location))];

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.company?.name || job.company || '').toLowerCase().includes(searchTerm.toLowerCase());
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

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Find Your Dream Job
                    </h1>
                    <p className="text-slate-400 mt-2">Explore {jobs.length} opportunities from top companies</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 placeholder-slate-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 min-w-[150px]"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Part-time">Part-time</option>
                        </select>
                        <select
                            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 text-slate-200 min-w-[150px]"
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
                </div>

                {loading ? (
                    <div className="text-center text-slate-500 py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        Loading jobs...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map(job => (
                            <div
                                key={job.id || job._id}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300 group relative"
                            >
                                {/* Bookmark Button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); toggleBookmark(job); }}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition z-10"
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
                                            <span className="line-clamp-1">{job.company?.name || job.company}</span>
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

                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 rounded-lg transition shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40">
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredJobs.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <Briefcase size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-lg">No jobs found matching your criteria.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;
