import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import ResumeAnalysisPage from './pages/ResumeAnalysisPage';
import ResumeDashboard from './components/Dashboard/Dashboard';
import SavedJobs from './pages/SavedJobs';
import Profile from './pages/Profile';
import Quizzes from './pages/Quizzes';
import QuizAttempt from './pages/QuizAttempt';
import Companies from './pages/Companies';
import PlacementStats from './pages/PlacementStats';
import InterviewPrep from './pages/InterviewPrep';
import StudyMaterials from './pages/StudyMaterials';
import AdminDashboard from './pages/AdminDashboard';
import DebugAuth from './pages/DebugAuth';
// AI Features
import JobRecommendations from './pages/JobRecommendations';
import AIInterviewPrep from './pages/AIInterviewPrep';
import InterviewHistory from './pages/InterviewHistory';
import CoverLetterGenerator from './pages/CoverLetterGenerator';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-slate-950 text-white font-sans">
                <Navbar />
                <Routes>
                    <Route path="/" element={
                        <div className="flex flex-col items-center justify-center p-20 text-center">
                            <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6">
                                Campus Placement AI
                            </h1>
                            <p className="text-xl text-slate-400 max-w-2xl mb-10">
                                The future of campus hiring. Powered by Agentic AI that auto-builds features, matches candidates, and streamlines the entire process.
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <a href="/resume-analyzer" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-purple-500/20">
                                    Analyze Resume
                                </a>
                                <a href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/20">
                                    View Dashboard
                                </a>
                            </div>
                            <p className="text-slate-500 text-sm mt-8">
                                New here? Use the Login/Signup buttons in the top right corner →
                            </p>
                        </div>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/jobs" element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    } />
                    <Route path="/resume-analyzer" element={<ResumeAnalysisPage />} />
                    <Route path="/resume-dashboard" element={
                        <ProtectedRoute>
                            <ResumeDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/saved-jobs" element={
                        <ProtectedRoute>
                            <SavedJobs />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/quizzes" element={
                        <ProtectedRoute>
                            <Quizzes />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz-attempt/:categoryId" element={
                        <ProtectedRoute>
                            <QuizAttempt />
                        </ProtectedRoute>
                    } />
                    <Route path="/companies" element={
                        <ProtectedRoute>
                            <Companies />
                        </ProtectedRoute>
                    } />
                    <Route path="/placement-stats" element={
                        <ProtectedRoute>
                            <PlacementStats />
                        </ProtectedRoute>
                    } />
                    <Route path="/interview-prep" element={
                        <ProtectedRoute>
                            <InterviewPrep />
                        </ProtectedRoute>
                    } />
                    <Route path="/study-materials" element={
                        <ProtectedRoute>
                            <StudyMaterials />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    {/* AI Features */}
                    <Route path="/job-recommendations" element={
                        <ProtectedRoute>
                            <JobRecommendations />
                        </ProtectedRoute>
                    } />
                    <Route path="/ai-interview-prep" element={
                        <ProtectedRoute>
                            <AIInterviewPrep />
                        </ProtectedRoute>
                    } />
                    <Route path="/interview-history" element={
                        <ProtectedRoute>
                            <InterviewHistory />
                        </ProtectedRoute>
                    } />
                    <Route path="/cover-letter" element={
                        <ProtectedRoute>
                            <CoverLetterGenerator />
                        </ProtectedRoute>
                    } />
                    <Route path="/debug-auth" element={<DebugAuth />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
