import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JobForm from '../components/ResumeParser/JobForm';
import ResumeUpload from '../components/ResumeParser/ResumeUpload';
import ResultsDashboard from '../components/ResumeParser/ResultsDashboard';

const ResumeAnalysisPage = () => {
    const [step, setStep] = useState(1); // 1: Job, 2: Upload, 3: Results
    const [jobData, setJobData] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleJobSubmit = (data) => {
        setJobData(data);
        setStep(2);
    };

    const handleAnalysisComplete = (result) => {
        setAnalysisResult(result);
        setStep(3);
    };

    const resetAnalysis = () => {
        setStep(1);
        setJobData(null);
        setAnalysisResult(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-40 pb-12 px-4 sm:px-6 lg:px-8 font-sans relative">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -z-10 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        AI Resume Matcher
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Instantly analyze resume fit using Gemini AI with zero data storage.
                        <span className="block text-sm mt-2 text-green-600 font-medium bg-green-50 inline-block px-3 py-1 rounded-full">
                            🔒 Privacy-First: No databases, no logs.
                        </span>
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <StepIndicator number={1} label="Job Details" active={step >= 1} current={step === 1} />
                        <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-500`} />
                        <StepIndicator number={2} label="Upload Resume" active={step >= 2} current={step === 2} />
                        <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'} transition-all duration-500`} />
                        <StepIndicator number={3} label="Analysis" active={step >= 3} current={step === 3} />
                    </div>
                </div>

                {/* Dynamic Step Content */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <JobForm onSubmit={handleJobSubmit} initialData={jobData} />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <ResumeUpload
                                jobData={jobData}
                                onAnalysisComplete={handleAnalysisComplete}
                                onBack={() => setStep(1)}
                            />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <ResultsDashboard data={analysisResult} onReset={resetAnalysis} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const StepIndicator = ({ number, label, active, current }) => (
    <div className="flex flex-col items-center gap-2">
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
        ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-white text-gray-400 border border-gray-200'}
        ${current ? 'ring-4 ring-blue-100' : ''}
      `}
        >
            {active && !current && number < 3 ? '✓' : number}
        </div>
        <span className={`text-xs font-medium ${active ? 'text-blue-600' : 'text-gray-400'}`}>{label}</span>
    </div>
);

export default ResumeAnalysisPage;
