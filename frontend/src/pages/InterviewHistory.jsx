import { useState, useEffect } from 'react';
import { History, TrendingUp, Calendar, Award, BarChart3, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InterviewHistory = () => {
    const [sessions, setSessions] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/ai/interview/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                setSessions(data.sessions);
                setStatistics(data.statistics);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 75) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-orange-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center pt-20">
                <Loader className="animate-spin h-16 w-16 text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-20 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-800 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <History className="h-8 w-8 text-blue-400" />
                        <h1 className="text-4xl font-bold">Interview History</h1>
                    </div>
                    <p className="text-slate-300 text-lg">Track your progress and improvement over time</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Statistics */}
                {statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="text-purple-400" />
                                <span className="text-slate-400">Total Sessions</span>
                            </div>
                            <div className="text-3xl font-bold">{statistics.totalSessions}</div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="text-green-400" />
                                <span className="text-slate-400">Completed</span>
                            </div>
                            <div className="text-3xl font-bold">{statistics.completedSessions}</div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="text-blue-400" />
                                <span className="text-slate-400">Average Score</span>
                            </div>
                            <div className={`text-3xl font-bold ${getScoreColor(statistics.averageScore)}`}>
                                {statistics.averageScore}/100
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Award className="text-yellow-400" />
                                <span className="text-slate-400">Recent Score</span>
                            </div>
                            <div className={`text-3xl font-bold ${getScoreColor(statistics.recentScore || 0)}`}>
                                {statistics.recentScore || 'N/A'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sessions List */}
                <div className="space-y-4">
                    {sessions.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                            <History className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold mb-2">No Interview History</h3>
                            <p className="text-slate-400 mb-6">Start your first interview practice session!</p>
                            <button
                                onClick={() => navigate('/ai-interview-prep')}
                                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
                            >
                                Start Interview Prep
                            </button>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div key={session._id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{session.jobRole}</h3>
                                        <div className="flex items-center gap-4 text-slate-400 text-sm">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {new Date(session.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="capitalize">{session.difficulty} difficulty</span>
                                            <span>{session.questions.length} questions</span>
                                        </div>
                                    </div>

                                    {session.status === 'completed' && (
                                        <div className="text-right">
                                            <div className={`text-3xl font-bold ${getScoreColor(session.overallScore)}`}>
                                                {session.overallScore}/100
                                            </div>
                                            <div className="text-sm text-slate-400">Overall Score</div>
                                        </div>
                                    )}

                                    {session.status === 'in-progress' && (
                                        <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-lg text-sm font-medium">
                                            In Progress
                                        </div>
                                    )}
                                </div>

                                {/* Questions Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                    {session.questions.slice(0, 3).map((q, index) => (
                                        <div key={index} className="bg-slate-800 rounded-lg p-3">
                                            <div className="text-xs text-slate-400 mb-1 capitalize">{q.type}</div>
                                            <div className="text-sm text-slate-300 line-clamp-2">{q.question}</div>
                                            {q.score !== undefined && (
                                                <div className={`text-sm font-bold mt-2 ${getScoreColor(q.score)}`}>
                                                    Score: {q.score}/100
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Start New Session Button */}
                {sessions.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/ai-interview-prep')}
                            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg transition font-semibold"
                        >
                            Start New Interview Session
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewHistory;
