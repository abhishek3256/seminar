import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';

const ResumeUpload = ({ jobData, onAnalysisComplete, onBack }) => {
    const [file, setFile] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [loadingStep, setLoadingStep] = useState(0);
    const fileInputRef = useRef(null);

    const loadingMessages = [
        "Reading resume...",
        "Extracting experience...",
        "Analyzing skills...",
        "Calculating match score...",
        "Generating report..."
    ];

    React.useEffect(() => {
        let interval;
        if (isAnalyzing) {
            interval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingMessages.length);
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        setError('');
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!selectedFile) return;

        if (!validTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or Word document');
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setFile(selectedFile);
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);
        Object.keys(jobData).forEach(key => {
            formData.append(key, jobData[key]);
        });

        try {
            // Assuming existing backend is on port 5000 or proxied
            // Adjust URL if needed based on your setup
            const response = await axios.post('http://localhost:5000/api/resume/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                onAnalysisComplete(response.data.data);
            } else {
                setError(response.data.message || 'Analysis failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to connect to server');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

                {!isAnalyzing ? (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Upload Resume</h2>
                            <p className="text-gray-500 mt-2">PDF or Word documents up to 5MB</p>
                        </div>

                        <div
                            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
                ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                ${file ? 'bg-green-50 border-green-500' : ''}
              `}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => validateAndSetFile(e.target.files[0])}
                            />

                            <AnimatePresence mode="wait">
                                {file ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <FileText size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">{file.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                            className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1"
                                        >
                                            <X size={16} /> Remove file
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                            <UploadCloud size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800">Drag & Drop Resume</h3>
                                        <p className="text-sm text-gray-500">or click to browse files</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"
                            >
                                <X size={20} />
                                {error}
                            </motion.div>
                        )}

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={onBack}
                                className="flex-1 px-6 py-4 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleAnalyze}
                                disabled={!file}
                                className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white shadow-lg transition-all transform hover:-translate-y-1
                  ${file ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-gray-300 cursor-not-allowed'}
                `}
                            >
                                Analyze Resume Match
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
                            <ShieldCheck size={16} />
                            <span>Your data is processed securely and processed in-memory only.</span>
                        </div>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>

                        <motion.h3
                            key={loadingStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl font-semibold text-gray-800 mb-2"
                        >
                            {loadingMessages[loadingStep]}
                        </motion.h3>
                        <p className="text-gray-500">This usually takes about 5-10 seconds</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ResumeUpload;
