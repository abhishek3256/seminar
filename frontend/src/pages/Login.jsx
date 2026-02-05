import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Login failed');

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
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mt-4">
                        Login
                    </button>
                </form>
                <p className="text-slate-400 text-center mt-6">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
                </p>
                <div className="mt-4 text-center text-xs text-slate-600">
                    <p>Try Admin: <b>admin@example.com</b> / <b>Admin@2024#Secure</b></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
