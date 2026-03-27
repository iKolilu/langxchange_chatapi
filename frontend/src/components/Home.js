import React from 'react';
import { useNavigate } from 'react-router-native';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { sampleMeetings } from '../data/sampleData';
import {
  Users, MapPin, School, Calendar, CheckCircle, MessageSquare, Award, BookOpen, Phone, Mail,
} from 'lucide-react-native';
import { ROLES } from '../data/teachers';

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

  const isTeacher = isTeacherRole(currentUser?.role);
  const roleColors = ROLE_COLORS[currentUser?.role] || { bg: '#F3F4F6', text: '#374151' };

  const completedMeetings = sampleMeetings.filter(m => m.status === 'completed').length;
  const upcomingMeetings = sampleMeetings.filter(m => m.status !== 'completed').length;
  const recentMeetings = [...sampleMeetings]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  const quickStats = isTeacher
    ? [
      { label: 'PLC Sessions', value: sampleMeetings.length, icon: Calendar, color: '#3B82F6', bgColor: '#EFF6FF' },
      { label: 'Completed', value: completedMeetings, icon: CheckCircle, color: '#10B981', bgColor: '#ECFDF5' },
      { label: 'Upcoming', value: upcomingMeetings, icon: BookOpen, color: '#F59E0B', bgColor: '#FFFBEB' },
      { label: 'Subjects', value: currentUser?.subjectsTaught?.length || 0, icon: Award, color: '#8B5CF6', bgColor: '#F5F3FF' },
    ]
    : [
      { label: 'Total PLC Sessions', value: sampleMeetings.length, icon: Calendar, color: '#3B82F6', bgColor: '#EFF6FF' },
      { label: 'Completed', value: completedMeetings, icon: CheckCircle, color: '#10B981', bgColor: '#ECFDF5' },
      { label: 'Upcoming', value: upcomingMeetings, icon: BookOpen, color: '#F59E0B', bgColor: '#FFFBEB' },
      { label: 'Pilot Schools', value: 55, icon: School, color: '#6366F1', bgColor: '#EEF2FF' },
    ];

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}
        scrollEnabled={Platform.OS !== 'web'}>

        {/* ── Teacher Profile Card ── */}
        <View style={styles.profileCard}>
          {/* Avatar */}
          <View style={styles.profileAvatarWrap}>
            <Text style={styles.profileAvatarText}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{currentUser?.name}</Text>
              {currentUser?.role === ROLES.SSIO && (
                <View style={[styles.roleBadge, { backgroundColor: '#EDE9FE', marginLeft: 8 }]}>
                  <Text style={[styles.roleBadgeText, { color: '#5B21B6' }]}>Regional</Text>
                </View>
              )}
            </View>

            <View style={styles.assignmentRow}>
              <View style={[styles.roleBadge, { backgroundColor: roleColors.bg, marginBottom: 0 }]}>
                <Text style={[styles.roleBadgeText, { color: roleColors.text }]}>
                  {currentUser?.role}
                </Text>
              </View>
              {currentUser?.class && (
                <View style={[styles.classBadge, { backgroundColor: '#3B82F6', borderColor: '#2563EB' }]}>
                  <Text style={[styles.classBadgeText, { color: '#fff' }]}>{currentUser.class}</Text>
                </View>
              )}
            </View>

            <Text style={styles.profileSchool}>{currentUser?.school}</Text>
            <Text style={styles.profileLocation}>
              {currentUser?.district} · {currentUser?.region} Region
            </Text>

            {/* Subjects chips */}
            {currentUser?.subjectsTaught?.length > 0 && (
              <View style={styles.subjectsRow}>
                {currentUser.subjectsTaught.map((s, i) => (
                  <View key={i} style={styles.subjectChip}>
                    <Text style={styles.subjectChipText}>{s}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Contact row */}
            <View style={styles.contactRow}>
              <View style={styles.contactItem}>
                <Phone size={12} color="#6B7280" />
                <Text style={styles.contactText}>{currentUser?.phoneNumber}</Text>
              </View>
              {!!currentUser?.email && (
                <View style={styles.contactItem}>
                  <Mail size={12} color="#6B7280" />
                  <Text style={styles.contactText} numberOfLines={1}>{currentUser?.email}</Text>
                </View>
              )}
            </View>
          </View>

        </View>

        {/* ── Quick Stats ── */}
        <View style={styles.statsGrid}>
          {quickStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <View key={idx} style={styles.statCard}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.bgColor }]}>
                  <Icon size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Recent PLC Sessions ── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader}>Recent PLC Sessions</Text>
            <TouchableOpacity onPress={() => navigate('/meetings')}>
              <Text style={styles.headerAction}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentMeetings.map((m) => (
            <TouchableOpacity
              key={m.id} style={styles.meetingItem}
              onPress={() => navigate(`/meetings/${m.id}`)}
            >
              <View style={styles.meetingContent}>
                <Text style={styles.meetingTitle}>{m.title}</Text>
                <Text style={styles.meetingMeta}>
                  {new Date(m.date).toLocaleDateString()} · {m.time}
                </Text>
              </View>
              <View style={[
                styles.badge,
                { backgroundColor: m.status === 'completed' ? '#ECFDF5' : '#EFF6FF' }
              ]}>
                <Text style={[
                  styles.badgeText,
                  { color: m.status === 'completed' ? '#059669' : '#2563EB' }
                ]}>
                  {m.status === 'completed' ? 'Done' : 'Upcoming'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick Actions ── */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('/meetings')}>
              <Calendar size={20} color="#3B82F6" />
              <Text style={styles.actionBtnText}>PLC / AI Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('/lesson-plan')}>
              <BookOpen size={20} color="#10B981" />
              <Text style={styles.actionBtnText}>Lesson Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('/chats')}>
              <MessageSquare size={20} color="#F59E0B" />
              <Text style={styles.actionBtnText}>Chats</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigate('/approvals')}>
              <CheckCircle size={20} color="#8B5CF6" />
              <Text style={styles.actionBtnText}>Approvals</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 16, paddingBottom: 32 },

  // Profile card
  profileCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20,
    flexDirection: 'row', alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  profileAvatarWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center', marginRight: 16, flexShrink: 0,
  },
  profileAvatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700', color: '#111827' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  assignmentRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  roleBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20,
  },
  roleBadgeText: { fontSize: 11, fontWeight: '700' },
  classBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: '#E5E7EB',
  },
  classBadgeText: { fontSize: 11, fontWeight: '600', color: '#4B5563' },
  profileSchool: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 2 },
  profileLocation: { fontSize: 13, color: '#6B7280', marginBottom: 10 },

  contactRow: { marginBottom: 10 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  contactText: { fontSize: 12, color: '#6B7280', flex: 1 },
  subjectsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  subjectChip: {
    backgroundColor: '#F0F9FF', borderWidth: 1, borderColor: '#BAE6FD',
    borderRadius: 12, paddingHorizontal: 9, paddingVertical: 3,
  },
  subjectChipText: { fontSize: 11, color: '#0369A1', fontWeight: '600' },

  // Stats grid
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'space-between', marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff', width: '48%', padding: 14, borderRadius: 12, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  statIconContainer: {
    width: 38, height: 38, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
  },
  cardHeader: { fontSize: 17, fontWeight: '600', color: '#111827', marginBottom: 14 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerAction: { color: '#3B82F6', fontSize: 14, fontWeight: '500' },

  // Meeting item
  meetingItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, backgroundColor: '#F9FAFB', borderRadius: 8, marginBottom: 8,
  },
  meetingContent: { flex: 1, marginRight: 10 },
  meetingTitle: { fontSize: 15, fontWeight: '500', color: '#111827' },
  meetingMeta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  // Actions grid
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    backgroundColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', width: '47%', paddingVertical: 12,
    borderRadius: 10, gap: 8,
  },
  actionBtnText: { fontSize: 13, fontWeight: '500', color: '#374151' },
});

export default Home;