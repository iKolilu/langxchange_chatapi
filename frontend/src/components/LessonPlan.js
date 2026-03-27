import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
  Alert,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { BookOpen, Plus, Download, Edit, Trash2, Clock, Target, Users, X, MessageSquare } from 'lucide-react-native';
import { useNavigate } from 'react-router-native';
import { sampleLessonPlans, gradeLevels, subjectAreas } from '../data/sampleData';
import Chatbot from './Chatbot';

const LessonPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    duration: '',
    dok: {
      dok1: false,
      dok2: false,
      dok3: false,
      dok4: false
    }
  });

  const [newObjective, setNewObjective] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newDifferentiation, setNewDifferentiation] = useState('');
  const [newHomework, setNewHomework] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStartCreating = () => {
    setIsCreating(true);
    setEditingPlan(null);
    setFormData({
      title: '',
      subject: '',
      gradeLevel: '',
      duration: '',
      planType: 'Lesson Plan',
      dok: {
        dok1: false,
        dok2: false,
        dok3: false,
        dok4: false
      }
    });
  };

  const handleCancelCreating = () => {
    setIsCreating(false);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData(JSON.parse(JSON.stringify(plan)));
    setIsCreating(true);
  };

  const handleSavePlan = () => {
    // In a real app, this would save to backend
    console.log('Saving lesson plan:', formData);
    setIsCreating(false);
    setEditingPlan(null);
    Alert.alert('Success', 'Lesson plan saved successfully!');
  };

  const constructChatPrompt = (plan) => {
    if (!plan) return '';
    const selectedDok = Object.entries(plan.dok || {})
      .filter(([_, v]) => v)
      .map(([k]) => k.toUpperCase().replace('DOK', 'DoK '))
      .join(', ');

    return `- Grade Level: ${plan.gradeLevel || 'Not selected'}
- Subject: ${plan.subject || 'Not selected'}
- Strand / Sub Strand: ${plan.title || 'Untitled'}
- Duration: ${plan.duration || '0'} minutes
- Depth of Knowledge: ${selectedDok || 'None selected'}`;
  };


  const formatDuration = (minutes) => {
    const mins = parseInt(minutes);
    if (isNaN(mins)) return '0m';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`.trim();
    }
    return `${remainingMins}m`;
  };

  if (selectedPlan) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              onPress={() => setSelectedPlan(null)}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Back to Plans</Text>
            </TouchableOpacity>
            <View style={styles.rowBetween}>
              <View style={styles.flex1}>
                <Text style={styles.mainTitle}>{selectedPlan.title}</Text>
                <Text style={styles.mainSubtitle}>
                  {selectedPlan.subject} • {selectedPlan.gradeLevel} • {formatDuration(selectedPlan.duration)}
                </Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.iconBtn}>
                  <Download size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleEditPlan(selectedPlan)}
                  style={styles.btnPrimaryIcon}
                >
                  <Edit size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Lesson Plan Content */}
          <View style={styles.card}>
            {/* Plan Info */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <BookOpen size={20} color="#3B82F6" />
                <Text style={styles.sectionTitle}>Plan Details</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DoK Levels:</Text>
                <Text style={styles.detailValue}>
                  {Object.entries(selectedPlan.dok || {})
                    .filter(([_, value]) => value)
                    .map(([key]) => key.toUpperCase().replace('DOK', 'DoK '))
                    .join(', ') || 'None'}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setIsChatOpen(true)}
            style={[styles.btnPrimaryLarge, { marginTop: 0, marginBottom: 20 }]}
          >
            <MessageSquare size={20} color="#fff" />
            <Text style={styles.btnTextPrimary}>Open AI Assistant</Text>
          </TouchableOpacity>
        </ScrollView>
        <Chatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          initialParams={{
            ...selectedPlan,
            prompt: constructChatPrompt(selectedPlan)
          }}
        />
      </View>
    );
  }

  if (isCreating) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
          {/* Header */}
          <View style={[styles.rowBetween, styles.marginLarge]}>
            <Text style={styles.mainTitle}>
              {editingPlan ? 'Edit Lesson Plan' : 'Create Lesson Plan'}
            </Text>
            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleCancelCreating} style={styles.btnSecondary}>
                <Text style={styles.btnTextSecondary}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSavePlan} style={styles.btnPrimary}>
                <Text style={styles.btnTextPrimary}>Save Plan</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.formSectionTitle}>Plan Details</Text>

              <Text style={styles.label}>Grade Level</Text>
              <Text style={styles.fieldExplanation}>Select the class level for this lesson</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.gradeLevel}
                  onValueChange={(value) => handleInputChange('gradeLevel', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Grade Level" value="" />
                  {gradeLevels.map(level => (
                    <Picker.Item key={level} label={level} value={level} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Subject</Text>
              <Text style={styles.fieldExplanation}>The main area of study (e.g., Mathematics, Science)</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.subject}
                  onValueChange={(value) => handleInputChange('subject', value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Subject" value="" />
                  {subjectAreas.map(subject => (
                    <Picker.Item key={subject} label={subject} value={subject} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Strand / Sub Strand</Text>
              <Text style={styles.fieldExplanation}>Specific focus area within the curriculum</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                placeholder="Enter strand or sub-strand..."
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.label}>Duration (minutes)</Text>
              <Text style={styles.fieldExplanation}>Total estimated time for this activity</Text>
              <TextInput
                style={styles.input}
                value={formData.duration.toString()}
                onChangeText={(text) => handleInputChange('duration', text)}
                placeholder="60"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.label}>Depth of Knowledge (DoK)</Text>
              <Text style={styles.fieldExplanation}>Depth of Knowledge levels for cognitive challenge (1-4)</Text>
              <View style={styles.checkboxContainer}>
                {[1, 2, 3, 4].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.checkbox,
                      formData.dok[`dok${num}`] && styles.checkboxActive
                    ]}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        dok: {
                          ...prev.dok,
                          [`dok${num}`]: !prev.dok[`dok${num}`]
                        }
                      }));
                    }}
                  >
                    <Text style={[
                      styles.checkboxText,
                      formData.dok[`dok${num}`] && styles.checkboxTextActive
                    ]}>DoK {num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.chatbotEntry}>
              <TouchableOpacity
                onPress={() => setIsChatOpen(true)}
                style={styles.btnPrimaryLarge}
              >
                <MessageSquare size={20} color="#fff" />
                <Text style={styles.btnTextPrimary}>Open AI Assistant</Text>
              </TouchableOpacity>
              <Text style={styles.demoText}>Interacting with AI will use your plan parameters</Text>
            </View>
          </View>
        </ScrollView>
        <Chatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          initialParams={{
            ...formData,
            prompt: constructChatPrompt(formData)
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
        {/* Header */}
        <View style={[styles.rowBetween, styles.marginLarge]}>
          <View>
            <Text style={styles.mainTitle}>Lesson Plans</Text>
            <Text style={styles.mainSubtitle}>Create and manage your lesson plans</Text>
          </View>
          <TouchableOpacity onPress={handleStartCreating} style={styles.btnPrimaryFlex}>
            <Plus size={16} color="#fff" />
            <Text style={styles.btnTextPrimarySmall}>New Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Lesson Plans List */}
        <View style={styles.plansGrid}>
          {sampleLessonPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={styles.planCard}
              onPress={() => setSelectedPlan(plan)}
            >
              <View style={styles.rowBetween}>
                <View style={styles.flex1}>
                  <Text style={styles.cardTitle}>{plan.title}</Text>
                  <Text style={styles.cardSubtitle}>
                    {plan.subject} • {plan.gradeLevel} • {formatDuration(plan.duration)}
                  </Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabelText}>
                      {Object.entries(plan.dok || {})
                        .filter(([_, v]) => v).length} DoK
                    </Text>
                  </View>
                </View>
                <BookOpen size={32} color="#3B82F6" style={styles.cardIcon} />
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleEditPlan(plan);
                  }}
                  style={styles.iconBtnSmall}
                >
                  <Edit size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimarySquareSmall}>
                  <Download size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        {sampleLessonPlans.length === 0 && (
          <View style={styles.emptyCard}>
            <BookOpen size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No plans yet</Text>
            <Text style={styles.emptySubtitle}>Create your first lesson or PLC plan to get started</Text>
            <TouchableOpacity onPress={handleStartCreating} style={styles.btnPrimaryLarge}>
              <Plus size={20} color="#fff" />
              <Text style={styles.btnTextPrimary}>Create Plan</Text>
            </TouchableOpacity>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  flex1: {
    flex: 1,
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
  detailHeader: {
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconBtnSmall: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  btnPrimaryIcon: {
    backgroundColor: '#3B82F6',
    padding: 10,
    borderRadius: 8,
  },
  btnPrimaryFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  btnPrimaryLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    marginTop: 16,
  },
  btnPrimary: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btnSecondary: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  btnTextPrimary: {
    color: '#fff',
    fontWeight: '600',
  },
  btnTextPrimarySmall: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  btnTextSecondary: {
    color: '#374151',
    fontWeight: '600',
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    flex: 1,
    color: '#111827',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  checkbox: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
  checkboxText: {
    color: '#374151',
    fontSize: 14,
  },
  checkboxTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  chatbotEntry: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
  },
  demoText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 8,
  },
  fieldExplanation: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  plansGrid: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metaLabelText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardIcon: {
    opacity: 0.2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  btnPrimarySquareSmall: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 6,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
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
});

export default LessonPlan;