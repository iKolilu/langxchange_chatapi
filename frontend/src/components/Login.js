import React, { useState } from 'react';
import { useNavigate } from 'react-router-native';
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
  ActivityIndicator,
} from 'react-native';
import { Phone, GraduationCap } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_LOGINS, ROLES, teachers } from '../data/teachers';

const ROLE_COLORS = {
  [ROLES.HEAD_TEACHER]: { bg: '#FEF3C7', text: '#92400E' },
  [ROLES.SSIO]: { bg: '#EDE9FE', text: '#5B21B6' },
  [ROLES.CURRICULUM_LEAD]: { bg: '#D1FAE5', text: '#065F46' },
  [ROLES.CLASS_TEACHER]: { bg: '#DBEAFE', text: '#1E40AF' },
  [ROLES.SUBJECT_TEACHER]: { bg: '#FCE7F3', text: '#9D174D' },
};

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedTeacher, setSuggestedTeacher] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanValue);
    if (error) setError('');

    // Suggest teacher if number matches
    if (cleanValue.length >= 10) {
      const found = teachers.find(t => t.phoneNumber === cleanValue);
      setSuggestedTeacher(found || null);
    } else {
      setSuggestedTeacher(null);
    }
  };

  const handleSubmit = async () => {
    setError('');
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }
    setLoading(true);
    try {
      const result = login({ phoneNumber });
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const number = DEMO_LOGINS[role] || '';
    setPhoneNumber(number);
    if (error) setError('');
    const found = teachers.find(t => t.phoneNumber === number);
    setSuggestedTeacher(found || null);
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <GraduationCap size={40} color="#3B82F6" />
            </View>
            <Text style={styles.title}>GES PLC Toolkit</Text>
            <Text style={styles.subtitle}>Teacher Community Platform · Ghana</Text>
          </View>

          {/* Login Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>
            <Text style={styles.cardHint}>Enter the phone number registered with your school</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone style={styles.inputIcon} size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={handleInputChange}
                  placeholder="e.g. 233244100001"
                  keyboardType="number-pad"
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
              </View>
            </View>

            {suggestedTeacher && (
              <View style={styles.suggestionContainer}>
                <Text style={styles.suggestionLabel}>Teacher Identified:</Text>
                <View style={styles.suggestionCard}>
                  <Text style={styles.suggestionName}>{suggestedTeacher.name}</Text>
                  <Text style={styles.suggestionSchool}>{suggestedTeacher.school}</Text>
                </View>
              </View>
            )}


            {!!error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnTextPrimary}>Sign In</Text>
              }
            </TouchableOpacity>

            {/* Quick demo buttons */}
            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>Try a demo role:</Text>
              <View style={styles.demoRow}>
                {Object.entries(DEMO_LOGINS).map(([role]) => {
                  const colors = ROLE_COLORS[role] || { bg: '#F3F4F6', text: '#374151' };
                  return (
                    <TouchableOpacity
                      key={role}
                      onPress={() => handleDemoLogin(role)}
                      style={[styles.demoBtn, { backgroundColor: colors.bg }]}
                    >
                      <Text style={[styles.demoBtnText, { color: colors.text }]}>{role}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Info card */}
          <View style={[styles.card, styles.infoCard]}>
            <Text style={styles.infoTitle}>Access Levels</Text>
            <Text style={styles.infoText}>• <Text style={styles.bold}>Subject / Class Teachers</Text> — Report concerns, view PLCs, lesson plans & chat</Text>
            <Text style={styles.infoText}>• <Text style={styles.bold}>Head Teachers</Text> — All above + school-level approvals</Text>
            <Text style={styles.infoText}>• <Text style={styles.bold}>Curriculum Lead / SSIO</Text> — Full monitoring dashboard</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20, alignItems: 'center' },
  header: { alignItems: 'center', marginVertical: 32 },
  logoContainer: {
    width: 72, height: 72, backgroundColor: '#EFF6FF',
    borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06, shadowRadius: 3, elevation: 2, marginBottom: 16,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 4 },
  cardHint: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginBottom: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, backgroundColor: '#fff',
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, paddingVertical: 13, paddingHorizontal: 12, fontSize: 16, color: '#111827' },
  errorContainer: { backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { color: '#DC2626', fontSize: 14, textAlign: 'center' },
  btn: { paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  btnPrimary: { backgroundColor: '#3B82F6' },
  btnDisabled: { opacity: 0.6 },
  btnTextPrimary: { color: '#fff', fontSize: 16, fontWeight: '600' },
  demoSection: { marginTop: 8 },
  demoSectionTitle: { fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 10 },
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  demoBtn: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20,
  },
  demoBtnText: { fontSize: 12, fontWeight: '600' },
  infoCard: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#DBEAFE' },
  infoTitle: { fontSize: 14, fontWeight: '700', color: '#1D4ED8', marginBottom: 8 },
  infoText: { fontSize: 12, color: '#1E40AF', marginBottom: 4, lineHeight: 18 },
  bold: { fontWeight: '700' },
  suggestionContainer: {
    marginTop: -10,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  suggestionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  suggestionCard: {},
  suggestionName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0C4A6E',
  },
  suggestionSchool: {
    fontSize: 13,
    color: '#075985',
    marginTop: 2,
  },
});


export default Login;