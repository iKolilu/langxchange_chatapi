import React, { useState } from 'react';
import { useNavigate } from 'react-router-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Platform
} from 'react-native';
import { Calendar, Clock, Users, Filter, Plus, AlertTriangle, BarChart, BookOpen, Layers, ChevronDown, ChevronUp, Star } from 'lucide-react-native';
import { sampleMeetings, sampleComments } from '../data/sampleData';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { subjectStrands } from '../data/sampleData';

const Meetings = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('sessions');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);

  const isPrivileged = currentUser?.role?.toLowerCase().includes('siso') ||
    currentUser?.role?.toLowerCase().includes('head') ||
    currentUser?.role?.toLowerCase().includes('curriculum');

  const filteredMeetings = sampleMeetings.filter(meeting => {
    const matchesFilter = filter === 'all' || meeting.status === filter;
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.facilitator.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const concerns = sampleComments.filter(c =>
    c.type === 'concern' || c.type === 'academic-teaching-snw' || c.type === 'academic-lag'
  );

  // Separate SnW entries from other concerns
  const snwEntries = concerns.filter(c => c.type === 'academic-teaching-snw' || c.type === 'academic-lag');
  const otherConcerns = concerns.filter(c => c.type === 'concern');

  // Build Subject-level groups for SnW, each with Strand sub-groups
  const snwSubjectGroups = (() => {
    const subjects = {};
    snwEntries.forEach(c => {
      const subj = c.subject || 'General';
      if (!subjects[subj]) subjects[subj] = { subject: subj, strands: {}, teachers: new Set(), highCount: 0, medCount: 0 };
      const strand = c.strand || 'General';
      if (!subjects[subj].strands[strand]) subjects[subj].strands[strand] = { strand, items: [], teachers: new Set(), highCount: 0, medCount: 0 };
      subjects[subj].strands[strand].items.push(c);
      subjects[subj].strands[strand].teachers.add(c.userName);
      subjects[subj].teachers.add(c.userName);
      if (c.priority === 'high') { subjects[subj].highCount++; subjects[subj].strands[strand].highCount++; }
      else if (c.priority === 'medium') { subjects[subj].medCount++; subjects[subj].strands[strand].medCount++; }
    });
    return Object.values(subjects).map(s => ({
      ...s,
      teacherCount: s.teachers.size,
      rating: Math.min(5, Math.ceil((s.teachers.size * 1.5 + s.highCount * 1.5 + s.medCount * 0.5) / 2)),
      strands: Object.values(s.strands).map(st => ({
        ...st,
        teacherCount: st.teachers.size,
        rating: Math.min(5, Math.ceil((st.teachers.size * 1.5 + st.highCount * 1.5 + st.medCount * 0.5) / 2))
      })).sort((a, b) => b.rating - a.rating)
    })).sort((a, b) => b.rating - a.rating);
  })();

  // Build flat groups for other concerns (Resources, Infrastructure, etc.)
  const groupedConcerns = (() => {
    const groups = {};
    otherConcerns.forEach(c => {
      const cat = c.concernCategory || 'General';
      if (!groups[cat]) groups[cat] = { category: cat, items: [], teachers: new Set(), highCount: 0, medCount: 0 };
      groups[cat].items.push(c);
      groups[cat].teachers.add(c.userName);
      if (c.priority === 'high') groups[cat].highCount++;
      else if (c.priority === 'medium') groups[cat].medCount++;
    });
    return Object.values(groups).map(g => ({
      ...g,
      teacherCount: g.teachers.size,
      rating: Math.min(5, Math.ceil((g.teachers.size * 1.5 + g.highCount * 1.5 + g.medCount * 0.5) / 2))
    })).sort((a, b) => b.rating - a.rating);
  })();

  const prioritizedConcerns = {
    high: concerns.filter(c => c.priority === 'high'),
    medium: concerns.filter(c => c.priority === 'medium'),
    low: concerns.filter(c => c.priority === 'low')
  };

  const getStatusBadge = (status) => {
    const isCompleted = status === 'completed';
    return (
      <View style={[styles.badge, isCompleted ? styles.badgeCompleted : styles.badgeNew]}>
        <Text style={[styles.badgeText, isCompleted ? styles.badgeTextCompleted : styles.badgeTextNew]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>PLC Session</Text>
          <Text style={styles.subtitle}>Manage and track your PLC sessions and toolkits</Text>
        </View>

        {/* Pill Tabs - Only for Privileged Roles */}
        {isPrivileged && (
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setActiveTab('sessions')}
              style={[styles.tab, activeTab === 'sessions' && styles.tabActive]}
            >
              <Users size={18} color={activeTab === 'sessions' ? theme.colors.primary : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'sessions' && styles.tabTextActive]}>PLC Sessions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('concerns')}
              style={[styles.tab, activeTab === 'concerns' && styles.tabActive]}
            >
              <AlertTriangle size={18} color={activeTab === 'concerns' ? theme.colors.primary : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'concerns' && styles.tabTextActive]}>AI Concerns</Text>
              {concerns.length > 0 && (
                <View style={styles.badgeCount}>
                  <Text style={styles.badgeCountText}>{concerns.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeTab === 'sessions' ? (
          <>
            {/* Search and Filter */}
            <View style={styles.card}>
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search PLC sessions..."
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Filter Buttons */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
                <TouchableOpacity
                  onPress={() => setFilter('all')}
                  style={[styles.filterBtn, filter === 'all' ? styles.filterBtnActive : styles.filterBtnInactive]}
                >
                  <Filter size={16} color={filter === 'all' ? '#fff' : '#6B7280'} />
                  <Text style={[styles.filterBtnText, filter === 'all' ? styles.filterBtnTextActive : styles.filterBtnTextInactive]}>
                    All ({sampleMeetings.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilter('new')}
                  style={[styles.filterBtn, filter === 'new' ? styles.filterBtnActive : styles.filterBtnInactive]}
                >
                  <Clock size={16} color={filter === 'new' ? '#fff' : '#6B7280'} />
                  <Text style={[styles.filterBtnText, filter === 'new' ? styles.filterBtnTextActive : styles.filterBtnTextInactive]}>
                    New ({sampleMeetings.filter(m => m.status === 'new').length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFilter('completed')}
                  style={[styles.filterBtn, filter === 'completed' ? styles.filterBtnActive : styles.filterBtnInactive]}
                >
                  <Users size={16} color={filter === 'completed' ? '#fff' : '#6B7280'} />
                  <Text style={[styles.filterBtnText, filter === 'completed' ? styles.filterBtnTextActive : styles.filterBtnTextInactive]}>
                    Completed ({sampleMeetings.filter(m => m.status === 'completed').length})
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Meetings List */}
            <View style={styles.listContainer}>
              {filteredMeetings.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Calendar size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>No PLC sessions found</Text>
                  <Text style={styles.emptyText}>
                    {searchTerm ? 'Try adjusting your search terms' : 'No meetings match the filter'}
                  </Text>
                </View>
              ) : (
                filteredMeetings.map((meeting) => (
                  <TouchableOpacity
                    key={meeting.id}
                    onPress={() => navigate(`/meetings/${meeting.id}`)}
                    style={styles.meetingCard}
                  >
                    <View style={styles.meetingHeader}>
                      <View style={styles.meetingInfo}>
                        <Text style={styles.meetingTitle}>{meeting.title}</Text>
                        <View style={styles.metaRow}>
                          <View style={styles.metaItem}>
                            <Calendar size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{formatDate(meeting.date)}</Text>
                          </View>
                          <View style={styles.metaItem}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{meeting.time}</Text>
                          </View>
                        </View>
                        <Text style={styles.facilitatorText}>Facilitator: {meeting.facilitator}</Text>
                      </View>
                      <View style={styles.sideInfo}>
                        {getStatusBadge(meeting.status)}
                      </View>
                    </View>

                    {/* Agenda Preview */}
                    {meeting.agenda && meeting.agenda.length > 0 && (
                      <View style={styles.agendaPreview}>
                        <Text style={styles.agendaHeader}>Agenda:</Text>
                        {meeting.agenda.slice(0, 2).map((item, index) => (
                          <View key={index} style={styles.agendaItem}>
                            <Text style={styles.agendaIndex}>{index + 1}.</Text>
                            <Text style={styles.agendaText} numberOfLines={1}>{item}</Text>
                          </View>
                        ))}
                        {meeting.agenda.length > 2 && (
                          <Text style={styles.moreText}>+{meeting.agenda.length - 2} more items...</Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          </>
        ) : (
          /* Grouped Concerns Dashboard */
          <View style={styles.concernsDashboard}>
            {/* Summary Bar */}
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <BarChart size={20} color={theme.colors.primary} />
                <Text style={styles.insightTitle}>Concern Overview</Text>
              </View>
              <Text style={styles.insightDescription}>
                {concerns.length} teacher reports — {snwEntries.length} Academic Teaching SnW across {snwSubjectGroups.length} subjects, plus {otherConcerns.length} other concerns. Tap to drill down.
              </Text>
              <View style={styles.priorityStats}>
                <View style={[styles.priorityStat, { borderLeftColor: '#EF4444' }]}>
                  <Text style={styles.statVal}>{prioritizedConcerns.high.length}</Text>
                  <Text style={styles.statLab}>HIGH</Text>
                </View>
                <View style={[styles.priorityStat, { borderLeftColor: '#F59E0B' }]}>
                  <Text style={styles.statVal}>{prioritizedConcerns.medium.length}</Text>
                  <Text style={styles.statLab}>MEDIUM</Text>
                </View>
                <View style={[styles.priorityStat, { borderLeftColor: '#10B981' }]}>
                  <Text style={styles.statVal}>{prioritizedConcerns.low.length}</Text>
                  <Text style={styles.statLab}>LOW</Text>
                </View>
              </View>
            </View>

            {/* ── Academic Teaching SnW Section ── */}
            {snwSubjectGroups.length > 0 && (
              <>
                <View style={styles.snwSectionHeader}>
                  <BookOpen size={18} color={theme.colors.primary} />
                  <Text style={styles.snwSectionTitle}>Academic Teaching SnW</Text>
                  <View style={styles.snwCountBadge}>
                    <Text style={styles.snwCountText}>{snwEntries.length}</Text>
                  </View>
                </View>

                {snwSubjectGroups.map(group => {
                  const groupKey = 'snw_' + group.subject;
                  const isExpanded = expandedGroup === groupKey;
                  const ratingColor = group.rating >= 4 ? '#EF4444' : group.rating >= 3 ? '#F59E0B' : '#10B981';
                  return (
                    <View key={groupKey} style={[styles.groupCard, { borderLeftWidth: 3, borderLeftColor: theme.colors.primary }]}>
                      <TouchableOpacity
                        onPress={() => setExpandedGroup(isExpanded ? null : groupKey)}
                        style={styles.groupHeader}
                      >
                        <View style={styles.groupLeft}>
                          <View style={[styles.groupIconBadge, { backgroundColor: theme.colors.primary + '22' }]}>
                            <BookOpen size={16} color={theme.colors.primary} />
                          </View>
                          <View>
                            <Text style={styles.groupCategory}>{group.subject}</Text>
                            <Text style={styles.groupMeta}>
                              {group.teacherCount} teacher{group.teacherCount !== 1 ? 's' : ''} {'\u2022'} {group.strands.length} strand{group.strands.length !== 1 ? 's' : ''} {'\u2022'} {snwEntries.filter(e => e.subject === group.subject).length} reports
                            </Text>
                          </View>
                        </View>
                        <View style={styles.groupRight}>
                          <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={13} color={s <= group.rating ? ratingColor : '#D1D5DB'} fill={s <= group.rating ? ratingColor : 'none'} />
                            ))}
                          </View>
                          {isExpanded ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
                        </View>
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.drilldownContainer}>
                          {/* Strand sub-groups */}
                          {group.strands.map(strand => {
                            const strandKey = groupKey + '_' + strand.strand;
                            const isStrandExpanded = expandedGroup === strandKey;
                            const strandColor = strand.rating >= 4 ? '#EF4444' : strand.rating >= 3 ? '#F59E0B' : '#10B981';
                            return (
                              <View key={strandKey} style={styles.strandGroup}>
                                <TouchableOpacity
                                  onPress={() => setExpandedGroup(isStrandExpanded ? groupKey : strandKey)}
                                  style={styles.strandHeader}
                                >
                                  <View style={styles.groupLeft}>
                                    <Layers size={14} color={strandColor} />
                                    <View>
                                      <Text style={styles.strandName}>{strand.strand}</Text>
                                      <Text style={styles.groupMeta}>
                                        {strand.teacherCount} teacher{strand.teacherCount !== 1 ? 's' : ''} {'\u2022'} {strand.items.length} report{strand.items.length !== 1 ? 's' : ''}
                                      </Text>
                                    </View>
                                  </View>
                                  <View style={styles.groupRight}>
                                    <View style={styles.starRow}>
                                      {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={11} color={s <= strand.rating ? strandColor : '#D1D5DB'} fill={s <= strand.rating ? strandColor : 'none'} />
                                      ))}
                                    </View>
                                    {isStrandExpanded ? <ChevronUp size={15} color="#9CA3AF" /> : <ChevronDown size={15} color="#9CA3AF" />}
                                  </View>
                                </TouchableOpacity>

                                {isStrandExpanded && strand.items.map(c => (
                                  <View key={c.id} style={[styles.drilldownItem, {
                                    borderLeftColor: c.priority === 'high' ? '#EF4444' : c.priority === 'medium' ? '#F59E0B' : '#10B981',
                                    marginLeft: 8
                                  }]}>
                                    <View style={styles.drilldownHeader}>
                                      <View style={styles.userAvatarSm}>
                                        <Text style={styles.avatarTextSm}>{c.userName.charAt(0)}</Text>
                                      </View>
                                      <View style={{ flex: 1 }}>
                                        <Text style={styles.drilldownUser}>{c.userName}</Text>
                                        <Text style={styles.drilldownTime}>{formatDate(c.timestamp)}</Text>
                                      </View>
                                      <View style={[styles.locBadge]}>
                                        <Text style={styles.locBadgeText}>LOC {c.loc}/5</Text>
                                      </View>
                                      <View style={[styles.priorityTag, {
                                        backgroundColor: c.priority === 'high' ? '#FEE2E2' : c.priority === 'medium' ? '#FEF3C7' : '#D1FAE5'
                                      }]}>
                                        <Text style={[styles.priorityTagText, {
                                          color: c.priority === 'high' ? '#B91C1C' : c.priority === 'medium' ? '#92400E' : '#065F46'
                                        }]}>{c.priority?.toUpperCase()}</Text>
                                      </View>
                                    </View>
                                    <Text style={styles.drilldownContent}>{c.content}</Text>
                                  </View>
                                ))}
                              </View>
                            );
                          })}
                          <TouchableOpacity style={styles.btnPlanSession}>
                            <Text style={styles.btnPlanSessionText}>Plan PLC Session for {group.subject}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
              </>
            )}

            {/* ── Other Concerns by Category ── */}
            {groupedConcerns.length > 0 && (
              <Text style={styles.sectionTitle}>Other Concerns</Text>
            )}
            {groupedConcerns.map(group => {
              const isExpanded = expandedGroup === group.category;
              const ratingColor = group.rating >= 4 ? '#EF4444' : group.rating >= 3 ? '#F59E0B' : '#10B981';
              return (
                <View key={group.category} style={styles.groupCard}>
                  <TouchableOpacity
                    onPress={() => setExpandedGroup(isExpanded ? null : group.category)}
                    style={styles.groupHeader}
                  >
                    <View style={styles.groupLeft}>
                      <View style={[styles.groupIconBadge, { backgroundColor: ratingColor + '22' }]}>
                        <AlertTriangle size={16} color={ratingColor} />
                      </View>
                      <View>
                        <Text style={styles.groupCategory}>{group.category}</Text>
                        <Text style={styles.groupMeta}>
                          {group.teacherCount} teacher{group.teacherCount !== 1 ? 's' : ''} {'\u2022'} {group.items.length} report{group.items.length !== 1 ? 's' : ''}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.groupRight}>
                      <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={13} color={s <= group.rating ? ratingColor : '#D1D5DB'} fill={s <= group.rating ? ratingColor : 'none'} />
                        ))}
                      </View>
                      {isExpanded ? <ChevronUp size={18} color="#6B7280" /> : <ChevronDown size={18} color="#6B7280" />}
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.drilldownContainer}>
                      {group.items.map(c => (
                        <View key={c.id} style={[styles.drilldownItem, {
                          borderLeftColor: c.priority === 'high' ? '#EF4444' : c.priority === 'medium' ? '#F59E0B' : '#10B981'
                        }]}>
                          <View style={styles.drilldownHeader}>
                            <View style={styles.userAvatarSm}>
                              <Text style={styles.avatarTextSm}>{c.userName.charAt(0)}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.drilldownUser}>{c.userName}</Text>
                              <Text style={styles.drilldownTime}>{formatDate(c.timestamp)}</Text>
                            </View>
                            <View style={[styles.priorityTag, {
                              backgroundColor: c.priority === 'high' ? '#FEE2E2' : c.priority === 'medium' ? '#FEF3C7' : '#D1FAE5'
                            }]}>
                              <Text style={[styles.priorityTagText, {
                                color: c.priority === 'high' ? '#B91C1C' : c.priority === 'medium' ? '#92400E' : '#065F46'
                              }]}>{c.priority?.toUpperCase()}</Text>
                            </View>
                          </View>
                          <Text style={styles.drilldownContent}>{c.content}</Text>
                        </View>
                      ))}
                      <TouchableOpacity style={styles.btnPlanSession}>
                        <Text style={styles.btnPlanSessionText}>Plan PLC Session for this Category</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button - Restricted */}
      {isPrivileged && (
        <TouchableOpacity style={styles.fab}>
          <Plus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1, 
    borderColor: '#EAEEF3',
    ...Platform.select({
      ios:     { shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(100, 116, 139, 0.06)' },
    }),
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    gap: 8,
  },
  filterBtnActive: {
    backgroundColor: '#3B82F6',
  },
  filterBtnInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterBtnTextActive: {
    color: '#fff',
  },
  filterBtnTextInactive: {
    color: '#6B7280',
  },
  listContainer: {
    gap: 12,
  },
  meetingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1, 
    borderColor: '#EAEEF3',
    ...Platform.select({
      ios:     { shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
      android: { elevation: 2 },
      web:     { boxShadow: '0 2px 10px rgba(100, 116, 139, 0.06)' },
    }),
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meetingInfo: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  facilitatorText: {
    fontSize: 14,
    color: '#4B5563',
  },
  sideInfo: {
    alignItems: 'flex-end',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeNew: {
    backgroundColor: '#EFF6FF',
  },
  badgeCompleted: {
    backgroundColor: '#ECFDF5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextNew: {
    color: '#2563EB',
  },
  badgeTextCompleted: {
    color: '#059669',
  },
  agendaPreview: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  agendaHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  agendaItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  agendaIndex: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
    marginRight: 6,
  },
  agendaText: {
    fontSize: 13,
    color: '#6B7280',
    flex: 1,
  },
  moreText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#3B82F6',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  // New Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#EFF6FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#1D4ED8',
  },
  badgeCount: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeCountText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  concernsDashboard: {
    gap: 20,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  insightDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  priorityStats: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    gap: 20,
  },
  priorityStat: {
    flex: 1,
    borderLeftWidth: 3,
    paddingLeft: 10,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLab: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  concernCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  concernHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  concernUser: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  concernTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityTagText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lagDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  lagPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lagText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  concernContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  btnAction: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3B82F6',
  },
  // Grouped Concerns Styles
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  groupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  groupIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCategory: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
  },
  groupMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  groupRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  drilldownContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 12,
    gap: 10,
  },
  drilldownItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    marginBottom: 8,
  },
  drilldownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  userAvatarSm: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTextSm: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4B5563',
  },
  drilldownUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  drilldownTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  drilldownContent: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginTop: 4,
  },
  btnPlanSession: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  btnPlanSessionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  // SnW Section styles
  snwSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  snwSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  snwCountBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  snwCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  strandGroup: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 6,
    overflow: 'hidden',
  },
  strandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  strandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  locBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 4,
  },
  locBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
  },
});

export default Meetings;