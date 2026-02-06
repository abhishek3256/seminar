import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, title, value, trend, trendColor, iconBgColor }) => {
    return (
        <motion.div
            whileHover={{ translateY: -4 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${iconBgColor}`}>
                    <Icon size={24} className="text-white" />
                </div>
                {trend && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendColor} bg-opacity-10`}>
                        {trend}
                    </span>
                )}
            </div>

            <div className="mt-4">
                <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatsCard;
