import React, { createContext, useContext, useState } from 'react';
import { teachers } from '../data/teachers';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (credentials) => {
        const phone = credentials.phoneNumber?.replace(/\s+/g, '').replace(/^\+/, '');
        const user = teachers.find(t => t.phoneNumber === phone);

        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            return { success: true, user };
        }

        return { success: false, message: 'Phone number not found. Check with your administrator.' };
    };

    const logout = () => {
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const value = {
        currentUser,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
