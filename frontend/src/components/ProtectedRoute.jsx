import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const [isAuthorized, setIsAuthorized] = useState(null); // null = checking, true = authorized, false = unauthorized

    useEffect(() => {
        console.log('🔒 ProtectedRoute: Starting auth check...');

        // Add timeout to prevent infinite "Checking authentication..." state
        const authTimeout = setTimeout(() => {
            console.error('⏱️ ProtectedRoute: Auth check timeout - redirecting to login');
            setIsAuthorized(false);
        }, 2000);

        // Get user from localStorage
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        console.log('🔒 ProtectedRoute: Token exists?', !!token);
        console.log('🔒 ProtectedRoute: User data exists?', !!userStr);

        // No token or user data - not logged in
        if (!token || !userStr) {
            console.log('❌ ProtectedRoute: No token or user data found');
            clearTimeout(authTimeout);
            setIsAuthorized(false);
            return;
        }

        try {
            const user = JSON.parse(userStr);
            console.log('✅ ProtectedRoute: User parsed:', {
                name: user.name,
                email: user.email,
                role: user.role,
                allowedRoles
            });

            // If no role is specified, assign default 'student' role for backward compatibility
            if (!user || !user.role) {
                console.warn('⚠️ ProtectedRoute: User missing role, defaulting to student');
                user.role = 'student';
            }

            // Check if user role is allowed (only if specific roles are required)
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                console.log('🚫 ProtectedRoute: User role not allowed', { userRole: user.role, allowedRoles });
                clearTimeout(authTimeout);
                setIsAuthorized('denied');
                return;
            }

            // User is authenticated and authorized
            console.log('✅ ProtectedRoute: Access granted!');
            clearTimeout(authTimeout);
            setIsAuthorized(true);
        } catch (error) {
            console.error('❌ ProtectedRoute: Error parsing user data:', error);
            clearTimeout(authTimeout);
            setIsAuthorized(false);
        }

        return () => clearTimeout(authTimeout);
    }, [allowedRoles]);

    // Show loading state while checking
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-white">Checking authentication...</div>
            </div>
        );
    }

    // Not authorized - redirect to login
    if (isAuthorized === false) {
        return <Navigate to="/login" replace />;
    }

    // Access denied - show error message
    if (isAuthorized === 'denied') {
        const userStr = localStorage.getItem('user');
        let user = {};
        try {
            user = userStr ? JSON.parse(userStr) : {};
        } catch (e) {
            console.error('Error parsing user:', e);
        }

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

    // User is authenticated and authorized
    return children;
};

export default ProtectedRoute;
