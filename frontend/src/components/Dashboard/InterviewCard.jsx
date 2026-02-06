import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const InterviewCard = ({ companyName, interviewType, date, time, color = "blue" }) => {

    const colorClasses = {
        blue: { border: 'border-l-blue-500', bg: 'bg-blue-500/5', text: 'text-blue-400' },
        green: { border: 'border-l-green-500', bg: 'bg-green-500/5', text: 'text-green-400' },
        purple: { border: 'border-l-purple-500', bg: 'bg-purple-500/5', text: 'text-purple-400' }
    };

    const colors = colorClasses[color] || colorClasses.blue;

    return (
        <motion.div
            whileHover={{ x: 4 }}
            className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-lg p-4 mb-3 transition-all duration-300`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-slate-200">{companyName}</h4>
                    <p className={`text-xs ${colors.text} font-medium mt-0.5`}>{interviewType}</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">{date}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-slate-500 text-sm">
                <Clock size={14} />
                <span>{time}</span>
            </div>
        </motion.div>
    );
};

export default InterviewCard;
