import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTES from "../config/routeCongif.ts";
import AUTH from "../config/authConfig.ts";
import { useLogin } from "../hooks/useAuth.ts";

interface AuthContextProps {
    isAuthenticated: boolean;
    role: string;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const { loginHandler } = useLogin(setIsAuthenticated);

    const login = async (email: string, password: string) => {
        try {
            await loginHandler(email, password);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRole('');
        localStorage.removeItem(AUTH.TOKEN_KEY);
        navigate(ROUTES.LOGIN);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }
    return context;
};
