import React from 'react';
import { useNavigate, useLocation } from 'react-router-native';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView,
} from 'react-native';
import {
  Home, BookOpen, MessageSquare, CheckCircle, Settings as SettingsIcon, LogOut,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/meetings', icon: BookOpen, label: 'PLC/Lesson Plan' },
  { to: '/chats', icon: MessageSquare, label: 'Chats' },
  { to: '/activity', icon: CheckCircle, label: 'Activity' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = to === '/meetings'
      ? location.pathname.startsWith('/meetings') || location.pathname === '/lesson-plan'
      : location.pathname === to;

    return (
      <TouchableOpacity onPress={() => navigate(to)} style={styles.navItem}>
        <Icon size={22} color={active ? theme.colors.primary : theme.colors.textMuted} />
        <Text style={[
          styles.navLabel,
          { color: active ? theme.colors.primary : theme.colors.textMuted },
          active && styles.activeNavLabel,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.logo, { color: theme.colors.primary }]}>GES PLC Toolkit</Text>
          {isAuthenticated && (
            <View style={styles.userInfo}>
              <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {currentUser?.name}
              </Text>
              <TouchableOpacity
                onPress={logout}
                style={[styles.logoutBtn, { backgroundColor: theme.colors.error + '15' }]}
              >
                <LogOut size={16} color={theme.colors.error} />
                <Text style={[styles.logoutBtnText, { color: theme.colors.error }]}>Exit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Main content */}
      <View style={styles.main}>{children}</View>

      {/* Bottom navigation */}
      {isAuthenticated && (
        <View style={[styles.bottomNav, { borderTopColor: theme.colors.border, backgroundColor: theme.colors.card }]}>
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { display: 'flex' } : {}),
  },
  header: {
    flexShrink: 0, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, zIndex: 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 4 },
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.06)' },
    }),
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontSize: 17, fontWeight: 'bold' },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  welcomeText: { fontSize: 13, maxWidth: 130 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 6, gap: 4 },
  logoutBtnText: { fontSize: 13, fontWeight: '600' },
  main: {
    flex: 1,
    ...(Platform.OS === 'web' ? { overflowY: 'auto', overflowX: 'hidden' } : { overflow: 'hidden' }),
  },
  bottomNav: {
    flexShrink: 0, flexDirection: 'row', borderTopWidth: 1, paddingVertical: 6,
    justifyContent: 'space-around', zIndex: 10,
    ...Platform.select({ web: { boxShadow: '0 -2px 4px rgba(0,0,0,0.04)' } }),
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 4 },
  navLabel: { fontSize: 9, marginTop: 3, textAlign: 'center' },
  activeNavLabel: { fontWeight: '700' },
});

export default Layout;