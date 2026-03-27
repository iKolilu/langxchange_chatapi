import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-native';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  SafeAreaView, Image, useWindowDimensions, ScrollView,
} from 'react-native';
import {
  Home, BookOpen, MessageSquare, CheckCircle,
  Settings as SettingsIcon, LogOut, Menu,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const NAV_ITEMS = [
  { to: '/home',     icon: Home,         label: 'Home' },
  { to: '/meetings', icon: BookOpen,      label: 'PLC / Lesson' },
  { to: '/chats',    icon: MessageSquare, label: 'Chats' },
  { to: '/activity', icon: CheckCircle,   label: 'Activity' },
  { to: '/settings', icon: SettingsIcon,  label: 'Settings' },
];

const Layout = ({ children }) => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const { theme }   = useTheme();
  const location    = useLocation();
  const navigate    = useNavigate();
  const { width } = useWindowDimensions();
  
  const isDesktop   = width >= 1024;
  const isTablet    = width >= 768 && width < 1024;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const initials = currentUser?.name
    ?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AO';

  const NavItem = ({ to, icon: Icon, label }) => {
    const active =
      to === '/meetings'
        ? location.pathname.startsWith('/meetings') || location.pathname === '/lesson-plan'
        : location.pathname === to;
    return (
      <TouchableOpacity 
        onPress={() => navigate(to)} 
        style={styles.navItem} 
        activeOpacity={0.7}
      >
        <View style={[styles.navIconContainer, active && styles.navIconActive]}>
          <Icon 
            size={24} 
            color={active ? '#FFFFFF' : '#64748B'} 
            strokeWidth={active ? 2.5 : 2} 
          />
        </View>
        <Text style={[
          styles.navLabel, 
          { color: active ? '#1E3A8A' : '#64748B' }, 
          active && styles.navLabelActive
        ]}>
          {label}
        </Text>
        {active && <View style={styles.navActiveBar} />}
      </TouchableOpacity>
    );
  };

  const getSidebarWidth = () => {
    if (!isAuthenticated) return 0;
    if (isDesktop || isTablet) {
      return isCollapsed ? 88 : 280;
    }
    return 0; // mobile
  };
  const currentSidebarWidth = getSidebarWidth();

  const SidebarContent = () => (
    <>
      <View style={[styles.sidebarTop, isCollapsed && styles.sidebarTopCollapsed]}>
        <View style={[styles.avatarCircle, isCollapsed && styles.avatarCircleCollapsed]}>
          <Text style={[styles.avatarText, isCollapsed && styles.avatarTextCollapsed]}>
            {initials}
          </Text>
        </View>

        {!isCollapsed && (
          <>
            <Text style={styles.sidebarName} numberOfLines={1}>
              {currentUser?.name}
            </Text>
            <View style={styles.roleChip}>
              <Text style={styles.roleChipText}>{currentUser?.role || 'Teacher'}</Text>
            </View>

            <View style={styles.sidebarDivider} />

            {currentUser?.email && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {currentUser.email}
                </Text>
              </View>
            )}
            {currentUser?.subjectsTaught?.length > 0 && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Subjects Taught</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {currentUser.subjectsTaught.join(', ')}
                </Text>
              </View>
            )}
            {currentUser?.school && (
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>School</Text>
                <Text style={styles.infoValue} numberOfLines={1}>
                  {currentUser.school}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      {/* Sign out */}
      <View style={styles.sidebarBottom}>
        {!isCollapsed && <View style={styles.sidebarDivider} />}
        <TouchableOpacity
          onPress={logout}
          style={[styles.signOutRow, isCollapsed && styles.signOutRowCollapsed]}
          activeOpacity={0.7}
        >
          <LogOut size={20} color={isCollapsed ? '#64748B' : '#EF4444'} />
          {!isCollapsed && <Text style={styles.signOutText}>Sign Out</Text>}
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={[styles.shell, { backgroundColor: '#F8FAFC' }]}>
      {/* Header */}
      {isAuthenticated && (
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <View style={styles.logoRow}>
              {isDesktop && (
                <TouchableOpacity 
                  onPress={() => setIsCollapsed(!isCollapsed)} 
                  style={styles.menuToggle} 
                  activeOpacity={0.7}
                >
                  <Menu size={22} color="#1E293B" />
                </TouchableOpacity>
              )}
              <Image source={require('../../public/logo.png')} style={styles.logoImg} resizeMode="contain" />
              <Text style={styles.logoName}>GES PLC Toolkit</Text>
            </View>
            {!isDesktop && (
              <TouchableOpacity 
                onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                style={styles.mobileAvatar} 
                activeOpacity={0.7}
              >
                <Text style={styles.mobileAvatarText}>{initials}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Mobile Menu Modal */}
      {!isDesktop && isMobileMenuOpen && (
        <View style={styles.mobileMenuOverlay}>
          <View style={styles.mobileMenu}>
            <View style={styles.mobileMenuHeader}>
              <View style={styles.mobileMenuAvatar}>
                <Text style={styles.mobileMenuAvatarText}>{initials}</Text>
              </View>
              <Text style={styles.mobileMenuName}>{currentUser?.name}</Text>
              <Text style={styles.mobileMenuRole}>{currentUser?.role || 'Teacher'}</Text>
              <TouchableOpacity 
                onPress={() => setIsMobileMenuOpen(false)} 
                style={styles.closeMenuButton}
              >
                <Text style={styles.closeMenuText}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mobileMenuDivider} />
            <View style={styles.mobileMenuContent}>
              {NAV_ITEMS.map(item => (
                <TouchableOpacity
                  key={item.to}
                  onPress={() => {
                    navigate(item.to);
                    setIsMobileMenuOpen(false);
                  }}
                  style={styles.mobileMenuItem}
                >
                  <item.icon size={22} color="#1E3A8A" />
                  <Text style={styles.mobileMenuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.mobileMenuDivider} />
              <TouchableOpacity
                onPress={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                style={[styles.mobileMenuItem, styles.mobileSignOut]}
              >
                <LogOut size={22} color="#EF4444" />
                <Text style={[styles.mobileMenuItemText, { color: '#EF4444' }]}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Body: sidebar + main */}
      <View style={styles.body}>
        {/* Sidebar - Desktop */}
        {isAuthenticated && isDesktop && (
          <View style={[styles.sidebar, isCollapsed && styles.sidebarCollapsed]}>
            <SidebarContent />
          </View>
        )}

        {/* Sidebar - Tablet (always visible but collapsible) */}
        {isAuthenticated && isTablet && !isDesktop && (
          <View style={[styles.sidebarTablet, isCollapsed && styles.sidebarCollapsed]}>
            <SidebarContent />
          </View>
        )}

        {/* Main Content */}
        <View style={styles.mainWrapper}>
          <ScrollView 
            style={styles.main}
            contentContainerStyle={styles.mainContent}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

        </View>
      </View>

      {/* Bottom Navigation - Always visible, perfectly sticky, respecting sidebar width dynamically */}
      {isAuthenticated && (
        <View style={[styles.bottomNavWrapper, { left: Platform.OS === 'web' ? currentSidebarWidth : 0 }]}>
          <View style={styles.bottomNav}>
            {NAV_ITEMS.map(item => (
              <NavItem key={item.to} {...item} />
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shell: {
    flex: 1, 
    flexDirection: 'column', 
    overflow: 'hidden',
    height: Platform.OS === 'web' ? '100vh' : '100%',
    ...(Platform.OS === 'web' ? { display: 'flex' } : {}),
  },
  header: {
    flexShrink: 0, 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0',
    paddingVertical: 14, 
    paddingHorizontal: 24, 
    zIndex: 200,
    ...Platform.select({ 
      web: { boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' } 
    }),
  },
  headerInner: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  logoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  menuToggle: { 
    padding: 8, 
    borderRadius: 8, 
    backgroundColor: '#F1F5F9',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  logoImg: { 
    width: 36, 
    height: 36, 
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  logoName: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1E3A8A', 
    letterSpacing: -0.5,
  },
  mobileAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#1E3A8A', 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mobileAvatarText: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#FFFFFF' 
  },

  body: { 
    flex: 1, 
    flexDirection: 'row', 
    overflow: 'hidden',
    alignItems: 'stretch', // strictly stretch to fit height
  },

  /* Sidebar - Desktop */
  sidebar: {
    width: 280, 
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1, 
    borderRightColor: '#E2E8F0',
    flexDirection: 'column', 
    justifyContent: 'space-between',
    minHeight: '100%',
    ...Platform.select({ web: { height: '100vh', alignSelf: 'stretch' } }),
  },
  sidebarTablet: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '100%',
    ...Platform.select({ web: { height: '100vh', alignSelf: 'stretch' } }),
  },
  sidebarCollapsed: {
    width: 88,
  },
  sidebarTop: { 
    padding: 24,
    flex: 1,
  },
  sidebarTopCollapsed: { 
    paddingHorizontal: 12, 
    paddingVertical: 24, 
    alignItems: 'center' 
  },

  avatarCircle: {
    width: 60, 
    height: 60, 
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 16, 
    alignSelf: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarCircleCollapsed: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    marginBottom: 0,
  },
  avatarText: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#FFFFFF' 
  },
  avatarTextCollapsed: { 
    fontSize: 14 
  },

  sidebarName: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#0F172A', 
    textAlign: 'center', 
    marginBottom: 6 
  },
  roleChip: { 
    alignSelf: 'center', 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    marginBottom: 4 
  },
  roleChipText: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#1D4ED8' 
  },
  sidebarDivider: { 
    height: 1, 
    backgroundColor: '#E2E8F0', 
    marginVertical: 20 
  },
  infoBlock: { 
    marginBottom: 20 
  },
  infoLabel: { 
    fontSize: 11, 
    fontWeight: '600', 
    color: '#64748B', 
    marginBottom: 6, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#1E293B', 
    lineHeight: 20 
  },

  sidebarBottom: {
    marginTop: 'auto',
  },
  signOutRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12,
    paddingVertical: 18, 
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  signOutRowCollapsed: {
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 24,
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0',
  },
  signOutText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#EF4444' 
  },

  /* Main Wrapper */
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative', // anchoring context for absolute bottom nav
  },
  main: {
    flex: 1,
  },
  mainContent: {
    paddingBottom: 100, // ensure content isn't hidden behind absolute bottom nav
  },

  /* Bottom Navigation */
  bottomNavWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, 
    borderTopColor: '#E2E8F0',
    zIndex: 1000,
    ...Platform.select({
      ios:     { position: 'absolute', bottom: 0, left: 0, right: 0, shadowColor: '#64748B', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { position: 'absolute', bottom: 0, left: 0, right: 0, elevation: 8 },
      web:     { position: 'fixed', bottom: 0, right: 0, boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.05)' }
    }),
  },
  bottomNav: {
    flexDirection: 'row', 
    justifyContent: 'space-around',
    paddingTop: 8, 
    paddingBottom: Platform.OS === 'web' ? 12 : 28, 
    paddingHorizontal: 8,
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 8, 
    position: 'relative' 
  },
  navIconContainer: {
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  navIconActive: {
    backgroundColor: '#1E3A8A',
  },
  navLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginTop: 4 
  },
  navLabelActive: { 
    fontWeight: '800',
    color: '#1E3A8A',
  },
  navActiveBar: { 
    position: 'absolute', 
    bottom: -8, 
    width: 32, 
    height: 3, 
    backgroundColor: '#1E3A8A', 
    borderRadius: 2,
  },

  /* Mobile Menu */
  mobileMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  mobileMenu: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  mobileMenuHeader: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    position: 'relative',
  },
  mobileMenuAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mobileMenuAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  mobileMenuName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  mobileMenuRole: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  closeMenuButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeMenuText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 28,
  },
  mobileMenuDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  mobileMenuContent: {
    padding: 16,
  },
  mobileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 4,
  },
  mobileMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  mobileSignOut: {
    marginTop: 8,
  },
});

export default Layout;