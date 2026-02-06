import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, GraduationCap, Building2, User, Phone, Briefcase as BriefcaseIcon } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student', // Default role
        fullName: '',
        phone: '',
        companyName: '',
        companyEmail: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        if (!formData.email || !formData.password) {
            return 'Email and password are required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return 'Please enter a valid email address';
        }
        if (formData.password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        if (formData.role === 'student') {
            if (!formData.fullName || !formData.phone) {
                return 'Full name and phone are required for student registration';
            }
        }
        if (formData.role === 'company') {
            if (!formData.companyName || !formData.companyEmail) {
                return 'Company name and company email are required for company registration';
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        const payload =
            formData.role === 'student'
                ? {
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    fullName: formData.fullName,
                    phone: formData.phone,
                }
                : {
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    companyName: formData.companyName,
                    companyEmail: formData.companyEmail,
                };

        const result = await register(payload);

        if (result.success) {
            navigate(result.user.role === 'company' ? '/company-dashboard' : '/dashboard');
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-md w-full space-y-8 bg-slate-900/50 p-8 rounded-xl shadow-xl border border-slate-800 backdrop-blur-sm relative z-10">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-slate-400">Join the campus placement portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'student' })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${formData.role === 'student'
                                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <User size={24} className="mb-2" />
                            <span className="font-medium text-sm">Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'company' })}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${formData.role === 'company'
                                ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            <Building2 size={24} className="mb-2" />
                            <span className="font-medium text-sm">Company</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Shared fields */}
                        <div className="relative group">
                            <Mail className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                            <input
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        {/* Role-specific fields */}
                        {formData.role === 'student' && (
                            <>
                                <div className="relative group">
                                    <User className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition sm:text-sm"
                                        placeholder="Full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Phone className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition" />
                                    <input
                                        type="tel"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition sm:text-sm"
                                        placeholder="Phone number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </>
                        )}

                        {formData.role === 'company' && (
                            <>
                                <div className="relative group">
                                    <Building2 className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition" />
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition sm:text-sm"
                                        placeholder="Company name"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    />
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute top-3 left-3 h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition" />
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition sm:text-sm"
                                        placeholder="Company email"
                                        value={formData.companyEmail}
                                        onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <span className="text-slate-400">Already have an account? </span>
                        <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 transition">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
