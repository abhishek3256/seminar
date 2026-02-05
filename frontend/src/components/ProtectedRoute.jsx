import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    // Simplified - just check if user is logged in
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    console.log('🔒 ProtectedRoute Check:', {
        hasToken: !!token,
        hasUser: !!userStr,
        allowedRoles
    });

    // Not logged in - redirect to login
    if (!token || !userStr) {
        console.log('❌ Not logged in - redirecting to /login');
        return <Navigate to="/login" replace />;
    }

    // Parse user data
    let user;
    try {
        user = JSON.parse(userStr);
        console.log('✅ User logged in:', user.email, 'Role:', user.role);
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        return <Navigate to="/login" replace />;
    }

    // Check role if required
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('🚫 Access denied - wrong role');
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
                <div className="bg-slate-900 border border-red-500/50 rounded-xl p-8 max-w-md text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-slate-400 mb-6">
                        You don't have permission to access this page.
                        Required role: <span className="text-red-400 font-semibold">{allowedRoles.join(', ')}</span>
                    </p>
                    <p className="text-slate-500 text-sm">
                        Your role: <span className="text-blue-400">{user.role || 'Not assigned'}</span>
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated and authorized - render children
    console.log('✅ Access granted - rendering page');
    return children;
};

export default ProtectedRoute;
