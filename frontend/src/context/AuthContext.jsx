import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verify token and refresh user on initial load
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (!token) {
                // No token, ensure clean state
                localStorage.removeItem('user');
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                // Try server-side verification to avoid trusting stale local data
                const res = await api.get('/auth/verify');
                if (res.data?.success && res.data.user) {
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    setUser(res.data.user);
                } else if (storedUser) {
                    // Fallback to stored user if verify returned unexpected payload
                    setUser(JSON.parse(storedUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth verify failed, clearing session', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { success, message, token, user } = response.data || {};

            if (!success || !token || !user) {
                throw new Error(message || 'Login failed');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { success, message, token, user } = response.data || {};

            if (!success || !token || !user) {
                throw new Error(message || 'Registration failed');
            }

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, user };
        } catch (error) {
            console.error("Registration failed", error);
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Registration failed'
            };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            // Best-effort logout notification to backend
            await api.post('/auth/logout');
        } catch (error) {
            // Non-fatal; we still clear local state
            console.warn('Logout API call failed, clearing local session anyway', error);
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, login, register, logout, loading }),
        [user, login, register, logout, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
