import React from 'react';
import { useNavigate } from 'react-router-native';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, useWindowDimensions
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { sampleMeetings } from '../data/sampleData';
import {
  Users, MapPin, School, Calendar, CheckCircle, MessageSquare, Award, BookOpen, Phone, Mail,
} from 'lucide-react-native';
import { ROLES } from '../data/teachers';
import { useTheme } from '../contexts/ThemeContext';

const ROLE_COLORS = {
  [ROLES.HEAD_TEACHER]: { bg: '#FEF3C7', text: '#92400E' },
  [ROLES.SSIO]: { bg: '#EDE9FE', text: '#5B21B6' },
  [ROLES.CURRICULUM_LEAD]: { bg: '#D1FAE5', text: '#065F46' },
  [ROLES.CLASS_TEACHER]: { bg: '#DBEAFE', text: '#1E40AF' },
  [ROLES.SUBJECT_TEACHER]: { bg: '#FCE7F3', text: '#9D174D' },
};

const isTeacherRole = (role) =>
  role === ROLES.CLASS_TEACHER || role === ROLES.SUBJECT_TEACHER;

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { colors, shadows } = theme;
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const isTeacher = isTeacherRole(currentUser?.role);
  const roleColors = ROLE_COLORS[currentUser?.role] || { bg: '#F3F4F6', text: '#374151' };

  const completedMeetings = sampleMeetings.filter(m => m.status === 'completed').length;
  const upcomingMeetings = sampleMeetings.filter(m => m.status !== 'completed').length;
  const recentMeetings = [...sampleMeetings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const quickStats = isTeacher
    ? [
      { label: 'PLC Sessions', value: sampleMeetings.length, icon: Calendar, color: '#1E3A8A', bgColor: '#EFF6FF' },
      { label: 'Completed', value: completedMeetings, icon: CheckCircle, color: '#059669', bgColor: '#ECFDF5' },
      { label: 'Upcoming', value: upcomingMeetings, icon: BookOpen, color: '#D97706', bgColor: '#FFFBEB' },
      { label: 'Subjects', value: currentUser?.subjectsTaught?.length || 0, icon: Award, color: '#7C3AED', bgColor: '#F5F3FF' },
    ]
    : [
      { label: 'Total PLC Sessions', value: sampleMeetings.length, icon: Calendar, color: '#1E3A8A', bgColor: '#EFF6FF' },
      { label: 'Completed', value: completedMeetings, icon: CheckCircle, color: '#059669', bgColor: '#ECFDF5' },
      { label: 'Upcoming', value: upcomingMeetings, icon: BookOpen, color: '#D97706', bgColor: '#FFFBEB' },
      { label: 'Pilot Schools', value: 55, icon: School, color: '#4F46E5', bgColor: '#EEF2FF' },
    ];

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}
        scrollEnabled={Platform.OS !== 'web'}>

        {/* ── Welcome Header ── */}
        <View style={styles.welcomeContainer}>
          <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome back, {currentUser?.name?.split(' ')[0]}!</Text>
        </View>

        {/* ── Quick Stats ── */}
        <View style={styles.statsGrid}>
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <View key={idx} style={[styles.statCard, { backgroundColor: colors.card, width: isDesktop ? '23%' : '48%' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                  <Icon size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Desktop Two-Column Layout ── */}
        <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 20 }}>
          
          {/* Main Area (Recent Sessions) */}
          <View style={{ flex: isDesktop ? 2 : 1 }}>
            <View style={[styles.card, { backgroundColor: colors.card, marginBottom: isDesktop ? 0 : 20 }]}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardHeader, { color: colors.text }]}>Recent PLC Sessions</Text>
            <TouchableOpacity onPress={() => navigate('/meetings')} activeOpacity={0.7}>
              <Text style={[styles.headerAction, { color: colors.primaryLight }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentMeetings.map((m) => (
            <TouchableOpacity
              key={m.id} style={[styles.meetingItem, { backgroundColor: colors.background }]}
              onPress={() => navigate(`/meetings/${m.id}`)} activeOpacity={0.7}
            >
              <View style={[styles.meetingAccent, {
                backgroundColor: m.status === 'completed' ? '#059669' : colors.primary
              }]} />
              <View style={styles.meetingContent}>
                <Text style={[styles.meetingTitle, { color: colors.text }]}>{m.title}</Text>
                <Text style={[styles.meetingMeta, { color: colors.textSecondary }]}>
                  {new Date(m.date).toLocaleDateString()} · {m.time}
                </Text>
              </View>
              <View style={[
                styles.badge,
                { backgroundColor: m.status === 'completed' ? '#ECFDF5' : '#EFF6FF' }
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: m.status === 'completed' ? '#059669' : colors.primary }
                ]}>
                  {m.status === 'completed' ? 'Done' : 'Upcoming'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          </View>
        </View>

        {/* ── Side Area (Quick Actions) ── */}
          <View style={{ flex: isDesktop ? 1 : 1 }}>
            {/* ── Quick Actions ── */}
            <View style={[styles.card, { backgroundColor: colors.card, marginBottom: 0 }]}>
              <Text style={[styles.cardHeader, { color: colors.text }]}>Quick Actions</Text>
              <View style={[styles.actionsGrid, { flexDirection: isDesktop ? 'column' : 'row' }]}>
                <TouchableOpacity style={[styles.actionBtn, { width: isDesktop ? '100%' : '47%', backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]} onPress={() => navigate('/meetings')} activeOpacity={0.7}>
                  <Calendar size={20} color="#1E3A8A" />
                  <Text style={[styles.actionBtnText, { color: '#1E3A8A' }]}>PLC / AI Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { width: isDesktop ? '100%' : '47%', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]} onPress={() => navigate('/lesson-plan')} activeOpacity={0.7}>
                  <BookOpen size={20} color="#059669" />
                  <Text style={[styles.actionBtnText, { color: '#059669' }]}>Lesson Plans</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { width: isDesktop ? '100%' : '47%', backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]} onPress={() => navigate('/chats')} activeOpacity={0.7}>
                  <MessageSquare size={20} color="#D97706" />
                  <Text style={[styles.actionBtnText, { color: '#D97706' }]}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { width: isDesktop ? '100%' : '47%', backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]} onPress={() => navigate('/approvals')} activeOpacity={0.7}>
                  <CheckCircle size={20} color="#7C3AED" />
                  <Text style={[styles.actionBtnText, { color: '#7C3AED' }]}>Approvals</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },

  welcomeContainer: { marginBottom: 24, marginTop: 8 },
  welcomeText: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },

  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', marginBottom: 20, gap: 10,
  },
  statCard: {
    padding: 16, borderRadius: 14,
    ...Platform.select({
      ios: { shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 16px rgba(15, 37, 87, 0.06)', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' },
    }),
  },
  statIconContainer: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, marginTop: 2, fontWeight: '500' },

  // Card
  card: {
    borderRadius: 14, padding: 18, marginBottom: 20,
    ...Platform.select({
      ios: { shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
      android: { elevation: 3 },
      web: { boxShadow: '0 4px 16px rgba(15, 37, 87, 0.06)' },
    }),
  },
  cardHeader: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerAction: { fontSize: 13, fontWeight: '600' },

  // Meeting item
  meetingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, paddingLeft: 16, borderRadius: 10, marginBottom: 8,
    overflow: 'hidden', position: 'relative',
  },
  meetingAccent: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
    borderRadius: 2,
  },
  meetingContent: { flex: 1, marginRight: 10 },
  meetingTitle: { fontSize: 14, fontWeight: '600' },
  meetingMeta: { fontSize: 12, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },

  // Actions grid
  actionsGrid: { flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 14,
    borderRadius: 12, gap: 8, borderWidth: 1,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.15s ease', cursor: 'pointer' },
    }),
  },
  actionBtnText: { fontSize: 13, fontWeight: '600' },
});

export default Home;