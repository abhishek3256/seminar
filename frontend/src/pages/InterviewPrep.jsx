import { useState } from 'react';
import { BookOpen, Code, Briefcase, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const interviewData = {
    technical: [
        { q: "What is the difference between let, const, and var in JavaScript?", a: "var is function-scoped, let and const are block-scoped. const cannot be reassigned." },
        { q: "Explain closures in JavaScript", a: "A closure is a function that has access to variables in its outer (enclosing) function's scope, even after the outer function has returned." },
        { q: "What is the time complexity of binary search?", a: "O(log n) - divides search space in half each iteration" },
        { q: "Difference between SQL and NoSQL databases?", a: "SQL is relational with fixed schema, NoSQL is non-relational with flexible schema" },
        { q: "What is polymorphism in OOP?", a: "Ability of objects to take multiple forms - method overloading and overriding" }
    ],
    hr: [
        { q: "Tell me about yourself", a: "Structure: Present (current role/education), Past (relevant experience), Future (career goals)" },
        { q: "Why do you want to work here?", a: "Research company values, products, culture. Align with your career goals" },
        { q: "What are your strengths and weaknesses?", a: "Be honest, provide examples, show self-awareness and growth mindset" },
        { q: "Where do you see yourself in 5 years?", a: "Show ambition but realistic goals aligned with company growth" },
        { q: "Why should we hire you?", a: "Highlight unique skills, cultural fit, and value you bring" }
    ],
    behavioral: [
        { q: "Describe a challenging project you worked on", a: "Use STAR method: Situation, Task, Action, Result" },
        { q: "How do you handle conflicts in a team?", a: "Active listening, empathy, finding common ground, focus on solutions" },
        { q: "Tell me about a time you failed", a: "Be honest, focus on lessons learned and how you improved" },
        { q: "How do you prioritize tasks?", a: "Urgency vs importance matrix, deadlines, impact assessment" },
        { q: "Describe your leadership style", a: "Collaborative, supportive, lead by example, empower team members" }
    ]
};

const InterviewPrep = () => {
    const [activeCategory, setActiveCategory] = useState('technical');
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const toggleQuestion = (index) => {
        setExpandedQuestions({
            ...expandedQuestions,
            [index]: !expandedQuestions[index]
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-40 pb-8 px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                        <MessageCircle size={36} className="text-blue-400" />
                        Interview Preparation
                    </h1>
                    <p className="text-slate-400 mt-2">Master common interview questions and ace your placement interviews</p>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveCategory('technical')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${activeCategory === 'technical' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                    >
                        <Code size={20} /> Technical
                    </button>
                    <button
                        onClick={() => setActiveCategory('hr')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${activeCategory === 'hr' ? 'bg-purple-600' : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                    >
                        <Briefcase size={20} /> HR Round
                    </button>
                    <button
                        onClick={() => setActiveCategory('behavioral')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg transition ${activeCategory === 'behavioral' ? 'bg-green-600' : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                    >
                        <MessageCircle size={20} /> Behavioral
                    </button>
                </div>

                {/* Questions */}
                <div className="space-y-4">
                    {interviewData[activeCategory].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-800/50 transition"
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <p className="font-medium text-lg">{item.q}</p>
                                </div>
                                {expandedQuestions[index] ? <ChevronUp /> : <ChevronDown />}
                            </button>
                            {expandedQuestions[index] && (
                                <div className="px-6 pb-6 pt-2 bg-slate-800/30">
                                    <div className="pl-12">
                                        <p className="text-slate-300 leading-relaxed">{item.a}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Tips Section */}
                <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">💡 Interview Tips</h3>
                    <ul className="space-y-2 text-slate-300">
                        <li>✓ Research the company thoroughly before the interview</li>
                        <li>✓ Practice answers out loud, not just in your head</li>
                        <li>✓ Use the STAR method for behavioral questions</li>
                        <li>✓ Prepare questions to ask the interviewer</li>
                        <li>✓ Dress professionally and arrive 10-15 minutes early</li>
                        <li>✓ Maintain eye contact and positive body language</li>
                        <li>✓ Follow up with a thank-you email within 24 hours</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InterviewPrep;
