import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, TrendingUp, CheckCircle, XCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobMatchCard = ({ recommendation, rank }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const { matchScore, matchReason, alignedSkills, missingSkills, growthPotential, job } = recommendation;

    if (!job) return null;

    // Determine match level and color
    const getMatchLevel = (score) => {
        if (score >= 75) return { level: 'High Match', color: 'green', bgColor: 'bg-green-500/20', textColor: 'text-green-400', borderColor: 'border-green-500/50' };
        if (score >= 50) return { level: 'Good Match', color: 'yellow', bgColor: 'bg-yellow-500/20', textColor: 'text-yellow-400', borderColor: 'border-yellow-500/50' };
        return { level: 'Potential Match', color: 'orange', bgColor: 'bg-orange-500/20', textColor: 'text-orange-400', borderColor: 'border-orange-500/50' };
    };

    const matchInfo = getMatchLevel(matchScore);

    const handleApply = () => {
        navigate(`/jobs`); // Navigate to jobs page where they can apply
    };

    return (
        <div className={`bg-slate-900 border ${matchInfo.borderColor} rounded-xl overflow-hidden hover:shadow-lg hover:shadow-${matchInfo.color}-500/20 transition`}>
            {/* Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-slate-500 font-bold text-lg">#{rank}</span>
                            <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                            <div className="flex items-center gap-1">
                                <Briefcase size={16} />
                                <span>{job.company?.name || 'Company'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{job.location}</span>
                            </div>
                            {job.salary && (
                                <div className="flex items-center gap-1">
                                    <DollarSign size={16} />
                                    <span>{job.salary}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Match Score */}
                    <div className={`${matchInfo.bgColor} ${matchInfo.textColor} border ${matchInfo.borderColor} rounded-xl px-6 py-4 text-center min-w-[120px]`}>
                        <div className="text-3xl font-bold">{matchScore}%</div>
                        <div className="text-sm font-medium mt-1">{matchInfo.level}</div>
                    </div>
                </div>

                {/* Match Reason */}
                <div className="bg-slate-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="text-purple-400 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <h4 className="font-semibold text-white mb-1">Why this job?</h4>
                            <p className="text-slate-300 text-sm">{matchReason}</p>
                        </div>
                    </div>
                </div>

                {/* Skills Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Aligned Skills */}
                    {alignedSkills && alignedSkills.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-1">
                                <CheckCircle size={16} />
                                Your Matching Skills
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {alignedSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {missingSkills && missingSkills.length > 0 && (
                        <div>
                            <h4 className="text-sm font-semibold text-orange-400 mb-2 flex items-center gap-1">
                                <XCircle size={16} />
                                Skills to Learn
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/30"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 transition py-2"
                >
                    {expanded ? (
                        <>
                            <span>Show Less</span>
                            <ChevronUp size={20} />
                        </>
                    ) : (
                        <>
                            <span>Show More Details</span>
                            <ChevronDown size={20} />
                        </>
                    )}
                </button>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-slate-800 p-6 bg-slate-950">
                    {/* Growth Potential */}
                    {growthPotential && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                                <TrendingUp className="text-blue-400" size={18} />
                                Growth Potential
                            </h4>
                            <p className="text-slate-300 text-sm">{growthPotential}</p>
                        </div>
                    )}

                    {/* Job Description */}
                    {job.description && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-white mb-2">Job Description</h4>
                            <p className="text-slate-300 text-sm">{job.description}</p>
                        </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-white mb-2">Requirements</h4>
                            <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                                {job.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleApply}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <ExternalLink size={18} />
                            View & Apply
                        </button>
                        <button
                            className="px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition"
                        >
                            Save for Later
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobMatchCard;
