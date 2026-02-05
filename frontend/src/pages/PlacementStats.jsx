import { placementStats } from '../data/companyData';
import { TrendingUp, Users, DollarSign, Building2, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const PlacementStats = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <TrendingUp size={36} className="text-green-400" />
                        Placement Statistics
                    </h1>
                    <p className="text-slate-400 mt-2">Comprehensive placement data and insights</p>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Users className="text-blue-400" size={32} />
                            <span className="text-3xl font-bold">{placementStats.placementPercentage}%</span>
                        </div>
                        <p className="text-slate-300 font-medium">Placement Rate</p>
                        <p className="text-sm text-slate-400">{placementStats.placedStudents}/{placementStats.totalStudents} students</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Award className="text-green-400" size={32} />
                            <span className="text-3xl font-bold text-green-400">{placementStats.highestPackage}</span>
                        </div>
                        <p className="text-slate-300 font-medium">Highest Package</p>
                        <p className="text-sm text-slate-400">Top offer this year</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="text-purple-400" size={32} />
                            <span className="text-3xl font-bold text-purple-400">{placementStats.averagePackage}</span>
                        </div>
                        <p className="text-slate-300 font-medium">Average Package</p>
                        <p className="text-sm text-slate-400">Median: {placementStats.medianPackage}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <Building2 className="text-orange-400" size={32} />
                            <span className="text-3xl font-bold text-orange-400">{placementStats.topRecruiters.length}</span>
                        </div>
                        <p className="text-slate-300 font-medium">Top Recruiters</p>
                        <p className="text-sm text-slate-400">Premium companies</p>
                    </motion.div>
                </div>

                {/* Department-wise Stats */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Department-wise Placements</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-slate-400 border-b border-slate-800">
                                    <th className="pb-3 text-left">Department</th>
                                    <th className="pb-3 text-left">Placed</th>
                                    <th className="pb-3 text-left">Total</th>
                                    <th className="pb-3 text-left">Percentage</th>
                                    <th className="pb-3 text-left">Avg Package</th>
                                    <th className="pb-3 text-left">Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {placementStats.departmentWise.map((dept, index) => {
                                    const percentage = Math.round((dept.placed / dept.total) * 100);
                                    return (
                                        <motion.tr
                                            key={dept.dept}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="hover:bg-slate-800/50 transition"
                                        >
                                            <td className="py-4 font-medium">{dept.dept}</td>
                                            <td className="py-4 text-green-400">{dept.placed}</td>
                                            <td className="py-4 text-slate-300">{dept.total}</td>
                                            <td className="py-4">
                                                <span className={`font-bold ${percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                    {percentage}%
                                                </span>
                                            </td>
                                            <td className="py-4 text-blue-400">{dept.avgPackage}</td>
                                            <td className="py-4">
                                                <div className="w-full bg-slate-800 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Package Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Package Distribution</h2>
                    <div className="space-y-4">
                        {placementStats.packageDistribution.map((pkg, index) => {
                            const maxCount = Math.max(...placementStats.packageDistribution.map(p => p.count));
                            const percentage = (pkg.count / maxCount) * 100;
                            return (
                                <motion.div
                                    key={pkg.range}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium">{pkg.range}</span>
                                        <span className="text-slate-400">{pkg.count} students</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Recruiters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Top Recruiters</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {placementStats.topRecruiters.map((company, index) => (
                            <motion.div
                                key={company}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800 p-4 rounded-lg text-center hover:bg-slate-700 transition"
                            >
                                <Building2 className="mx-auto mb-2 text-blue-400" size={32} />
                                <p className="font-medium">{company}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacementStats;
