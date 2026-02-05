import { BookOpen, Download, FileText, Video, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const studyMaterials = [
    {
        category: "Data Structures & Algorithms",
        icon: <Code className="text-blue-400" />,
        materials: [
            { name: "Arrays & Strings", type: "PDF", size: "2.5 MB" },
            { name: "Linked Lists", type: "PDF", size: "1.8 MB" },
            { name: "Trees & Graphs", type: "PDF", size: "3.2 MB" },
            { name: "Dynamic Programming", type: "Video", duration: "45 min" }
        ]
    },
    {
        category: "Aptitude & Reasoning",
        icon: <FileText className="text-green-400" />,
        materials: [
            { name: "Quantitative Aptitude", type: "PDF", size: "5.1 MB" },
            { name: "Logical Reasoning", type: "PDF", size: "3.8 MB" },
            { name: "Verbal Ability", type: "PDF", size: "2.3 MB" },
            { name: "Practice Problems", type: "PDF", size: "4.5 MB" }
        ]
    },
    {
        category: "Programming Languages",
        icon: <Code className="text-purple-400" />,
        materials: [
            { name: "Java Fundamentals", type: "PDF", size: "6.2 MB" },
            { name: "Python Basics", type: "Video", duration: "60 min" },
            { name: "C++ STL Guide", type: "PDF", size: "3.5 MB" },
            { name: "JavaScript ES6+", type: "PDF", size: "2.9 MB" }
        ]
    },
    {
        category: "System Design",
        icon: <BookOpen className="text-orange-400" />,
        materials: [
            { name: "System Design Basics", type: "PDF", size: "4.8 MB" },
            { name: "Scalability Patterns", type: "Video", duration: "90 min" },
            { name: "Database Design", type: "PDF", size: "3.1 MB" },
            { name: "Microservices", type: "PDF", size: "2.7 MB" }
        ]
    }
];

const StudyMaterials = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-8 px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <BookOpen size={36} className="text-green-400" />
                        Study Materials
                    </h1>
                    <p className="text-slate-400 mt-2">Comprehensive resources for placement preparation</p>
                </div>

                {/* Materials Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {studyMaterials.map((category, index) => (
                        <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-slate-800 rounded-lg">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-bold">{category.category}</h2>
                            </div>

                            <div className="space-y-3">
                                {category.materials.map((material, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            {material.type === 'PDF' ? (
                                                <FileText size={20} className="text-red-400" />
                                            ) : (
                                                <Video size={20} className="text-blue-400" />
                                            )}
                                            <div>
                                                <p className="font-medium">{material.name}</p>
                                                <p className="text-sm text-slate-400">
                                                    {material.size || material.duration}
                                                </p>
                                            </div>
                                        </div>
                                        <Download size={20} className="text-slate-400 group-hover:text-blue-400 transition" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">📚 Additional Resources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
                            <BookOpen size={16} /> LeetCode Problems
                        </a>
                        <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
                            <Video size={16} /> YouTube Tutorials
                        </a>
                        <a href="#" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition">
                            <FileText size={16} /> Previous Year Papers
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyMaterials;
