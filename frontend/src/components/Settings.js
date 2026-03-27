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
            style={[styles.item, { borderBottomColor: colors.border }]}
            onPress={onPress}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Icon size={20} color={colors.primary} />
                </View>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {value && <Text style={[styles.value, { color: colors.textSecondary }]}>{value}</Text>}
                <ChevronRight size={20} color={colors.textMuted} />
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
                ]}
                onPress={() => setThemeMode(mode)}
            >
                <Icon size={20} color={isActive ? '#FFFFFF' : colors.textSecondary} />
                <Text style={[styles.themeLabel, { color: isActive ? '#FFFFFF' : colors.text }]}>
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.content} scrollEnabled={Platform.OS !== 'web'}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
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

                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>
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
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
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
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 14,
        marginRight: 8,
    },
    themeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    themeOption: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    themeLabel: {
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Settings;
