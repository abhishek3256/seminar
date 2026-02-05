import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizQuestions, quizCategories } from '../data/quizData';
import { Clock, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const QuizAttempt = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isSubmitted, setIsSubmitted] = useState(false);

    const questions = quizQuestions[categoryId] || [];
    const category = quizCategories.find(c => c.id === categoryId);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            handleSubmit();
        }
    }, [timeLeft, isSubmitted]);

    const handleAnswer = (questionId, answerIndex) => {
        setAnswers({ ...answers, [questionId]: answerIndex });
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correct++;
        });
        return {
            correct,
            total: questions.length,
            percentage: Math.round((correct / questions.length) * 100)
        };
    };

    if (isSubmitted) {
        const score = calculateScore();
        return (
            <div className="min-h-screen bg-slate-950 text-white pt-40 pb-8 px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                        <h1 className="text-4xl font-bold mb-4">Quiz Completed!</h1>
                        <div className="text-6xl font-bold mb-6">
                            <span className={score.percentage >= 80 ? 'text-green-400' : score.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                                {score.percentage}%
                            </span>
                        </div>
                        <p className="text-xl text-slate-400 mb-8">
                            You got {score.correct} out of {score.total} questions correct
                        </p>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">Time Taken</p>
                                <p className="text-2xl font-bold">{Math.floor((300 - timeLeft) / 60)}m {(300 - timeLeft) % 60}s</p>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-lg">
                                <p className="text-slate-400 text-sm">Accuracy</p>
                                <p className="text-2xl font-bold">{score.percentage}%</p>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/quizzes')}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
                            >
                                Back to Quizzes
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-medium transition"
                            >
                                Retake Quiz
                            </button>
                        </div>
                    </div>

                    {/* Answers Review */}
                    <div className="mt-8 space-y-4">
                        <h2 className="text-2xl font-bold mb-4">Review Answers</h2>
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    {answers[q.id] === q.correctAnswer ? (
                                        <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                                    ) : (
                                        <XCircle className="text-red-400 flex-shrink-0" size={24} />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-medium mb-3">Q{index + 1}. {q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((option, i) => (
                                                <div
                                                    key={i}
                                                    className={`p-3 rounded-lg ${i === q.correctAnswer ? 'bg-green-500/20 border border-green-500' :
                                                        i === answers[q.id] && i !== q.correctAnswer ? 'bg-red-500/20 border border-red-500' :
                                                            'bg-slate-800'
                                                        }`}
                                                >
                                                    {option}
                                                    {i === q.correctAnswer && <span className="ml-2 text-green-400">✓ Correct</span>}
                                                    {i === answers[q.id] && i !== q.correctAnswer && <span className="ml-2 text-red-400">✗ Your answer</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-slate-400 text-sm">{q.explanation}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-40 pb-8 px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">{category?.name}</h1>
                            <p className="text-slate-400">Question {currentQuestion + 1} of {questions.length}</p>
                        </div>
                        <div className="flex items-center gap-2 text-2xl font-bold">
                            <Clock className="text-blue-400" />
                            <span className={timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 bg-slate-800 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Question */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-6">
                    <h2 className="text-xl font-medium mb-6">{question?.question}</h2>
                    <div className="space-y-3">
                        {question?.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(question.id, index)}
                                className={`w-full text-left p-4 rounded-lg transition ${answers[question.id] === index
                                    ? 'bg-blue-600 border-2 border-blue-400'
                                    : 'bg-slate-800 hover:bg-slate-700 border-2 border-transparent'
                                    }`}
                            >
                                <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={20} /> Previous
                    </button>
                    {currentQuestion === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition"
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition"
                        >
                            Next <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizAttempt;
