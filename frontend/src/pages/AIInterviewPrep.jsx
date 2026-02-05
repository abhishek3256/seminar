import { useState } from 'react';
import { Brain, Play, Loader, CheckCircle, XCircle, TrendingUp, Clock, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIInterviewPrep = () => {
    const [step, setStep] = useState('setup'); // setup, interview, feedback
    const [sessionId, setSessionId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState('');
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [overallScore, setOverallScore] = useState(null);

    // Setup form
    const [jobRole, setJobRole] = useState('');
    const [companyType, setCompanyType] = useState('Technology');
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(5);

    const navigate = useNavigate();

    const startSession = async () => {
        if (!jobRole) {
            alert('Please enter a job role');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/ai/interview-prep/questions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jobRole,
                    companyType,
                    difficulty,
                    questionCount
                })
            });

            const data = await response.json();
            if (data.success) {
                setSessionId(data.session.id);
                setQuestions(data.session.questions);
                setStep('interview');
            } else {
                alert(data.message || 'Failed to start session');
            }
        } catch (error) {
            console.error('Error starting session:', error);
            alert('Failed to start interview session');
        } finally {
            setLoading(false);
        }
    };

    const submitAnswer = async () => {
        if (!answer.trim()) {
            alert('Please provide an answer');
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/ai/interview/submit-answer', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId,
                    questionId: questions[currentQuestionIndex]._id,
                    answer
                })
            });

            const data = await response.json();
            if (data.success) {
                setEvaluation(data.evaluation);
                setSessionComplete(data.sessionComplete);
                setOverallScore(data.overallScore);
                setStep('feedback');
            } else {
                alert(data.message || 'Failed to submit answer');
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
            alert('Failed to submit answer');
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAnswer('');
            setEvaluation(null);
            setStep('interview');
        }
    };

    const finishSession = () => {
        navigate('/interview-history');
    };

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-40 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-800 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="h-8 w-8 text-blue-400" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            AI Interview Preparation
                        </h1>
                    </div>
                    <p className="text-slate-300 text-lg">
                        Practice interviews with AI-powered feedback
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6">
                {/* Setup Step */}
                {step === 'setup' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Configure Your Interview</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Job Role *</label>
                                <input
                                    type="text"
                                    value={jobRole}
                                    onChange={(e) => setJobRole(e.target.value)}
                                    placeholder="e.g., Software Engineer, Data Analyst"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Company Type</label>
                                <select
                                    value={companyType}
                                    onChange={(e) => setCompanyType(e.target.value)}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Consulting">Consulting</option>
                                    <option value="Startup">Startup</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['easy', 'medium', 'hard'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => setDifficulty(level)}
                                            className={`px-4 py-3 rounded-lg capitalize transition ${difficulty === level
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Number of Questions</label>
                                <input
                                    type="number"
                                    value={questionCount}
                                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                    min="3"
                                    max="10"
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <button
                                onClick={startSession}
                                disabled={loading}
                                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Preparing Interview...
                                    </>
                                ) : (
                                    <>
                                        <Play size={20} />
                                        Start Interview
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Interview Step */}
                {step === 'interview' && currentQuestion && (
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
                                <span className="text-purple-400 font-semibold capitalize">{currentQuestion.type}</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div
                                    className="bg-purple-600 h-2 rounded-full transition-all"
                                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                            <h3 className="text-2xl font-bold mb-6">{currentQuestion.question}</h3>

                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                rows="10"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 resize-none"
                            />

                            <button
                                onClick={submitAnswer}
                                disabled={loading}
                                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={20} />
                                        Evaluating...
                                    </>
                                ) : (
                                    'Submit Answer'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Feedback Step */}
                {step === 'feedback' && evaluation && (
                    <div className="space-y-6">
                        {/* Score */}
                        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/50 rounded-xl p-8 text-center">
                            <div className="text-6xl font-bold mb-2">{evaluation.score}/100</div>
                            <div className="text-xl text-slate-300">
                                {evaluation.score >= 75 ? 'Excellent!' : evaluation.score >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                            </div>
                        </div>

                        {/* Feedback */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                            <h3 className="text-xl font-bold mb-4">Feedback</h3>
                            <p className="text-slate-300 mb-6">{evaluation.feedback}</p>

                            {/* Strengths */}
                            {evaluation.strengths && evaluation.strengths.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                                        <CheckCircle size={18} />
                                        Strengths
                                    </h4>
                                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                                        {evaluation.strengths.map((strength, index) => (
                                            <li key={index}>{strength}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Improvements */}
                            {evaluation.improvements && evaluation.improvements.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-orange-400 mb-2 flex items-center gap-2">
                                        <TrendingUp size={18} />
                                        Areas for Improvement
                                    </h4>
                                    <ul className="list-disc list-inside text-slate-300 space-y-1">
                                        {evaluation.improvements.map((improvement, index) => (
                                            <li key={index}>{improvement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-4">
                            {!sessionComplete ? (
                                <button
                                    onClick={nextQuestion}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg transition"
                                >
                                    Next Question →
                                </button>
                            ) : (
                                <div className="flex-1 space-y-4">
                                    <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-6 text-center">
                                        <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                                        <h3 className="text-2xl font-bold mb-2">Interview Complete!</h3>
                                        <p className="text-xl text-green-400">Overall Score: {overallScore}/100</p>
                                    </div>
                                    <button
                                        onClick={finishSession}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-lg transition"
                                    >
                                        View History & Analytics
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIInterviewPrep;
