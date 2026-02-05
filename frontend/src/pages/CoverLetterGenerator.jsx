import { useState, useEffect } from 'react';
import { FileText, Sparkles, Copy, Download, Loader, RefreshCw } from 'lucide-react';

const CoverLetterGenerator = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [tone, setTone] = useState('professional');
    const [coverLetter, setCoverLetter] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [refinementInstructions, setRefinementInstructions] = useState('');
    const [showRefine, setShowRefine] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoadingJobs(false);
        }
    };

    const generateCoverLetter = async () => {
        if (!selectedJob) {
            alert('Please select a job');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ai/cover-letter/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobId: selectedJob,
                    tone
                })
            });

            const data = await response.json();
            if (data.success) {
                setCoverLetter(data.coverLetter);
                setShowRefine(true);
            } else {
                alert(data.message || 'Failed to generate cover letter');
            }
        } catch (error) {
            console.error('Error generating cover letter:', error);
            alert('Failed to generate cover letter');
        } finally {
            setLoading(false);
        }
    };

    const refineCoverLetter = async () => {
        if (!refinementInstructions.trim()) {
            alert('Please provide refinement instructions');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ai/cover-letter/refine', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    coverLetter,
                    instructions: refinementInstructions
                })
            });

            const data = await response.json();
            if (data.success) {
                setCoverLetter(data.coverLetter);
                setRefinementInstructions('');
            } else {
                alert(data.message || 'Failed to refine cover letter');
            }
        } catch (error) {
            console.error('Error refining cover letter:', error);
            alert('Failed to refine cover letter');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(coverLetter);
        alert('Cover letter copied to clipboard!');
    };

    const downloadAsText = () => {
        const element = document.createElement('a');
        const file = new Blob([coverLetter], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'cover-letter.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            AI Cover Letter Generator
                        </h1>
                    </div>
                    <p className="text-slate-300 text-lg">
                        Create personalized cover letters in seconds
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Configuration */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-6">Configure Cover Letter</h2>

                            {/* Job Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Select Job *</label>
                                {loadingJobs ? (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Loader className="animate-spin" size={16} />
                                        Loading jobs...
                                    </div>
                                ) : (
                                    <select
                                        value={selectedJob}
                                        onChange={(e) => setSelectedJob(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="">Choose a job...</option>
                                        {jobs.map((job) => (
                                            <option key={job._id} value={job._id}>
                                                {job.title} - {job.company?.name || 'Company'}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Tone Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Tone</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['professional', 'enthusiastic', 'technical'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTone(t)}
                                            className={`px-4 py-3 rounded-lg capitalize transition ${tone === t
                                                    ? 'bg-purple-600 text-white'
                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateCoverLetter}
                                disabled={loading || !selectedJob}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} />
                                        Generate Cover Letter
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Refinement Section */}
                        {showRefine && coverLetter && (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <RefreshCw size={20} className="text-blue-400" />
                                    Refine Cover Letter
                                </h3>
                                <textarea
                                    value={refinementInstructions}
                                    onChange={(e) => setRefinementInstructions(e.target.value)}
                                    placeholder="e.g., Make it more enthusiastic, add more technical details, shorten the introduction..."
                                    rows="4"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none mb-4"
                                />
                                <button
                                    onClick={refineCoverLetter}
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader className="animate-spin" size={18} />
                                            Refining...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw size={18} />
                                            Refine
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Generated Cover Letter */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">Generated Cover Letter</h2>
                            {coverLetter && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={copyToClipboard}
                                        className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition"
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={18} />
                                    </button>
                                    <button
                                        onClick={downloadAsText}
                                        className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition"
                                        title="Download as text"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {coverLetter ? (
                            <div className="bg-white text-slate-900 rounded-lg p-8 min-h-[600px] font-serif">
                                <div className="whitespace-pre-wrap">{coverLetter}</div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-[600px] text-slate-500">
                                <div className="text-center">
                                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p>Your cover letter will appear here</p>
                                    <p className="text-sm mt-2">Select a job and click generate to start</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoverLetterGenerator;
