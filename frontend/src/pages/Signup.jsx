import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Signup failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Force a full page reload to ensure Navbar updates
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-800">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 mb-1 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="text" name="name" required
                                className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                                placeholder="John Doe"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="email" name="email" required
                                className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                                placeholder="you@example.com"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                            <input
                                type="password" name="password" required
                                className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500"
                                placeholder="••••••••"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-slate-400 mb-1 ml-1">Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 text-slate-500" size={18} />
                            <select
                                name="role"
                                className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 appearance-none"
                                onChange={handleChange}
                            >
                                <option value="student">Student</option>
                                <option value="company">Company</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4">
                        Sign Up
                    </button>
                </form>
                <p className="text-slate-400 text-center mt-6">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
