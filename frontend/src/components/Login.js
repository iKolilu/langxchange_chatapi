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
  Image,
  Dimensions,
} from 'react-native';
import { Phone, Shield, Info, Sparkles } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_LOGINS, teachers } from '../data/teachers';

// Conditionally import framer-motion for Web to prevent native crashes
let motion = null;
if (Platform.OS === 'web') {
  motion = require('framer-motion').motion;
}

const { width } = Dimensions.get('window');

const MotionWrapper = ({ children, delay = 0, y = 20, duration = 0.6, style }) => {
  if (Platform.OS === 'web' && motion) {
    return (
      <motion.div
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ ...style, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {children}
      </motion.div>
    );
  }
  return <View style={[{ width: '100%', alignItems: 'center' }, style]}>{children}</View>;
};

const MotionTooltip = ({ isVisible, children }) => {
  if (!isVisible) return null;
  
  if (Platform.OS === 'web' && motion) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={styles.tooltipContainerWeb}
      >
        {children}
      </motion.div>
    );
  }
  
  return <View style={styles.tooltipContainer}>{children}</View>;
};

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedTeacher, setSuggestedTeacher] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanValue);
    if (error) setError('');

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
    <View style={styles.outerContainer}>
      {/* Exact Preloader aesthetic: Elegant Deep Navy Gradient */}
      <View style={styles.bgGradientTop} />

      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>

            <MotionWrapper delay={0.2} style={{ alignItems: 'center', width: '100%', maxWidth: 460 }}>
              {/* Pristine White Login Form without Header outside */}
              <View style={styles.card}>
                
                {/* Integrated Logo and Title inside the card */}
                <View style={styles.cardHeader}>
                  <Image
                    source={require('../../public/logo.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.title}>GES PLC Toolkit</Text>
                  <Text style={styles.cardHint}>Ministry of Education Portal</Text>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Phone Number</Text>
                  <View style={[styles.inputWrapper, phoneNumber.length > 0 && styles.inputWrapperActive]}>
                    <Phone style={styles.inputIcon} size={18} color={phoneNumber.length > 0 ? '#1E3A8A' : '#94A3B8'} />
                    <TextInput
                      style={styles.input}
                      value={phoneNumber}
                      onChangeText={handleInputChange}
                      placeholder="e.g. 233244100001"
                      keyboardType="number-pad"
                      placeholderTextColor="#94A3B8"
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>
                </View>

                {suggestedTeacher && (
                  <View style={styles.suggestionContainer}>
                    <View style={styles.suggestionIconRow}>
                      <Shield size={14} color="#1E3A8A" />
                      <Text style={styles.suggestionLabel}>Identity Verified</Text>
                    </View>
                    <Text style={styles.suggestionName}>{suggestedTeacher.name}</Text>
                    <Text style={styles.suggestionSchool}>{suggestedTeacher.school}</Text>
                  </View>
                )}

                {!!error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

                {/* Preloader Gold Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading}
                  style={[styles.btn, loading && styles.btnDisabled]}
                  activeOpacity={0.8}
                >
                  {loading
                    ? <ActivityIndicator color="#0F2557" />
                    : <Text style={styles.btnText}>Secure Sign In</Text>
                  }
                </TouchableOpacity>

                {/* Demo Setup with Clickable Buttons and Tooltip */}
                <View style={styles.demoSection}>
                  <View style={{ position: 'relative', zIndex: 10 }}>
                    <View style={styles.demoHeaderRow}>
                      <Text style={styles.demoSectionTitle}>Demo Access Roles</Text>
                      <TouchableOpacity 
                        style={styles.infoTrigger}
                        onPress={() => setShowTooltip(!showTooltip)}
                        {...(Platform.OS === 'web' ? {
                          onMouseEnter: () => setShowTooltip(true),
                          onMouseLeave: () => setShowTooltip(false),
                        } : {})}
                        activeOpacity={0.7}
                      >
                        <Info size={16} color="#64748B" />
                      </TouchableOpacity>
                    </View>
                      
                    {/* Floating Tooltip */}
                    <MotionTooltip isVisible={showTooltip}>
                      <View style={styles.tooltipContent}>
                        <View style={styles.tooltipHeader}>
                          <Text style={styles.tooltipTitle}>System Capabilities</Text>
                        </View>
                        <Text style={styles.tooltipText}><Text style={styles.bold}>Subject / Class Teachers:</Text> Report concerns, view PLCs, lesson plans & chat.</Text>
                        <Text style={styles.tooltipText}><Text style={styles.bold}>Head Teachers:</Text> All above + school-level approvals.</Text>
                        <Text style={styles.tooltipText}><Text style={styles.bold}>Curriculum Lead / SSIO:</Text> Full monitoring dashboard.</Text>
                        <View style={styles.tooltipArrow} />
                      </View>
                    </MotionTooltip>
                  </View>

                  <View style={styles.demoRow}>
                    {Object.entries(DEMO_LOGINS).map(([role]) => (
                      <TouchableOpacity
                        key={role}
                        onPress={() => handleDemoLogin(role)}
                        style={styles.demoBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.demoBtnText}>{role}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </MotionWrapper>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F2557',
    ...Platform.select({
      web: {
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(135deg, #0A1128 0%, #1E3A8A 100%)',
      }
    })
  },
  
  // Elegant Deep Navy Preloader Background
  bgGradientTop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F2557',
    ...Platform.select({ web: { backgroundImage: 'linear-gradient(135deg, #0A1128 0%, #1E3A8A 100%)' } })
  },
  container: { flex: 1, zIndex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 40, alignItems: 'center', width: '100%', flexGrow: 1, justifyContent: 'center', minHeight: '100%' },

  // Pristine White Form Card
  card: {
    width: '100%', 
    backgroundColor: '#FFFFFF', // Solid pristine white
    borderRadius: 24, padding: 32,
    marginBottom: 24,
    ...Platform.select({
      web: { 
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4)'
      },
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 24 },
      android: { elevation: 12 }
    }),
  },
  
  // Header inside card
  cardHeader: { alignItems: 'center', marginBottom: 32 },
  logoImage: { width: 64, height: 64, borderRadius: 14, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
  cardHint: { fontSize: 13, color: '#64748B', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1, fontWeight: '700' },

  // Inputs within white card
  formGroup: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, 
    backgroundColor: '#F8FAFC',
    ...Platform.select({ web: { transition: 'all 0.3s ease' } }),
  },
  inputWrapperActive: { 
    borderColor: '#1E3A8A', 
    backgroundColor: '#FFFFFF',
    ...Platform.select({ web: { boxShadow: '0 0 0 4px rgba(30, 58, 138, 0.1)' } })
  },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 16, fontSize: 16, color: '#0F172A', fontWeight: '500' },

  // Verification Area
  suggestionContainer: {
    marginTop: -8, marginBottom: 24, padding: 16,
    backgroundColor: '#F8FAFC', borderRadius: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  suggestionIconRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  suggestionLabel: { fontSize: 11, fontWeight: '800', color: '#1E3A8A', textTransform: 'uppercase', letterSpacing: 1 },
  suggestionName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  suggestionSchool: { fontSize: 13, color: '#475569' },

  errorContainer: { backgroundColor: '#FEF2F2', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#FECACA' },
  errorText: { color: '#B91C1C', fontSize: 14, fontWeight: '500', textAlign: 'center' },

  // Glowing Gold Action Button (Uniform Preloader Color)
  btn: {
    paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 32,
    backgroundColor: '#D4A843',
    ...Platform.select({
      web: { 
        backgroundImage: 'linear-gradient(135deg, #FFD700 0%, #D4A843 100%)',
        boxShadow: '0 8px 24px rgba(212, 168, 67, 0.3), inset 0 -2px 0 rgba(0,0,0,0.1)', 
        cursor: 'pointer', transition: 'all 0.3s ease' 
      },
      ios: { shadowColor: '#D4AF37', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 },
    }),
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#0F2557', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 }, // Navy text on Gold button

  // Demo Section
  demoSection: { marginTop: 8, paddingTop: 24, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  demoHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  demoSectionTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 },
  infoTrigger: { marginLeft: 6, padding: 4, borderRadius: 12, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  
  // Floating Tooltip
  tooltipContainerWeb: { position: 'absolute', bottom: '100%', marginBottom: 12, zIndex: 100, left: '50%', transform: 'translateX(-50%)', width: 280 },
  tooltipContainer: { position: 'absolute', bottom: '100%', marginBottom: 12, zIndex: 100, width: 280, left: -60 },
  tooltipContent: {
    backgroundColor: '#0F172A', borderRadius: 16, padding: 16, width: '100%',
    ...Platform.select({ web: { boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)' }, ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 } })
  },
  tooltipHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  tooltipTitle: { fontSize: 13, fontWeight: '700', color: '#F8FAFC' },
  tooltipText: { fontSize: 13, color: '#CBD5E1', lineHeight: 20, marginBottom: 6 },
  tooltipArrow: { position: 'absolute', bottom: -6, left: '50%', marginLeft: -6, width: 12, height: 12, backgroundColor: '#0F172A', transform: [{ rotate: '45deg' }] },
  bold: { fontWeight: '700', color: '#FFFFFF' },

  // Clickable Demo Buttons
  demoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  demoBtn: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20,
    backgroundColor: '#FFFFFF', // Crisp white
    borderWidth: 1, borderColor: '#E2E8F0',
    ...Platform.select({ 
      web: { cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' } 
    }),
  },
  demoBtnText: { fontSize: 13, fontWeight: '700', color: '#475569' }, // Professional slate text
});

export default Login;