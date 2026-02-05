import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Download, RefreshCw, Star, Trophy, Target } from 'lucide-react';

const ResultsDashboard = ({ data, onReset }) => {
    const {
        candidateName,
        matchPercentage,
        overallFit,
        experienceMatch,
        skillsAnalysis,
        strengths,
        gaps,
        recommendations,
        summaryFeedback
    } = data;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
        if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreBarColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto space-y-6"
        >
            {/* 1. Header Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">{candidateName}</h1>
                        <p className="text-gray-500 mt-1">{overallFit}</p>
                    </div>

                    <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Circular Progress (CSS only for simplicity) */}
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64" cy="64" r="56"
                                stroke="#f3f4f6" strokeWidth="12" fill="none"
                            />
                            <circle
                                cx="64" cy="64" r="56"
                                stroke={matchPercentage >= 80 ? '#22c55e' : matchPercentage >= 60 ? '#3b82f6' : '#f97316'}
                                strokeWidth="12" fill="none"
                                strokeDasharray="351.86"
                                strokeDashoffset={351.86 - (351.86 * matchPercentage) / 100}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-800">{matchPercentage}%</span>
                            <span className="text-xs text-gray-400 font-medium">MATCH</span>
                        </div>
                    </div>
                </div>

                {/* 2. Key Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100">
                    <div className="bg-white p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Skills Match</span>
                            <span className="font-bold text-gray-800">{skillsAnalysis.skillMatchScore}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${skillsAnalysis.skillMatchScore}%` }}
                                className={`h-full ${getScoreBarColor(skillsAnalysis.skillMatchScore)}`}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Based on required & nice-to-have skills</p>
                    </div>
                    <div className="bg-white p-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-500">Experience Match</span>
                            <span className="font-bold text-gray-800">{experienceMatch.score}%</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${experienceMatch.score}%` }}
                                className={`h-full ${getScoreBarColor(experienceMatch.score)}`}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{experienceMatch.feedback}</p>
                    </div>
                </div>
            </div>

            {/* 3. Skills Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-green-500" size={20} /> Matched Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skillsAnalysis.matchedRequiredSkills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                {skill}
                            </span>
                        ))}
                        {skillsAnalysis.matchedNiceToHaveSkills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {skill}
                            </span>
                        ))}
                        {skillsAnalysis.additionalRelevantSkills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                                + {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <XCircle className="text-red-500" size={20} /> Missing Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skillsAnalysis.missingRequiredSkills.length > 0 ? (
                            skillsAnalysis.missingRequiredSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-sm font-medium">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-gray-400 italic">No missing required skills detected</span>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Detailed Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Trophy className="text-yellow-500" size={20} /> Strengths
                    </h3>
                    <ul className="space-y-3">
                        {strengths.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1 w-1.5 h-1.5 bg-yellow-400 rounded-full flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" size={20} /> Gaps
                    </h3>
                    <ul className="space-y-3">
                        {gaps.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Target className="text-blue-500" size={20} /> Recommendations
                    </h3>
                    <ul className="space-y-3">
                        {recommendations.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 5. Summary */}
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900 mb-2">AI Assessment Summary</h3>
                <p className="text-indigo-700 leading-relaxed">
                    {summaryFeedback}
                </p>
            </div>

            {/* 6. Success Notification Footer */}
            <div className="bg-gray-50 rounded-xl p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Analysis complete. Privacy check: Resume data has been permanently deleted from server memory.
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-6 pb-12">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 shadow-sm text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                    <RefreshCw size={18} />
                    Analyze Another Resume
                </button>
            </div>
        </motion.div>
    );
};

export default ResultsDashboard;
