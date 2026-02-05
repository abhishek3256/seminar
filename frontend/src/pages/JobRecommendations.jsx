import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Briefcase, MapPin, DollarSign, Target, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import JobMatchCard from '../components/JobMatchCard';

const JobRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, high, medium, low
    const [totalJobs, setTotalJobs] = useState(0);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ai/job-recommendations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch recommendations');
            }

            const data = await response.json();
            setRecommendations(data.recommendations || []);
            setTotalJobs(data.totalJobs || 0);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    const getFilteredRecommendations = () => {
        if (filter === 'all') return recommendations;
        if (filter === 'high') return recommendations.filter(r => r.matchScore >= 75);
        if (filter === 'medium') return recommendations.filter(r => r.matchScore >= 50 && r.matchScore < 75);
        if (filter === 'low') return recommendations.filter(r => r.matchScore < 50);
        return recommendations;
    };

    const filteredRecommendations = getFilteredRecommendations();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
                <div className="text-center">
                    <Loader className="animate-spin h-16 w-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-white text-xl">Analyzing your profile...</p>
                    <p className="text-slate-400 mt-2">Finding the best job matches for you</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20 p-8">
                <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 max-w-2xl text-center">
                    <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-4">Error Loading Recommendations</h1>
                    <p className="text-red-400 mb-6">{error}</p>
                    <button
                        onClick={fetchRecommendations}
                        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition text-white font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-8 w-8 text-purple-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            AI Job Recommendations
                        </h1>
                    </div>
                    <p className="text-slate-300 text-lg">
                        Personalized job matches powered by AI • {recommendations.length} recommendations from {totalJobs} jobs
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 font-medium">Filter by Match:</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition ${filter === 'all'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                All ({recommendations.length})
                            </button>
                            <button
                                onClick={() => setFilter('high')}
                                className={`px-4 py-2 rounded-lg transition ${filter === 'high'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                High Match (75%+)
                            </button>
                            <button
                                onClick={() => setFilter('medium')}
                                className={`px-4 py-2 rounded-lg transition ${filter === 'medium'
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Medium Match (50-74%)
                            </button>
                            <button
                                onClick={() => setFilter('low')}
                                className={`px-4 py-2 rounded-lg transition ${filter === 'low'
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Lower Match (&lt;50%)
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recommendations List */}
                {filteredRecommendations.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">No Recommendations Found</h3>
                        <p className="text-slate-400 mb-6">
                            {filter !== 'all'
                                ? 'Try adjusting your filter to see more recommendations'
                                : 'Complete your profile to get personalized job recommendations'}
                        </p>
                        {filter !== 'all' && (
                            <button
                                onClick={() => setFilter('all')}
                                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
                            >
                                Show All Recommendations
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredRecommendations.map((recommendation, index) => (
                            <JobMatchCard
                                key={recommendation.jobId || index}
                                recommendation={recommendation}
                                rank={index + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobRecommendations;
