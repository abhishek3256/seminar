import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard'; // NEW
import PostJob from './pages/PostJob'; // NEW
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

import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Student Dashboard */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        {/* Company Dashboard */}
                        <Route path="/company-dashboard" element={
                            <ProtectedRoute allowedRoles={['company']}>
                                <CompanyDashboard />
                            </ProtectedRoute>
                        } />

                        {/* Post Job */}
                        <Route path="/company/post-job" element={
                            <ProtectedRoute allowedRoles={['company']}>
                                <PostJob />
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
        </AuthProvider>
    );
}

export default App;
