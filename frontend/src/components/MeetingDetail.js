import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, Calendar, Clock, Users, Paperclip, Mic, Send, Download, FileText, CheckCircle } from 'lucide-react-native';
import { sampleMeetings } from '../data/sampleData';

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const meeting = sampleMeetings.find(m => m.id === parseInt(id));

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(meeting?.discussions || []);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  if (!meeting) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>PLC Session not found</Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigate('/meetings')}
        >
          <Text style={styles.btnTextPrimary}>Back to PLC Session</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      userId: 1, // Current user
      userName: "You",
      timestamp: new Date().toISOString(),
      message: message.trim(),
      type: 'message'
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handleFileUpload = () => {
    // Simulate file upload
    const fileMessage = {
      id: Date.now(),
      userId: 1,
      userName: "You",
      timestamp: new Date().toISOString(),
      message: "📎 Shared a file: Meeting_Resources.pdf",
      type: 'file',
      fileName: "Meeting_Resources.pdf",
      fileSize: "2.4 MB"
    };
    setMessages([...messages, fileMessage]);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Stop recording after 30 seconds for demo
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);

      const voiceMessage = {
        id: Date.now(),
        userId: 1,
        userName: "You",
        timestamp: new Date().toISOString(),
        message: "🎤 Voice note recorded",
        type: 'voice',
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`
      };
      setMessages([...messages, voiceMessage]);
      setRecordingTime(0);
    }, 30000);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (meeting.status === 'new') {
    // Chat Interface for New Meetings
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigate('/meetings')} style={styles.backButton}>
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.title}>PLC Session Chat</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{meeting.title}</Text>
            </View>
          </View>

          <ScrollView style={styles.flex1} scrollEnabled={Platform.OS !== 'web'}>
            {/* Meeting Info Card */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>{meeting.title}</Text>
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
                <View style={styles.badgeNew}>
                  <Text style={styles.badgeTextNew}>Active</Text>
                </View>
              </View>

              {/* Agenda */}
              <View style={styles.agendaSection}>
                <Text style={styles.sectionTitle}>PLC Session Agenda</Text>
                {meeting.agenda.map((item, index) => (
                  <View key={index} style={styles.agendaItem}>
                    <Text style={styles.agendaIndex}>{index + 1}.</Text>
                    <Text style={styles.agendaText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Chat Messages */}
            <View style={styles.chatSection}>
              {messages.length === 0 ? (
                <View style={styles.emptyState}>
                  <Users size={48} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>Start the conversation</Text>
                  <Text style={styles.emptyText}>
                    Share your thoughts, ask questions, or upload resources for this meeting.
                  </Text>
                </View>
              ) : (
                messages.map((msg) => (
                  <View key={msg.id} style={[styles.message, msg.userId === 1 ? styles.sent : styles.received]}>
                    <View style={[styles.messageBubble, msg.userId === 1 ? styles.sentBubble : styles.receivedBubble]}>
                      <Text style={[styles.messageText, msg.userId === 1 ? styles.sentText : styles.receivedText]}>
                        {msg.message}
                      </Text>
                      <Text style={[styles.messageTime, msg.userId === 1 ? styles.sentTime : styles.receivedTime]}>
                        {formatTime(msg.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={styles.inputBar}>
            <TouchableOpacity onPress={handleFileUpload} style={styles.iconButton}>
              <Paperclip size={20} color="#6B7280" />
            </TouchableOpacity>

            {isRecording ? (
              <View style={styles.recordingBar}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>
                  Recording: {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </Text>
                <TouchableOpacity onPress={() => setIsRecording(false)}>
                  <Text style={styles.stopText}>Stop</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TextInput
                style={styles.chatInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                multiline
              />
            )}

            {!isRecording && (
              <TouchableOpacity onPress={handleStartRecording} style={styles.iconButton}>
                <Mic size={20} color="#6B7280" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleSendMessage}
              style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
              disabled={!message.trim()}
            >
              <Send size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Statistics and Discussion Summary for Completed Meetings
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigate('/meetings')} style={styles.backButton}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.title}>PLC Session Summary</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{meeting.title}</Text>
          </View>
        </View>

        {/* Meeting Info */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.flex1}>
              <Text style={styles.cardTitle}>{meeting.title}</Text>
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
            <View style={styles.badgeCompleted}>
              <Text style={styles.badgeTextCompleted}>Completed</Text>
            </View>
          </View>

          {/* Statistics */}
          {meeting.statistics && (
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValuePrimary}>{meeting.statistics.totalParticipants}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValueSuccess}>{meeting.statistics.averageEngagement}</Text>
                <Text style={styles.statLabel}>Engagement</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValueWarning}>
                  {meeting.statistics.actionItems.filter(item => item.status === 'pending').length}
                </Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>
          )}
        </View>

        {/* Attendees */}
        {meeting.attendees && meeting.attendees.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Attendees</Text>
            {meeting.attendees.map((attendee, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.itemTitle}>{attendee.name}</Text>
                <Text style={attendee.status === 'present' ? styles.statusSuccess : styles.statusError}>
                  {attendee.status === 'present' ? 'Present' : 'Absent'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Key Outcomes */}
        {meeting.statistics?.keyOutcomes && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Key Outcomes</Text>
            {meeting.statistics.keyOutcomes.map((outcome, index) => (
              <View key={index} style={styles.outcomeItem}>
                <CheckCircle size={18} color="#059669" />
                <Text style={styles.outcomeText}>{outcome}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Items */}
        {meeting.statistics?.actionItems && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Action Items</Text>
            {meeting.statistics.actionItems.map((item, index) => (
              <View key={index} style={styles.actionItem}>
                <View style={styles.flex1}>
                  <Text style={styles.actionTask}>{item.task}</Text>
                  <Text style={styles.actionMeta}>
                    Assignee: {item.assignee} • Due: {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.badge, item.status === 'completed' ? styles.badgeCompleted : styles.badgePending]}>
                  <Text style={[styles.badgeText, item.status === 'completed' ? styles.badgeTextCompleted : styles.badgeTextPending]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Meeting Discussion Summary */}
        {meeting.discussions && meeting.discussions.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Discussion Summary</Text>
            {meeting.discussions.map((discussion) => (
              <View key={discussion.id} style={styles.discussionBox}>
                <View style={styles.listItem}>
                  <Text style={styles.discussionUser}>{discussion.userName}</Text>
                  <Text style={styles.discussionTime}>{formatTime(discussion.timestamp)}</Text>
                </View>
                <Text style={styles.discussionMsg}>{discussion.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Shared Files */}
        {meeting.files && meeting.files.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Shared Files</Text>
            {meeting.files.map((file) => (
              <View key={file.id} style={styles.fileItem}>
                <FileText size={20} color="#6B7280" />
                <View style={styles.flex1}>
                  <Text style={styles.fileName}>{file.name}</Text>
                  <Text style={styles.fileMeta}>{file.size} • {file.uploadedBy}</Text>
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                  <Download size={16} color="#374151" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Voice Notes */}
        {meeting.voiceNotes && meeting.voiceNotes.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitleBold}>Voice Notes</Text>
            {meeting.voiceNotes.map((note) => (
              <View key={note.id} style={styles.fileItem}>
                <View style={styles.micIconContainer}>
                  <Mic size={18} color="#3B82F6" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.fileName}>Voice Note ({note.duration})</Text>
                  <Text style={styles.fileMeta}>{note.uploadedBy} • {new Date(note.timestamp).toLocaleDateString()}</Text>
                </View>
                <TouchableOpacity style={styles.downloadBtnPrimary}>
                  <Download size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
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
    fontSize: 12,
    color: '#6B7280',
  },
  facilitatorText: {
    fontSize: 13,
    color: '#4B5563',
  },
  agendaSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  sectionTitleBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  agendaItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  agendaIndex: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginRight: 8,
  },
  agendaText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  chatSection: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
    paddingHorizontal: 20,
  },
  message: {
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  sent: {
    justifyContent: 'flex-end',
  },
  received: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#1F2937',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTime: {
    color: '#DBEAFE',
  },
  receivedTime: {
    color: '#9CA3AF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  recordingBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
  },
  stopText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValuePrimary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statValueSuccess: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statValueWarning: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemTitle: {
    fontSize: 15,
    color: '#374151',
  },
  statusSuccess: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  statusError: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  outcomeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  outcomeText: {
    flex: 1,
    fontSize: 14,
    color: '#064E3B',
  },
  actionItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionTask: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  actionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  discussionBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  discussionUser: {
    fontWeight: '600',
    color: '#111827',
  },
  discussionTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  discussionMsg: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fileMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  downloadBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
  },
  downloadBtnPrimary: {
    padding: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  micIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeNew: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeCompleted: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePending: {
    backgroundColor: '#FFFBEB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextNew: {
    color: '#2563EB',
  },
  badgeTextCompleted: {
    color: '#059669',
  },
  badgeTextPending: {
    color: '#D97706',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MeetingDetail;