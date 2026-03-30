import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { MessageSquare, Plus, Mic, Paperclip, Send, Clock, CheckCircle, AlertCircle, FileText, Play, X, BookOpen, Layers, BarChart } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { sampleComments, subjectStrands, subjectAreas, concernCategories } from '../data/sampleData';

const Comments = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();

  const [comments, setComments] = useState(sampleComments);
  const [isCreating, setIsCreating] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState('text'); // text, voice, file
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recording, setRecording] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [priority, setPriority] = useState('medium');

  // Concern State
  const [isConcern, setIsConcern] = useState(false);
  const [concernCategory, setConcernCategory] = useState(concernCategories[0]);
  const [selectedSubject, setSelectedSubject] = useState(subjectAreas[0]);
  const [selectedStrand, setSelectedStrand] = useState(subjectStrands[subjectAreas[0]]?.[0] || '');
  const [loc, setLoc] = useState(3);

  const handleStartCreating = () => {
    setIsCreating(true);
    setNewComment('');
    setCommentType('text');
    setRecording(null);
    setUploadedFile(null);
    setPriority('medium');
    setIsConcern(false);
    setConcernCategory(concernCategories[0]);
    setSelectedSubject(subjectAreas[0]);
    setSelectedStrand(subjectStrands[subjectAreas[0]]?.[0] || '');
    setLoc(3);
  };

  const handleCancelCreating = () => {
    setIsCreating(false);
    setNewComment('');
    setCommentType('text');
    setIsRecording(false);
    setRecordingTime(0);
    setRecording(null);
    setUploadedFile(null);
    setIsConcern(false);
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);

    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);

    // Stop recording after 60 seconds for demo
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      setRecording({
        id: Date.now(),
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`,
        url: 'recording_url', // In real app, this would be the actual recording
        transcription: 'This is a transcription of the voice note...'
      });
      setRecordingTime(0);
    }, 60000);
  };

  const handleFileUpload = () => {
    // In a real app, use react-native-document-picker
    Alert.alert('File Upload', 'In a real app, this would open the document picker.');
    setUploadedFile({
      name: 'lesson_plan.pdf',
      size: 1024 * 1024 * 2.5,
      type: 'application/pdf',
      url: 'file_url'
    });
  };

  const handleSubmitComment = () => {
    if (!newComment.trim() && !recording && !uploadedFile && !isConcern) return;

    const comment = {
      id: Date.now(),
      userId: currentUser?.id || 1,
      userName: currentUser?.name || "You",
      type: isConcern
        ? (concernCategory === 'Academic Teaching SnW' ? 'academic-teaching-snw' : 'concern')
        : commentType,
      concernCategory: isConcern ? concernCategory : null,
      priority,
      status: 'open',
      timestamp: new Date().toISOString(),
      responses: [],
      content: ''
    };

    if (isConcern && concernCategory === 'Academic Teaching SnW') {
      comment.subject = selectedSubject;
      comment.strand = selectedStrand;
      comment.loc = loc;
    }

    // Set content based on type
    switch (commentType) {
      case 'text':
        comment.content = newComment.trim();
        break;
      case 'voice':
        comment.content = recording?.transcription || '';
        comment.voiceNote = recording;
        break;
      case 'file':
        comment.content = uploadedFile?.name || '';
        comment.file = uploadedFile;
        break;
    }

    // Add concern headers to content if needed
    if (isConcern) {
      let prefix = `[CONCERN: ${concernCategory}]`;
      if (concernCategory === 'Academic Teaching SnW') {
        prefix += `\n${selectedSubject} -> ${selectedStrand} (LOC: ${loc})`;
      }

      if (comment.content) {
        comment.content = `${prefix}\n\n${comment.content}`;
      } else {
        comment.content = prefix;
      }
    }

    setComments([comment, ...comments]);
    handleCancelCreating();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle size={16} color="#F59E0B" />;
      case 'in-progress':
        return <Clock size={16} color="#3B82F6" />;
      case 'resolved':
        return <CheckCircle size={16} color="#10B981" />;
      default:
        return <MessageSquare size={16} color="#6B7280" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return styles.textError;
      case 'medium':
        return styles.textWarning;
      case 'low':
        return styles.textSuccess;
      default:
        return styles.textNeutral600;
    }
  };

  if (isCreating) {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex1}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
            {/* Header */}
            <View style={[styles.rowBetween, styles.marginLarge]}>
              <Text style={styles.mainTitle}>New Request</Text>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={handleCancelCreating} style={styles.btnSecondary}>
                  <Text style={styles.btnTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmitComment}
                  disabled={!newComment.trim() && !recording && !uploadedFile}
                  style={[styles.btnPrimary, (!newComment.trim() && !recording && !uploadedFile) && styles.btnDisabled]}
                >
                  <Send size={16} color="#fff" />
                  <Text style={styles.btnTextPrimary}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              {/* Report Concern Toggle */}
              <View style={[styles.section, { borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: 16 }]}>
                <View style={styles.rowBetween}>
                  <View style={styles.flex1}>
                    <Text style={styles.formSectionTitle}>Report a Concern?</Text>
                    <Text style={styles.hintText}>Issues requiring SISO or Head Teacher attention</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setIsConcern(!isConcern)}
                    style={[styles.toggleBase, isConcern ? styles.toggleOn : styles.toggleOff]}
                  >
                    <View style={[styles.toggleThumb, isConcern ? styles.toggleThumbOn : styles.toggleThumbOff]} />
                  </TouchableOpacity>
                </View>
              </View>

              {isConcern && (
                <View style={styles.section}>
                  <Text style={styles.formSectionTitle}>Concern Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                    {concernCategories.map(cat => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setConcernCategory(cat)}
                        style={[styles.tag, concernCategory === cat && styles.tagActive]}
                      >
                        <Text style={[styles.tagText, concernCategory === cat && styles.tagTextActive]}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {concernCategory === 'Academic Teaching SnW' && (
                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.labelVerySmall}>SnW Details (Subject → Strand → LOC)</Text>

                      {/* Subject Selection */}
                      <View style={styles.formGroup}>
                        <Text style={styles.labelVerySmall}>Subject Area</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                          {subjectAreas.map(subject => (
                            <TouchableOpacity
                              key={subject}
                              onPress={() => {
                                setSelectedSubject(subject);
                                setSelectedStrand(subjectStrands[subject]?.[0] || '');
                              }}
                              style={[styles.tag, selectedSubject === subject && styles.tagActive]}
                            >
                              <Text style={[styles.tagText, selectedSubject === subject && styles.tagTextActive]}>{subject}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      {/* Strand Selection */}
                      <View style={styles.formGroup}>
                        <Text style={styles.labelVerySmall}>Strand</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
                          {subjectStrands[selectedSubject]?.map(strand => (
                            <TouchableOpacity
                              key={strand}
                              onPress={() => setSelectedStrand(strand)}
                              style={[styles.tag, selectedStrand === strand && styles.tagActive]}
                            >
                              <Text style={[styles.tagText, selectedStrand === strand && styles.tagTextActive]}>{strand}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      {/* LOC Selection */}
                      <View style={styles.formGroup}>
                        <Text style={styles.labelVerySmall}>Level of Competence (LOC) [1-5]</Text>
                        <View style={styles.locRow}>
                          {[1, 2, 3, 4, 5].map(val => (
                            <TouchableOpacity
                              key={val}
                              onPress={() => setLoc(val)}
                              style={[styles.locBtn, loc === val && styles.locBtnActive]}
                            >
                              <Text style={[styles.locBtnText, loc === val && styles.locBtnTextActive]}>{val}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Type Selection */}
              <View style={styles.section}>
                <Text style={styles.formSectionTitle}>Request Type</Text>
                <View style={styles.typeGrid}>
                  <TouchableOpacity
                    onPress={() => setCommentType('text')}
                    style={[styles.typeBtn, commentType === 'text' && styles.typeBtnActive]}
                  >
                    <MessageSquare size={24} color={commentType === 'text' ? '#3B82F6' : '#6B7280'} />
                    <Text style={[styles.typeText, commentType === 'text' && styles.typeTextActive]}>Text</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCommentType('voice')}
                    style={[styles.typeBtn, commentType === 'voice' && styles.typeBtnActive]}
                  >
                    <Mic size={24} color={commentType === 'voice' ? '#3B82F6' : '#6B7280'} />
                    <Text style={[styles.typeText, commentType === 'voice' && styles.typeTextActive]}>Voice</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCommentType('file')}
                    style={[styles.typeBtn, commentType === 'file' && styles.typeBtnActive]}
                  >
                    <Paperclip size={24} color={commentType === 'file' ? '#3B82F6' : '#6B7280'} />
                    <Text style={[styles.typeText, commentType === 'file' && styles.typeTextActive]}>File</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Priority */}
              <View style={styles.section}>
                <Text style={styles.formSectionTitle}>Priority Level</Text>
                <View style={styles.priorityRow}>
                  {['low', 'medium', 'high'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p)}
                      style={[styles.priorityBtn, priority === p && styles.priorityBtnActive]}
                    >
                      <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>
                        {p.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Content Input */}
              <View style={styles.section}>
                <Text style={styles.formSectionTitle}>Request Details</Text>

                {commentType === 'text' && (
                  <View>
                    <TextInput
                      style={styles.textArea}
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline
                      numberOfLines={6}
                      placeholder="Describe the assistance you need..."
                      placeholderTextColor="#9CA3AF"
                    />
                    <Text style={styles.hintText}>
                      Be specific about what help you're looking for
                    </Text>
                  </View>
                )}

                {commentType === 'voice' && (
                  <View style={styles.voiceSection}>
                    {!recording ? (
                      <View style={styles.centerContent}>
                        <TouchableOpacity
                          onPress={handleStartRecording}
                          style={styles.btnPrimaryLarge}
                        >
                          <Mic size={20} color="#fff" />
                          <Text style={styles.btnTextPrimary}>Start Recording</Text>
                        </TouchableOpacity>
                        <Text style={styles.hintTextCenter}>
                          Record your question or concern (max 60 seconds)
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.cardHighlight}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.subSectionTitle}>Voice Recording</Text>
                          <Text style={styles.timeText}>{recording.duration}</Text>
                        </View>
                        <View style={styles.audioPlayer}>
                          <TouchableOpacity style={styles.playBtn}>
                            <Play size={16} color="#374151" />
                          </TouchableOpacity>
                          <View style={styles.progressBar}>
                            <View style={[styles.progressIndicator, { width: '60%' }]} />
                          </View>
                        </View>
                        <View style={styles.transcriptionBox}>
                          <Text style={styles.labelVerySmall}>Transcription:</Text>
                          <Text style={styles.transcriptionText}>{recording.transcription}</Text>
                        </View>
                      </View>
                    )}

                    {isRecording && (
                      <View style={styles.recordingRow}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingText}>
                          Recording... {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {commentType === 'file' && (
                  <View style={styles.fileSection}>
                    {!uploadedFile ? (
                      <TouchableOpacity onPress={handleFileUpload} style={styles.uploadBox}>
                        <Paperclip size={48} color="#D1D5DB" />
                        <Text style={styles.uploadText}>Tap to select a document</Text>
                        <Text style={styles.hintTextCenter}>
                          PDF, DOC, DOCX, TXT, JPG, PNG (max 10MB)
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.fileCard}>
                        <View style={styles.fileInfo}>
                          <FileText size={32} color="#3B82F6" />
                          <View style={styles.flex1}>
                            <Text style={styles.fileName}>{uploadedFile.name}</Text>
                            <Text style={styles.fileSize}>
                              {formatFileSize(uploadedFile.size)}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setUploadedFile(null)}
                          style={styles.removeBtn}
                        >
                          <Text style={styles.removeBtnText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
        <View style={[styles.rowBetween, styles.marginLarge]}>
          <View style={styles.flex1}>
            <Text style={styles.mainTitle}>Teacher Assistance</Text>
            <Text style={styles.mainSubtitle}>
              Request help and share concerns with your colleagues
            </Text>
          </View>
          <TouchableOpacity onPress={handleStartCreating} style={styles.btnPrimaryIcon}>
            <Plus size={16} color="#fff" />
            <Text style={styles.btnTextPrimarySmall}>New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValueOpen}>
              {comments.filter(c => c.status === 'open').length}
            </Text>
            <Text style={styles.statLabel}>Open</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValueProgress}>
              {comments.filter(c => c.status === 'in-progress').length}
            </Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValueResolved}>
              {comments.filter(c => c.status === 'resolved').length}
            </Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {(() => {
            const isPrivileged = (() => {
              const role = currentUser?.role?.toLowerCase() || '';
              return role.includes('siso') || role.includes('head') || role.includes('curriculum');
            })();

            const filteredComments = comments.filter(c => {
              // Concerns and SnW reports are always restricted to privileged roles
              if (c.type === 'concern' || c.type === 'academic-teaching-snw' || c.type === 'academic-lag') {
                return isPrivileged;
              }
              // Regular comments: privileged roles see all, teachers see only their own
              if (!isPrivileged) {
                return c.userId === (currentUser?.id);
              }
              return true;
            });

            if (filteredComments.length === 0) {
              return (
                <View style={styles.emptyCard}>
                  <MessageSquare size={64} color="#D1D5DB" />
                  <Text style={styles.emptyTitle}>No assistance requests yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Submit your first request to get help from colleagues
                  </Text>
                  <TouchableOpacity onPress={handleStartCreating} style={styles.btnPrimaryLarge}>
                    <Plus size={20} color="#fff" />
                    <Text style={styles.btnTextPrimary}>Create Request</Text>
                  </TouchableOpacity>
                </View>
              );
            }

            return filteredComments.map((comment) => (
              <View key={comment.id} style={[
                styles.commentCard,
                (comment.type === 'concern' || comment.type === 'academic-teaching-snw' || comment.type === 'academic-lag') && { borderLeftWidth: 4, borderLeftColor: theme.colors.primary }
              ]}>
                <View style={styles.commentHeader}>
                  <View style={styles.userInfoRow}>
                    {(comment.type === 'concern' || comment.type === 'academic-teaching-snw' || comment.type === 'academic-lag') ? <BarChart size={16} color={theme.colors.primary} /> : getStatusIcon(comment.status)}
                    <View>
                      <Text style={styles.userName}>{comment.userName}</Text>
                      {(comment.type === 'concern' || comment.type === 'academic-teaching-snw' || comment.type === 'academic-lag') && (
                        <Text style={[styles.labelVerySmall, { color: theme.colors.primary }]}>
                          CONCERN: {comment.concernCategory || 'Academic Teaching SnW'}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.timeLabel}>{formatTime(comment.timestamp)}</Text>
                  </View>
                  <View style={[
                    styles.priorityBadge,
                    comment.priority === 'high' ? styles.priorityHigh :
                      comment.priority === 'medium' ? styles.priorityMedium : styles.priorityLow
                  ]}>
                    <Text style={[
                      styles.priorityBadgeText,
                      comment.priority === 'high' ? styles.textError :
                        comment.priority === 'medium' ? styles.textWarning : styles.textSuccess
                    ]}>
                      {comment.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {(comment.type === 'academic-teaching-snw' || comment.type === 'academic-lag' || (comment.type === 'concern' && comment.concernCategory === 'Academic Teaching SnW')) && (
                  <View style={styles.academicLagBadge}>
                    <View style={styles.lagInfoRow}>
                      <BookOpen size={14} color="#4B5563" />
                      <Text style={styles.lagInfoText}>{comment.subject} {'->'} {comment.strand}</Text>
                    </View>
                    <View style={styles.lagInfoRow}>
                      <Layers size={14} color="#4B5563" />
                      <Text style={styles.lagInfoText}>Level of Competence: {comment.loc}/5</Text>
                    </View>
                  </View>
                )}

                {(comment.type === 'text' || comment.type === 'academic-teaching-snw' || comment.type === 'academic-lag' || comment.type === 'concern') && (
                  <Text style={styles.commentContent}>{comment.content}</Text>
                )}

                {comment.type === 'voice' && (
                  <View style={styles.voiceContent}>
                    <View style={styles.audioPlayerSmall}>
                      <TouchableOpacity style={styles.playBtnSmall}>
                        <Play size={14} color="#374151" />
                      </TouchableOpacity>
                      <View style={styles.flex1}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.labelVerySmall}>Voice Note</Text>
                          <Text style={styles.timeLabelVerySmall}>{comment.voiceNote?.duration}</Text>
                        </View>
                        <View style={styles.progressBarSmall}>
                          <View style={[styles.progressIndicatorSmall, { width: '40%' }]} />
                        </View>
                      </View>
                    </View>
                    {comment.content && (
                      <Text style={styles.transcriptionPreview}>"{comment.content}"</Text>
                    )}
                  </View>
                )}

                {comment.type === 'file' && (
                  <View style={styles.filePreview}>
                    <FileText size={24} color="#3B82F6" />
                    <View style={styles.flex1}>
                      <Text style={styles.fileNameSmall}>{comment.content}</Text>
                      <Text style={styles.fileSizeSmall}>
                        {comment.file && formatFileSize(comment.file.size)}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.commentFooter}>
                  <View style={[styles.statusBadge,
                  comment.status === 'open' ? styles.statusOpen :
                    comment.status === 'in-progress' ? styles.statusProgress : styles.statusResolved
                  ]}>
                    <Text style={styles.statusText}>{comment.status.toUpperCase()}</Text>
                  </View>
                </View>

                {comment.responses && comment.responses.length > 0 && (
                  <View style={styles.responsesSection}>
                    <Text style={styles.responsesCount}>Responses ({comment.responses.length})</Text>
                    {comment.responses.map((response) => (
                      <View key={response.id} style={styles.responseItem}>
                        <View style={styles.rowBetween}>
                          <Text style={styles.responseUser}>{response.userName}</Text>
                          <Text style={styles.timeLabelVerySmall}>{formatTime(response.timestamp)}</Text>
                        </View>
                        <Text style={styles.responseText}>{response.content}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.addResponseRow}>
                  <TextInput
                    style={styles.responseInput}
                    placeholder="Add a response..."
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity style={styles.btnPrimarySquareSmall}>
                    <Send size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          })()}
        </View>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marginLarge: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnSecondary: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnTextPrimary: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnTextPrimarySmall: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  btnTextSecondary: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  typeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeBtnActive: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  typeText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityBtnActive: {
    backgroundColor: '#3B82F6',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  priorityTextActive: {
    color: '#fff',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  hintTextCenter: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  centerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  btnPrimaryLarge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHighlight: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  progressIndicator: {
    height: 4,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  transcriptionBox: {
    marginTop: 8,
  },
  labelVerySmall: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  transcriptionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  recordingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  recordingText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 12,
  },
  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  fileSize: {
    fontSize: 13,
    color: '#6B7280',
  },
  removeBtnText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  btnPrimaryIcon: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    elevation: 1,
  },
  statValueOpen: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  statValueProgress: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statValueResolved: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  commentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  timeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  priorityHigh: {
    backgroundColor: '#FEE2E2',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
  },
  priorityLow: {
    backgroundColor: '#D1FAE5',
  },
  commentContent: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 12,
  },
  voiceContent: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  audioPlayerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playBtnSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  progressBarSmall: {
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
    marginTop: 4,
  },
  progressIndicatorSmall: {
    height: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 1,
  },
  timeLabelVerySmall: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  transcriptionPreview: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  fileNameSmall: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  fileSizeSmall: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusOpen: {
    backgroundColor: '#FEF3C7',
  },
  statusProgress: {
    backgroundColor: '#DBEAFE',
  },
  statusResolved: {
    backgroundColor: '#D1FAE5',
  },
  responsesSection: {
    marginBottom: 16,
  },
  responsesCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  responseItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  responseUser: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  responseText: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  addResponseRow: {
    flexDirection: 'row',
    gap: 8,
  },
  responseInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 14,
    color: '#111827',
  },
  btnPrimarySquareSmall: {
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  textError: {
    color: '#EF4444',
  },
  textWarning: {
    color: '#F59E0B',
  },
  textSuccess: {
    color: '#10B981',
  },
  toggleBase: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: '#3B82F6',
  },
  toggleOff: {
    backgroundColor: '#D1D5DB',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },
  formGroup: {
    marginBottom: 16,
  },
  tagScroll: {
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#3B82F6',
  },
  tagText: {
    fontSize: 12,
    color: '#4B5563',
  },
  tagTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  locRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  locBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locBtnActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#2563EB',
  },
  locBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  locBtnTextActive: {
    color: '#fff',
  },
  academicLagBadge: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  lagInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lagInfoText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
});

export default Comments;