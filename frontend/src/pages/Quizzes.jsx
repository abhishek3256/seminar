import { useState } from 'react';
import { Link } from 'react-router-dom';
import { quizCategories, mockQuizHistory } from '../data/quizData';
import { Trophy, Clock, Target, TrendingUp, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Quizzes = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);

    const getColorClass = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            purple: 'from-purple-500 to-purple-600',
            green: 'from-green-500 to-green-600',
            orange: 'from-orange-500 to-orange-600',
            cyan: 'from-cyan-500 to-cyan-600',
            sky: 'from-sky-500 to-sky-600',
            red: 'from-red-500 to-red-600',
            indigo: 'from-indigo-500 to-indigo-600'
        };
        return colors[color] || colors.blue;
    };

    const getBgColorClass = (color) => {
        const colors = {
            blue: 'bg-blue-500/20 border-blue-500/50',
            purple: 'bg-purple-500/20 border-purple-500/50',
            green: 'bg-green-500/20 border-green-500/50',
            orange: 'bg-orange-500/20 border-orange-500/50',
            cyan: 'bg-cyan-500/20 border-cyan-500/50',
            sky: 'bg-sky-500/20 border-sky-500/50',
            red: 'bg-red-500/20 border-red-500/50',
            indigo: 'bg-indigo-500/20 border-indigo-500/50'
        };
        return colors[color] || colors.blue;
    };

    // Group categories by domain
    const domains = {
        'General': quizCategories.filter(cat => cat.domain === 'General'),
        'Development': quizCategories.filter(cat => cat.domain === 'Development'),
        'Data': quizCategories.filter(cat => cat.domain === 'Data'),
        'Infrastructure': quizCategories.filter(cat => cat.domain === 'Infrastructure'),
        'Security': quizCategories.filter(cat => cat.domain === 'Security')
    };

    const domainIcons = {
        'General': '📚',
        'Development': '💻',
        'Data': '📊',
        'Infrastructure': '⚙️',
        'Security': '🔒'
    };

    const domainColors = {
        'General': 'text-blue-400',
        'Development': 'text-purple-400',
        'Data': 'text-green-400',
        'Infrastructure': 'text-orange-400',
        'Security': 'text-red-400'
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-40 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Trophy size={36} className="text-yellow-400" />
                        Aptitude Tests & Domain Quizzes
                    </h1>
                    <p className="text-slate-400 mt-2">Practice for general aptitude and specific job roles</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Tests Taken</p>
                                <p className="text-3xl font-bold text-blue-400 mt-1">{mockQuizHistory.length}</p>
                            </div>
                            <Trophy className="text-blue-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Avg Score</p>
                                <p className="text-3xl font-bold text-green-400 mt-1">
                                    {Math.round(mockQuizHistory.reduce((acc, quiz) => acc + quiz.score, 0) / mockQuizHistory.length)}%
                                </p>
                            </div>
                            <Target className="text-green-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Best Score</p>
                                <p className="text-3xl font-bold text-purple-400 mt-1">
                                    {Math.max(...mockQuizHistory.map(q => q.score))}%
                                </p>
                            </div>
                            <TrendingUp className="text-purple-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Time Spent</p>
                                <p className="text-3xl font-bold text-orange-400 mt-1">
                                    {Math.round(mockQuizHistory.reduce((acc, quiz) => acc + quiz.timeTaken, 0) / 60)}m
                                </p>
                            </div>
                            <Clock className="text-orange-400" size={32} />
                        </div>
                    </div>
                </div>

                {/* Quiz Categories by Domain */}
                {Object.entries(domains).map(([domainName, categories]) => (
                    categories.length > 0 && (
                        <div key={domainName} className="mb-10">
                            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${domainColors[domainName]}`}>
                                <span>{domainIcons[domainName]}</span>
                                {domainName === 'General' ? 'General Aptitude' : `${domainName} Roles`}
                            </h2>
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${domainName === 'General' ? '4' : '3'} gap-6`}>
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`bg-slate-900 border-2 ${getBgColorClass(category.color)} rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer group`}
                                    >
                                        <div className="text-center">
                                            <div className="text-5xl mb-4">{category.icon}</div>
                                            <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                                            <p className="text-slate-400 text-sm mb-3">{category.description}</p>

                                            {/* Job Titles */}
                                            {category.jobTitles && (
                                                <div className="flex flex-wrap gap-1 justify-center mb-4">
                                                    {category.jobTitles.slice(0, 2).map((job, i) => (
                                                        <span key={i} className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">
                                                            {job}
                                                        </span>
                                                    ))}
                                                    {category.jobTitles.length > 2 && (
                                                        <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
                                                            +{category.jobTitles.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-4">
                                                <Clock size={14} />
                                                <span>{category.questionCount} Questions</span>
                                            </div>
                                            <Link
                                                to={`/quiz-attempt/${category.id}`}
                                                className={`inline-flex items-center gap-2 bg-gradient-to-r ${getColorClass(category.color)} px-6 py-2 rounded-lg font-medium hover:shadow-lg transition`}
                                            >
                                                <Play size={16} /> Start Quiz
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {/* Recent Quiz History */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-8">
                    <h2 className="text-2xl font-bold mb-6">Recent Attempts</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800">
                                    <th className="pb-3 text-left">Category</th>
                                    <th className="pb-3 text-left">Score</th>
                                    <th className="pb-3 text-left">Correct</th>
                                    <th className="pb-3 text-left">Time</th>
                                    <th className="pb-3 text-left">Percentile</th>
                                    <th className="pb-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {mockQuizHistory.map((quiz) => {
                                    const category = quizCategories.find(c => c.id === quiz.category);
                                    return (
                                        <tr key={quiz.id} className="hover:bg-slate-800/50 transition">
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">{category?.icon}</span>
                                                    <span className="font-medium">{category?.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <span className={`font-bold ${quiz.score >= 80 ? 'text-green-400' : quiz.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {quiz.score}%
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-300">{quiz.correctAnswers}/{quiz.totalQuestions}</td>
                                            <td className="py-4 text-slate-300">{Math.floor(quiz.timeTaken / 60)}m {quiz.timeTaken % 60}s</td>
                                            <td className="py-4">
                                                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-sm">
                                                    {quiz.percentile}th
                                                </span>
                                            </td>
                                            <td className="py-4 text-slate-400">{quiz.date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quizzes;
