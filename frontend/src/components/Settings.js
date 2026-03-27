import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useNavigate } from 'react-router-native';
import { User, Server, Sun, Moon, Monitor, ChevronRight, CreditCard } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
    const navigate = useNavigate();
    const { theme, themeMode, setThemeMode } = useTheme();
    const { logout } = useAuth();
    const { colors, spacing, borderRadius } = theme;

    const handleLogout = () => {
        logout();
    };

    const SettingItem = ({ icon: Icon, label, onPress, value }) => (
        <TouchableOpacity
            style={[styles.item, { borderBottomColor: colors.borderLight }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primarySurface }]}>
                    <Icon size={18} color={colors.primary} />
                </View>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
                <ChevronRight size={18} color={colors.textMuted} />
            </View>
        </TouchableOpacity>
    );

    const ThemeOption = ({ mode, label, icon: Icon }) => {
        const isActive = themeMode === mode;
        return (
            <TouchableOpacity
                style={[
                    styles.themeOption,
                    {
                        backgroundColor: isActive ? colors.primary : colors.background,
                        borderColor: isActive ? colors.primary : colors.border,
                    },
                    isActive && Platform.select({
                        ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8 },
                        web: { boxShadow: `0 3px 12px rgba(30, 58, 138, 0.3)` },
                    }),
                ]}
                onPress={() => setThemeMode(mode)}
                activeOpacity={0.7}
            >
                <Icon size={18} color={isActive ? '#FFFFFF' : colors.textSecondary} />
                <Text style={[styles.themeLabel, { color: isActive ? '#FFFFFF' : colors.text }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content} scrollEnabled={Platform.OS !== 'web'}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <SettingItem
                        icon={User}
                        label="User Profile"
                        onPress={() => navigate('/settings/profile')}
                    />
                    <SettingItem
                        icon={Server}
                        label="Services"
                        onPress={() => navigate('/settings/services')}
                    />
                    <SettingItem
                        icon={CreditCard}
                        label="Identifications"
                        onPress={() => navigate('/settings/identifications')}
                    />
                </View>

                <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: spacing.lg }]}>
                    APPEARANCE
                </Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: spacing.md }]}>
                    <View style={styles.themeContainer}>
                        <ThemeOption mode="light" label="Light" icon={Sun} />
                        <ThemeOption mode="dark" label="Dark" icon={Moon} />
                        <ThemeOption mode="system" label="System" icon={Monitor} />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.logoutButton, { marginTop: spacing.xl }]}
                    onPress={handleLogout}
                    activeOpacity={0.8}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 32 },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
            android: { elevation: 3 },
            web: { boxShadow: '0 4px 16px rgba(15, 37, 87, 0.06)' },
        }),
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 13,
        marginRight: 8,
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    themeOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1.5,
    },
    themeLabel: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '600',
    },
    logoutButton: {
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: '#DC2626',
        ...Platform.select({
            ios: { shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
            android: { elevation: 6 },
            web: { boxShadow: '0 4px 16px rgba(220, 38, 38, 0.3)', cursor: 'pointer', transition: 'transform 0.15s ease' },
        }),
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default Settings;
