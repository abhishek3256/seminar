import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, CheckCircle, XCircle, Award, Briefcase, Mail, Phone, Calendar, Building2, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { mockCandidates } from '../../data/mockAnalysisData';

const Dashboard = () => {
    const [selectedCandidate, setSelectedCandidate] = useState(mockCandidates[0]);

    // Calculate stats
    const stats = {
        total: mockCandidates.length,
        excellent: mockCandidates.filter(c => c.matchPercentage >= 85).length,
        good: mockCandidates.filter(c => c.matchPercentage >= 70 && c.matchPercentage < 85).length,
        avgMatch: Math.round(mockCandidates.reduce((acc, c) => acc + c.matchPercentage, 0) / mockCandidates.length)
    };

    const getMatchColor = (percentage) => {
        if (percentage >= 85) return 'text-green-600 bg-green-50 border-green-200';
        if (percentage >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
        return 'text-orange-600 bg-orange-50 border-orange-200';
    };

    const getMatchBadgeColor = (percentage) => {
        if (percentage >= 85) return 'bg-green-100 text-green-700';
        if (percentage >= 70) return 'bg-blue-100 text-blue-700';
        return 'bg-orange-100 text-orange-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Resume Analysis Dashboard</h1>
                    <p className="text-gray-600">AI-powered candidate matching and insights</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Candidates</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Excellent Matches</p>
                                <p className="text-3xl font-bold text-green-600 mt-1">{stats.excellent}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Good Matches</p>
                                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.good}</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg">
                                <TrendingUp className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Avg Match Score</p>
                                <p className="text-3xl font-bold text-purple-600 mt-1">{stats.avgMatch}%</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                                <Award className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Candidates List */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Candidates</h2>
                        <div className="space-y-3">
                            {mockCandidates.map((candidate) => (
                                <motion.div
                                    key={candidate.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedCandidate.id === candidate.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-300 bg-white'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{candidate.candidateName}</h3>
                                            <p className="text-sm text-gray-500">{candidate.appliedFor}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getMatchBadgeColor(candidate.matchPercentage)}`}>
                                            {candidate.matchPercentage}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Building2 size={12} />
                                        <span>{candidate.company}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Candidate Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <motion.div
                            key={selectedCandidate.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`rounded-xl shadow-lg p-6 border-2 ${getMatchColor(selectedCandidate.matchPercentage)}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedCandidate.candidateName}</h2>
                                    <p className="text-gray-600 mt-1">{selectedCandidate.appliedFor}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-4xl font-bold">{selectedCandidate.matchPercentage}%</div>
                                    <div className="text-sm font-medium">{selectedCandidate.overallFit}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="text-gray-500" />
                                    <span className="text-gray-700 truncate">{selectedCandidate.candidateEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="text-gray-500" />
                                    <span className="text-gray-700">{selectedCandidate.candidatePhone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Briefcase size={16} className="text-gray-500" />
                                    <span className="text-gray-700">{selectedCandidate.experienceYears}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={16} className="text-gray-500" />
                                    <span className="text-gray-700">{selectedCandidate.appliedDate}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Skills Analysis */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Target size={20} className="text-blue-600" />
                                Skills Analysis
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Matched Required Skills</span>
                                        <CheckCircle size={16} className="text-green-600" />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCandidate.skillsAnalysis.matchedRequiredSkills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {selectedCandidate.skillsAnalysis.missingRequiredSkills.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Missing Required Skills</span>
                                            <XCircle size={16} className="text-red-600" />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.skillsAnalysis.missingRequiredSkills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedCandidate.skillsAnalysis.matchedNiceToHaveSkills.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Bonus Skills</span>
                                            <Award size={16} className="text-purple-600" />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.skillsAnalysis.matchedNiceToHaveSkills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Strengths & Gaps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-green-600" />
                                    Strengths
                                </h3>
                                <ul className="space-y-2">
                                    {selectedCandidate.strengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-green-600 mt-1">✓</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                            >
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-orange-600" />
                                    Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {selectedCandidate.gaps.length > 0 ? (
                                        selectedCandidate.gaps.map((gap, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                <span className="text-orange-600 mt-1">!</span>
                                                <span>{gap}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-sm text-gray-500 italic">No significant gaps identified</li>
                                    )}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Recommendations */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border border-blue-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Lightbulb size={20} className="text-yellow-600" />
                                AI Recommendations
                            </h3>
                            <ul className="space-y-3">
                                {selectedCandidate.recommendations.map((rec, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm">
                                        <span className="px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">{idx + 1}</span>
                                        <span className="text-gray-700 flex-1">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-3">Summary</h3>
                            <p className="text-gray-700 leading-relaxed">{selectedCandidate.summaryFeedback}</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
