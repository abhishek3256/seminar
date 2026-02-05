import { motion } from 'framer-motion';
import { ArrowRight, Brain, Rocket, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                            🚀 Reimagining Campus Placements
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            The Future of <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Campus Hiring
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Powered by Agentic AI to streamline placements, match candidates perfectly, and automate the entire hiring workflow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                to="/dashboard"
                                className="btn-primary flex items-center gap-2 text-lg"
                            >
                                Get Started <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/resume-analyzer"
                                className="px-8 py-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-white font-semibold border border-slate-700 transition-all hover:scale-105"
                            >
                                Analyze Resume
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <FeatureCard
                        icon={<Brain className="text-purple-400" size={32} />}
                        title="AI-Powered Matching"
                        description="Smart algorithms matching the right talent with the perfect opportunities instantly."
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Rocket className="text-blue-400" size={32} />}
                        title="Automated Workflows"
                        description="Streamline applications, interviews, and selections with zero manual effort."
                        delay={0.4}
                    />
                    <FeatureCard
                        icon={<Shield className="text-green-400" size={32} />}
                        title="Secure & Verified"
                        description="Enterprise-grade security ensuring 100% verified candidate profiles."
                        delay={0.6}
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="glass-card p-8 rounded-2xl"
    >
        <div className="w-14 h-14 bg-slate-800/80 rounded-xl flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default Home;
