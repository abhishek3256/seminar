import { useState } from 'react';
import { companies } from '../data/companyData';
import { Building2, Calendar, Users, DollarSign, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Companies = () => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [filter, setFilter] = useState('All');

    const getColorClass = (color) => {
        const colors = {
            blue: 'from-blue-500 to-blue-600',
            orange: 'from-orange-500 to-orange-600',
            yellow: 'from-yellow-500 to-yellow-600',
            purple: 'from-purple-500 to-purple-600'
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <Building2 size={36} className="text-purple-400" />
                        Recruiting Companies
                    </h1>
                    <p className="text-slate-400 mt-2">Explore companies visiting for campus placements</p>
                </div>

                {/* Filter */}
                <div className="mb-6 flex gap-3">
                    {['All', 'Product', 'Service', 'Startup'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg transition ${filter === f ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company, index) => (
                        <motion.div
                            key={company.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition cursor-pointer"
                            onClick={() => setSelectedCompany(company)}
                        >
                            {/* Company Logo */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${company.logoColor} rounded-lg flex items-center justify-center shadow-lg`}>
                                        <span className="text-white font-bold text-lg">{company.logo}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{company.name}</h3>
                                        <p className="text-sm text-slate-400">{company.roles.length} roles</p>
                                    </div>
                                </div>
                            </div>

                            {/* Package */}
                            <div className="flex items-center gap-2 mb-3">
                                <DollarSign size={16} className="text-green-400" />
                                <span className="text-green-400 font-bold">{company.package}</span>
                            </div>

                            {/* Eligibility */}
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle size={16} className="text-blue-400" />
                                <span className="text-sm text-slate-400">{company.eligibility}</span>
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar size={16} className="text-orange-400" />
                                <span className="text-sm text-slate-400">Deadline: {company.deadline}</span>
                            </div>

                            {/* Roles */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {company.roles.map((role, i) => (
                                    <span key={i} className="bg-slate-800 px-2 py-1 rounded text-xs">
                                        {role}
                                    </span>
                                ))}
                            </div>

                            {/* View Details Button */}
                            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                                View Details <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Company Detail Modal */}
                {selectedCompany && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCompany(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-20 h-20 bg-gradient-to-br ${selectedCompany.logoColor} rounded-xl flex items-center justify-center shadow-xl`}>
                                    <span className="text-white font-bold text-2xl">{selectedCompany.logo}</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold">{selectedCompany.name}</h2>
                                    <p className="text-slate-400">{selectedCompany.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    <p className="text-slate-400 text-sm">Package Range</p>
                                    <p className="text-xl font-bold text-green-400">{selectedCompany.package}</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-lg">
                                    <p className="text-slate-400 text-sm">Deadline</p>
                                    <p className="text-xl font-bold text-orange-400">{selectedCompany.deadline}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3">Eligibility Criteria</h3>
                                <p className="text-slate-300">{selectedCompany.eligibility}</p>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3">Open Roles</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCompany.roles.map((role, i) => (
                                        <span key={i} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg">
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3">Selection Process</h3>
                                <div className="space-y-2">
                                    {selectedCompany.rounds.map((round, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                                                {i + 1}
                                            </div>
                                            <span className="text-slate-300">{round}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3">Requirements</h3>
                                <ul className="list-disc list-inside space-y-1 text-slate-300">
                                    {selectedCompany.requirements.map((req, i) => (
                                        <li key={i}>{req}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-3">Benefits</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCompany.benefits.map((benefit, i) => (
                                        <span key={i} className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedCompany(null)}
                                className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-lg font-medium transition"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Companies;
