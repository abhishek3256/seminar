import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
    const [authData, setAuthData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        let user = null;
        try {
            user = userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error parsing user:', e);
        }

        setAuthData({
            hasToken: !!token,
            token: token ? `${token.substring(0, 20)}...` : 'null',
            hasUser: !!userStr,
            userStr: userStr || 'null',
            user: user,
            userRole: user?.role || 'undefined',
            userName: user?.name || 'undefined',
            userEmail: user?.email || 'undefined'
        });
    }, []);

    const clearAuth = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    };

    const testLogin = () => {
        // Simulate a login
        const mockUser = {
            id: '123',
            name: 'Test User',
            email: 'test@example.com',
            role: 'admin'
        };
        localStorage.setItem('token', 'mock-token-12345');
        localStorage.setItem('user', JSON.stringify(mockUser));
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-blue-400">🔍 Authentication Debug Panel</h1>

                {/* Auth Status */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Authentication Status</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm mb-1">Token Present</p>
                            <p className={`text-2xl font-bold ${authData.hasToken ? 'text-green-400' : 'text-red-400'}`}>
                                {authData.hasToken ? '✅ YES' : '❌ NO'}
                            </p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm mb-1">User Data Present</p>
                            <p className={`text-2xl font-bold ${authData.hasUser ? 'text-green-400' : 'text-red-400'}`}>
                                {authData.hasUser ? '✅ YES' : '❌ NO'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Token Details */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Token Details</h2>
                    <div className="bg-slate-800 p-4 rounded-lg font-mono text-sm break-all">
                        {authData.token}
                    </div>
                </div>

                {/* User Data */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">User Data</h2>
                    <div className="space-y-3">
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm">Name</p>
                            <p className="text-lg font-semibold">{authData.userName}</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm">Email</p>
                            <p className="text-lg font-semibold">{authData.userEmail}</p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <p className="text-slate-400 text-sm">Role</p>
                            <p className="text-lg font-semibold text-blue-400">{authData.userRole}</p>
                        </div>
                    </div>
                </div>

                {/* Raw JSON */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Raw User JSON</h2>
                    <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto text-sm">
                        {JSON.stringify(authData.user, null, 2)}
                    </pre>
                </div>

                {/* Actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-4">Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Go to Login
                        </button>
                        <button
                            onClick={testLogin}
                            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Test Login (Mock)
                        </button>
                        <button
                            onClick={clearAuth}
                            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Clear Auth & Reload
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>

                {/* Console Instructions */}
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-2 text-blue-400">📋 Check Browser Console</h3>
                    <p className="text-slate-300 mb-2">Press <kbd className="bg-slate-800 px-2 py-1 rounded">F12</kbd> to open DevTools and check the Console tab for detailed logs.</p>
                    <p className="text-slate-400 text-sm">Look for messages starting with 🔒, ✅, or ❌</p>
                </div>
            </div>
        </div>
    );
};

export default DebugAuth;
