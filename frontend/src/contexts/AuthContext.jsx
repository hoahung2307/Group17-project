import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const response = await api.get('/user/profile');
            setUser(response.data.user);
        } catch (error) {
            if (error.response?.status !== 401) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await checkUser();
            } catch (error) {
                console.error('Auth verification failed:', error);
                setUser(null);
                setLoading(false);
            }
        };
        
        verifyAuth();
    }, []);

    const login = async () => {
        await checkUser();
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
