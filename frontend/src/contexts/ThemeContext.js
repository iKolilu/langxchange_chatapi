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
    // Professional Light Mode with Preloader Colors (Navy & Gold)
    const [themeMode, setThemeMode] = useState('light'); 

    const isDark = false; 

    const theme = {
        colors: {
            // Brand Core — Navy & Gold (Preloader aesthetic)
            primary: '#1E3A8A',       // Premium Deep Blue
            primaryLight: '#2563EB',
            primaryDark: '#0F2557',   // Institutional Navy
            primarySurface: '#EFF6FF',

            // Gold accent
            gold: '#D4A843',
            goldLight: '#F5E6C8',
            goldDark: '#B8922E',

            // Backgrounds - Clean, Professional Light Mode
            background: '#F0F4F8',    // Very light cool gray
            card: '#FFFFFF',          // Crisp white cards
            cardElevated: '#FFFFFF',
            surfaceHover: '#F8FAFC',
            headerBackground: 'rgba(255, 255, 255, 0.95)',
            navBackground: 'rgba(255, 255, 255, 0.95)',
            inputBackground: '#F8FAFC',

            // Text
            text: '#0F172A',
            textSecondary: '#475569',
            textMuted: '#64748B',
            textInverse: '#FFFFFF',

            // Borders
            border: '#E2E8F0',
            borderLight: '#F1F5F9',

            // Status
            error: '#DC2626',
            success: '#059669',
            warning: '#D97706',
            info: '#2563EB',

            // Gradients
            gradientPrimary: ['#0F2557', '#1E3A8A'],
            gradientHeader: ['#FFFFFF', '#F8FAFC'],
            gradientGold: ['#D4A843', '#B8922E'],
        },
        shadows: {
            sm: {
                shadowColor: '#0F2557',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
            },
            md: {
                shadowColor: '#0F2557',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
                elevation: 4,
            },
            lg: {
                shadowColor: '#0F2557',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.12,
                shadowRadius: 24,
                elevation: 8,
            },
            gold: {
                shadowColor: '#D4A843',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 6,
            },
            button3D: {
                shadowColor: '#0F2557',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.15,
                shadowRadius: 10,
                elevation: 8,
            },
        },
        spacing: {
            xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
        },
        borderRadius: {
            sm: 8, md: 12, lg: 16, xl: 24, pill: 9999,
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
