import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'

    const isDark = themeMode === 'system' ? systemColorScheme === 'dark' : themeMode === 'dark';

    const theme = {
        colors: {
            primary: '#3B82F6',
            background: isDark ? '#111827' : '#F9FAFB',
            card: isDark ? '#1F2937' : '#FFFFFF',
            text: isDark ? '#F9FAFB' : '#111827',
            textSecondary: isDark ? '#9CA3AF' : '#4B5563',
            textMuted: isDark ? '#6B7280' : '#9CA3AF',
            border: isDark ? '#374151' : '#E5E7EB',
            error: '#EF4444',
            success: '#10B981',
            headerBackground: isDark ? '#1F2937' : '#FFFFFF',
        },
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
        },
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
        },
        isDark,
    };

    const value = {
        theme,
        themeMode,
        setThemeMode,
        isDark
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
