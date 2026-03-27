import React from 'react';
import { useNavigate } from 'react-router-native';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { sampleMeetings } from '../data/sampleData';
import { ROLES } from '../data/teachers';
import { useTheme } from '../contexts/ThemeContext';
import { ChevronRight, MessageSquare, BookOpen, CheckCircle, PlusCircle } from 'lucide-react-native';

const isTeacherRole = r =>
  r === ROLES.CLASS_TEACHER || r === ROLES.SUBJECT_TEACHER;

const Home = () => {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();
  const { theme }       = useTheme();
  const { colors }      = theme;
  const { width }       = useWindowDimensions();
  const isDesktop       = width >= 1024;

  const isTeacher  = isTeacherRole(currentUser?.role);
  const completed  = sampleMeetings.filter(m => m.status === 'completed').length;
  const upcoming   = sampleMeetings.filter(m => m.status !== 'completed').length;
  const recentList = [...sampleMeetings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  const stats = isTeacher
    ? [
        { label: 'PLC Sessions', value: sampleMeetings.length },
        { label: 'Completed',    value: completed },
        { label: 'Upcoming',     value: upcoming },
        { label: 'Subjects',     value: currentUser?.subjectsTaught?.length || 0 },
      ]
    : [
        { label: 'Total Sessions', value: sampleMeetings.length },
        { label: 'Completed',      value: completed },
        { label: 'Upcoming',       value: upcoming },
        { label: 'Pilot Schools',  value: 55 },
      ];

  const quickActions = [
    { label: 'PLC / AI Chat', icon: MessageSquare, bg: '#3B82F6', to: '/meetings' },
    { label: 'Lesson Plans',  icon: BookOpen,      bg: '#F59E0B', to: '/lesson-plan' },
    { label: 'Chats',         icon: MessageSquare, bg: '#60A5FA', to: '/chats' },
    { label: 'Approvals',     icon: CheckCircle,   bg: '#6366F1', to: '/approvals' },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F8FAFC' }}
      contentContainerStyle={styles.page}
      scrollEnabled={Platform.OS !== 'web'}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome */}
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>
          Welcome back, {currentUser?.name?.split(' ')[0]}! 👋
        </Text>
      </View>

      {/* Overview cards */}
      <View style={styles.overviewRow}>
        {stats.map((s, i) => (
          <View key={i} style={[styles.statCard, isDesktop ? { flex: 1, marginRight: i !== stats.length - 1 ? 16 : 0 } : { width: '47%', marginBottom: 16 }]}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <View style={styles.statValueRow}>
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Two-column on desktop: Sessions + Actions */}
      <View style={[styles.mainRow, isDesktop && { flexDirection: 'row' }]}>

        {/* Recent sessions */}
        <View style={[styles.sessionsCard, isDesktop && { flex: 2.2, marginRight: 24 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent PLC Sessions</Text>
            <TouchableOpacity onPress={() => navigate('/meetings')} activeOpacity={0.7}>
              <Text style={styles.linkText}>View All →</Text>
            </TouchableOpacity>
          </View>

          {recentList.map((m, idx) => {
            const done = m.status === 'completed';
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.sessionItem, idx < recentList.length - 1 && styles.itemBorder]}
                onPress={() => navigate(`/meetings/${m.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.statusDot, { backgroundColor: done ? '#10B981' : '#3B82F6' }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionTitle} numberOfLines={1}>{m.title}</Text>
                  <Text style={styles.sessionMeta}>
                    {new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {m.time}
                  </Text>
                </View>
                <Text style={[styles.sessionStatus, { color: done ? '#10B981' : '#3B82F6' }]}>
                  {done ? 'Completed' : 'Upcoming'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick actions */}
        <View style={[styles.actionsCard, isDesktop && { flex: 1 }]}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <View style={styles.actionsList}>
            {quickActions.map((a, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionItem}
                onPress={() => navigate(a.to)}
                activeOpacity={0.8}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, { backgroundColor: a.bg }]}>
                    <a.icon size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </View>
                <ChevronRight size={20} color="#3B82F6" strokeWidth={2.5} />
              </TouchableOpacity>
            ))}
          </View>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  page: { 
    padding: 24, 
    paddingBottom: 40,
  },

  welcomeSection: {
    marginBottom: 24,
  },
  greeting: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#0F172A',
    letterSpacing: -0.5,
  },

  /* Stats Overlay Row */
  overviewRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, 
    padding: 20,
    ...Platform.select({
      ios:     { shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(100, 116, 139, 0.06)' },
    }),
  },
  statLabel: { fontSize: 14, fontWeight: '700', color: '#64748B', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statValue: { fontSize: 36, fontWeight: '800', color: '#0F172A', letterSpacing: -1 },

  mainRow: { gap: 24 },

  /* Cards */
  sessionsCard: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 24,
    ...Platform.select({
      ios:     { shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(100, 116, 139, 0.06)' },
    }),
  },
  actionsCard: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 24,
    ...Platform.select({
      ios:     { shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(100, 116, 139, 0.06)' },
    }),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  cardTitle:  { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  linkText:   { fontSize: 13, fontWeight: '700', color: '#3B82F6' },

  /* List Items */
  sessionItem: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    gap: 14, 
    paddingVertical: 18,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  statusDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0, marginTop: 4 },
  sessionTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  sessionMeta: { fontSize: 13, fontWeight: '500', color: '#94A3B8' },
  sessionStatus: { fontSize: 13, fontWeight: '700' },

  /* Actions List */
  actionsList: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 10,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#334155' },
});

export default Home;