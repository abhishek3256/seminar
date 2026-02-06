import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const JobCard = ({
    companyName,
    companyLogo,
    jobTitle,
    jobType,
    salary,
    location,
    postedDate,
    onApply
}) => {
    return (
        <motion.div
            whileHover={{ translateY: -2 }}
            className="group bg-slate-900 border border-slate-800 hover:border-blue-500/30 rounded-xl p-5 transition-all duration-300 relative overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                        {companyLogo ? (
                            <img src={companyLogo} alt={companyName} className="w-full h-full object-cover" />
                        ) : (
                            <Building size={24} className="text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{jobTitle}</h3>
                        <p className="text-sm text-slate-400">{companyName}</p>
                    </div>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{postedDate}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                    {jobType}
                </span>
                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/20 flex items-center gap-1">
                    <DollarSign size={10} />
                    {salary}
                </span>
                <span className="bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/20 flex items-center gap-1">
                    <MapPin size={10} />
                    {location}
                </span>
            </div>

            <div className="flex items-center justify-end border-t border-slate-800 pt-4 mt-auto">
                <button
                    onClick={onApply}
                    className="px-4 py-2 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
                >
                    Apply Now
                </button>
            </div>
        </motion.div>
    );
};

export default JobCard;
