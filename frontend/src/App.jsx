import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';
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
import Applications from './pages/Applications';
import Schedule from './pages/Schedule';
import PlacementCalendar from './pages/PlacementCalendar';

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
                    <Routes>
                        <Route path="/" element={<><Navbar /><Home /></>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Student Dashboard & Routes using New Layout */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/jobs" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <Jobs />
                            </ProtectedRoute>
                        } />

                        <Route path="/applications" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <Applications />
                            </ProtectedRoute>
                        } />

                        <Route path="/schedule" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <Schedule />
                            </ProtectedRoute>
                        } />

                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        {/* Company Routes (Legacy/Separate) - Adding Navbar wrapper temporarily if needed or assuming they need update */}
                        <Route path="/company-dashboard" element={
                            <ProtectedRoute allowedRoles={['company']}>
                                <><Navbar /><CompanyDashboard /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/company/post-job" element={
                            <ProtectedRoute allowedRoles={['company']}>
                                <><Navbar /><PostJob /></>
                            </ProtectedRoute>
                        } />

                        {/* Other Routes */}
                        <Route path="/resume-analyzer" element={<><Navbar /><ResumeAnalysisPage /></>} />

                        <Route path="/resume-dashboard" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><ResumeDashboard /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/saved-jobs" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><SavedJobs /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/quizzes" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><Quizzes /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/quiz-attempt/:categoryId" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><QuizAttempt /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/companies" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><Companies /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/placement-stats" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><PlacementStats /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/interview-prep" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><InterviewPrep /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/study-materials" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><StudyMaterials /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <><Navbar /><AdminDashboard /></>
                            </ProtectedRoute>
                        } />

                        {/* AI Features */}
                        <Route path="/job-recommendations" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><JobRecommendations /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/ai-interview-prep" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><AIInterviewPrep /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/interview-history" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><InterviewHistory /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/cover-letter" element={
                            <ProtectedRoute>
                                <><Navbar /><CoverLetterGenerator /></>
                            </ProtectedRoute>
                        } />

                        <Route path="/placement-calendar" element={
                            <ProtectedRoute allowedRoles={['student']}>
                                <><Navbar /><PlacementCalendar /></>
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
