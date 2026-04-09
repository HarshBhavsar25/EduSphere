import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);       // { username, role, student_id, email }
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);  // true while verifying on mount

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('auth_token');
            if (!storedToken) {
                setLoading(false);
                return;
            }

            try {
                // Call the verify endpoint using api.request to validate the real JWT
                const validUser = await api.request('/api/auth/verify');
                setToken(storedToken);
                setUser(validUser);
            } catch (err) {
                console.error('Invalid token', err);
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');
            }
            setLoading(false);
        };
        verifyToken();
    }, []);

    const login = useCallback((tokenVal, userObj) => {
        localStorage.setItem('auth_token', tokenVal);
        localStorage.setItem('auth_user', JSON.stringify(userObj));
        setToken(tokenVal);
        setUser(userObj);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken(null);
        setUser(null);
    }, []);

    const isAdmin = () => user?.role === 'admin';
    const isStudent = () => user?.role === 'student';

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isStudent }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
