import React from 'react';
import { useNavigate, useLocation } from 'react-router-native';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, SafeAreaView, Image, useWindowDimensions
} from 'react-native';
import {
  Home, BookOpen, MessageSquare, CheckCircle, Settings as SettingsIcon, LogOut,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/meetings', icon: BookOpen, label: 'PLC / Lesson' },
  { to: '/chats', icon: MessageSquare, label: 'Chats' },
  { to: '/activity', icon: CheckCircle, label: 'Activity' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const { colors, shadows } = theme;
  const location = useLocation();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = to === '/meetings'
      ? location.pathname.startsWith('/meetings') || location.pathname === '/lesson-plan'
      : location.pathname === to;

    return (
      <TouchableOpacity onPress={() => navigate(to)} style={styles.navItem} activeOpacity={0.7}>
        <View style={styles.navIconWrap}>
          <Icon
            size={22}
            color={active ? colors.primary : colors.textMuted}
            style={active ? styles.navIconActive : null}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { color: active ? colors.primary : colors.textMuted },
          active && styles.activeNavLabel,
        ]}>
          {label}
        </Text>
        {active && <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Pristine White Professional Header - Only for authenticated dashboard */}
      {isAuthenticated && (
        <View style={[styles.header, {
          backgroundColor: colors.headerBackground,
          borderBottomColor: colors.borderLight,
        }]}>
          <View style={styles.headerContent}>
            <View style={styles.logoRow}>
              <Image
                source={require('../../public/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View>
                <Text style={[styles.logo, { color: colors.primaryDark }]}>GES PLC Toolkit</Text>
                <View style={[styles.goldAccent, { backgroundColor: colors.gold }]} />
              </View>
            </View>
            {!isDesktop && (
              <View style={styles.userInfo}>
                <View style={[styles.userAvatar, { backgroundColor: colors.primarySurface }]}>
                  <Text style={[styles.userAvatarText, { color: colors.primary }]}>
                    {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={logout}
                  style={[styles.logoutBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                  activeOpacity={0.7}
                >
                  <LogOut size={14} color={colors.error} />
                  <Text style={[styles.logoutBtnText, { color: colors.error }]}>Exit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Container for Sidebar + Main Content */}
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Desktop Sidebar (Avatar, Profile, Logout) */}
        {isAuthenticated && isDesktop && (
          <View style={[styles.desktopSidebar, { backgroundColor: colors.card, borderRightColor: colors.borderLight }]}>
             <View style={styles.sidebarProfile}>
               <View style={[styles.sidebarAvatar, { backgroundColor: colors.primarySurface }]}>
                 <Text style={[styles.sidebarAvatarText, { color: colors.primary }]}>
                   {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                 </Text>
               </View>
               <Text style={[styles.sidebarName, { color: colors.text }]}>{currentUser?.name}</Text>
               <Text style={[styles.sidebarRole, { color: colors.textSecondary }]}>{currentUser?.role}</Text>
             </View>
             
             <View style={{ flex: 1 }} />
             
             <TouchableOpacity
                onPress={logout}
                style={[styles.sidebarLogoutBtn, { backgroundColor: '#FEF2F2', borderColor: '#FECACA' }]}
                activeOpacity={0.7}
             >
                <LogOut size={16} color={colors.error} />
                <Text style={[styles.sidebarLogoutBtnText, { color: colors.error }]}>Sign Out</Text>
             </TouchableOpacity>
          </View>
        )}

        {/* Main content - ensure margin bottom so it's not hidden behind nav */}
        <View style={[styles.main, isAuthenticated && styles.mainWithNav]}>
          {children}
        </View>
      </View>

      {/* Crisp White Sticky Bottom Navigation */}
      {isAuthenticated && (
        <View style={[styles.bottomNav, {
          backgroundColor: colors.navBackground,
          borderTopColor: colors.borderLight,
        }]}>
          {NAV_ITEMS.map(item => (
            <NavItem key={item.to} {...item} />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Platform.OS === 'web' ? '100vh' : '100%',
    flexDirection: 'column',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { display: 'flex' } : {}),
  },
  header: {
    flexShrink: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 100,
    ...Platform.select({
      ios: { shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { 
        boxShadow: '0 4px 20px rgba(15, 37, 87, 0.05)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      },
    }),
  },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImage: { width: 34, height: 34, borderRadius: 6 },
  logo: { fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
  goldAccent: { height: 2, width: 30, borderRadius: 1, marginTop: 2, shadowColor: '#D4AF37', shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  userAvatar: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#BFDBFE',
  },
  userAvatarText: { fontSize: 12, fontWeight: '800' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, gap: 6, borderWidth: 1,
  },
  logoutBtnText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },
  main: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? { overflowY: 'auto', overflowX: 'hidden' }
      : { overflow: 'hidden' }),
  },
  mainWithNav: {
    // Prevents content from being hidden behind the sticky bottom nav
    ...Platform.select({
      web: { paddingBottom: 80 }
    })
  },
  bottomNav: {
    flexShrink: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'web' ? 12 : 24, 
    justifyContent: 'space-around',
    zIndex: 100,
    ...Platform.select({
      ios: { paddingBottom: 24 },
      android: { paddingBottom: 8 },
      web: {
        boxShadow: '0 -4px 20px rgba(15, 37, 87, 0.05)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        position: 'fixed',
        bottom: 0, left: 0, right: 0, 
      },
    }),
  },
  navItem: {
    alignItems: 'center', justifyContent: 'center',
    flex: 1, position: 'relative', height: '100%',
  },
  navIconWrap: {
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  navIconActive: {
    ...Platform.select({ web: { transform: 'scale(1.1)' } })
  },
  navLabel: { fontSize: 10, textAlign: 'center', fontWeight: '600', letterSpacing: 0.3 },
  activeNavLabel: { fontWeight: '800' },
  activeIndicator: {
    position: 'absolute', top: -8,
    width: 32, height: 3, borderBottomLeftRadius: 3, borderBottomRightRadius: 3,
  },
  desktopSidebar: {
    width: 250,
    borderRightWidth: 1,
    padding: 24,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexShrink: 0,
    zIndex: 10,
  },
  sidebarProfile: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  sidebarAvatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#BFDBFE',
    marginBottom: 16,
  },
  sidebarAvatarText: { fontSize: 26, fontWeight: '800' },
  sidebarName: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  sidebarRole: { fontSize: 13, textAlign: 'center', fontWeight: '600' },
  sidebarLogoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, paddingHorizontal: 16,
    borderRadius: 12, gap: 8, borderWidth: 1, width: '100%'
  },
  sidebarLogoutBtnText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
});

export default Layout;