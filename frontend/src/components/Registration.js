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
  Modal,
  FlatList
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Phone, User, MapPin, School, Users, ChevronDown, GraduationCap } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { regions, districts, localGovernments, schools, gradeLevels, subjectAreas } from '../data/sampleData';

const Registration = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    region: '',
    district: '',
    localGovernment: '',
    school: '',
    class: '',
    type: 'Class Teacher'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleValueChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing/selecting
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset dependent fields when parent field changes
    if (name === 'region') {
      setFormData(prev => ({
        ...prev,
        district: '',
        localGovernment: '',
        school: ''
      }));
    } else if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        localGovernment: '',
        school: ''
      }));
    } else if (name === 'localGovernment') {
      setFormData(prev => ({
        ...prev,
        school: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.region) newErrors.region = 'Region is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.localGovernment) newErrors.localGovernment = 'Local Government is required';
    if (!formData.school) newErrors.school = 'School is required';
    if (!formData.class.trim()) newErrors.class = 'Class is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = register(formData);
      if (result.success) {
        navigate('/home');
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ submit: 'An error occurred during registration' });
    } finally {
      setLoading(false);
    }
  };

  const availableDistricts = formData.region ? districts[formData.region] || [] : [];
  const availableLocalGovernments = formData.district ? localGovernments[formData.district] || [] : [];
  const availableSchools = formData.localGovernment ? schools[formData.localGovernment] || [] : [];

  const renderPicker = (label, name, value, options, icon, disabled = false) => (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, disabled && styles.disabledInput]}>
        {icon}
        <Picker
          selectedValue={value}
          onValueChange={(itemValue) => handleValueChange(name, itemValue)}
          enabled={!disabled}
          style={styles.picker}
        >
          <Picker.Item label={`Select ${label}`} value="" />
          {options.map(opt => (
            <Picker.Item key={opt} label={opt} value={opt} />
          ))}
        </Picker>
      </View>
      {errors[name] ? <Text style={styles.errorText}>{errors[name]}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} scrollEnabled={Platform.OS !== 'web'}>
          {/* Logo/Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <GraduationCap size={40} color="#3B82F6" />
            </View>
            <Text style={styles.title}>Join TCT</Text>
            <Text style={styles.subtitle}>Teacher Community Toolkits</Text>
          </View>

          {/* Registration Form */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Registration</Text>

            {/* Name Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User style={styles.inputIcon} size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleValueChange('name', text)}
                  placeholder="Dr. John Smith"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Phone Number Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Phone style={styles.inputIcon} size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleValueChange('phoneNumber', text)}
                  placeholder="+233-24-412-3456"
                  keyboardType="phone-pad"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}
            </View>

            {/* Region Field */}
            {renderPicker('Region', 'region', formData.region, regions, <MapPin style={styles.inputIcon} size={18} color="#9CA3AF" />)}

            {/* District Field */}
            {renderPicker('District', 'district', formData.district, availableDistricts, <MapPin style={styles.inputIcon} size={18} color="#9CA3AF" />, !formData.region)}

            {/* Local Government Field */}
            {renderPicker('Local Government', 'localGovernment', formData.localGovernment, availableLocalGovernments, <MapPin style={styles.inputIcon} size={18} color="#9CA3AF" />, !formData.district)}

            {/* School Field */}
            {renderPicker('School', 'school', formData.school, availableSchools, <School style={styles.inputIcon} size={18} color="#9CA3AF" />, !formData.localGovernment)}

            {/* Class Field */}
            {renderPicker('Class/Grade Level', 'class', formData.class, [...gradeLevels, ...subjectAreas], <Users style={styles.inputIcon} size={18} color="#9CA3AF" />)}

            {/* Teacher Type Field */}
            {renderPicker('Type', 'type', formData.type, ['Class Teacher', 'Subject Teacher'], <Users style={styles.inputIcon} size={18} color="#9CA3AF" />)}

            {/* Submit Error */}
            {errors.submit ? (
              <View style={styles.submitError}>
                <Text style={styles.errorText}>{errors.submit}</Text>
              </View>
            ) : null}

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.btn, styles.btnPrimary, loading && styles.btnDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnTextPrimary}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigate('/login')}>
                <Text style={styles.linkText}>Sign in here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#EFF6FF',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  picker: {
    flex: 1,
    height: 50,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  submitError: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimary: {
    backgroundColor: '#3B82F6',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnTextPrimary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default Registration;