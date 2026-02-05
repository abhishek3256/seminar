import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, MapPin, DollarSign, Building, Trash2, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(saved);
    }, []);

    const removeJob = (jobId) => {
        const updated = savedJobs.filter(job => job.id !== jobId);
        setSavedJobs(updated);
        localStorage.setItem('savedJobs', JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <BookmarkCheck size={36} className="text-blue-400" />
                        Saved Jobs
                    </h1>
                    <p className="text-slate-400 mt-2">Your bookmarked opportunities ({savedJobs.length})</p>
                </div>

                {savedJobs.length === 0 ? (
                    <div className="text-center py-20">
                        <Bookmark size={64} className="mx-auto mb-4 text-slate-600" />
                        <h2 className="text-2xl font-bold text-slate-400 mb-2">No Saved Jobs Yet</h2>
                        <p className="text-slate-500 mb-6">Start bookmarking jobs you're interested in!</p>
                        <a
                            href="/jobs"
                            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg transition shadow-lg"
                        >
                            Browse Jobs
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition duration-300 group relative"
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={() => removeJob(job.id)}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-red-600 rounded-lg transition"
                                    title="Remove from saved"
                                >
                                    <Trash2 size={16} />
                                </button>

                                <div className="flex justify-between items-start mb-4 pr-10">
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
                                            job.type === 'Part-time' ? 'bg-yellow-500/20 text-yellow-300' :
                                                'bg-slate-700 text-slate-300'
                                        }`}>
                                        {job.type}
                                    </span>
                                </div>

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
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
