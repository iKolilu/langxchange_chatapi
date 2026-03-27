import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Modal,
    Alert,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { ChevronLeft, Plus, Trash2, Edit2, Server, Key, Globe, User, Lock, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useService } from '../contexts/ServiceContext';

const Services = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { colors, spacing, borderRadius } = theme;
    const { services, authenticateService, addService, updateService, deleteService } = useService();

    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        provider: '',
        apiUrl: '',
        apiKey: '',
        username: '',
        password: '',
        agentId: '',
        companyId: '',
        applicationId: '',
        status: 'Optional',
    });
    const [authenticatingId, setAuthenticatingId] = useState(null);

    const handleAddService = () => {
        setEditingService(null);
        setFormData({
            provider: '',
            apiUrl: '',
            apiKey: '',
            username: '',
            password: '',
            agentId: '',
            companyId: '',
            applicationId: '',
            status: 'Optional',
        });
        setModalVisible(true);
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setFormData({ ...service });
        setModalVisible(true);
    };

    const handleDeleteService = (id) => {
        Alert.alert(
            'Delete Service',
            'Are you sure you want to delete this service?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        deleteService(id);
                    }
                },
            ]
        );
    };

    const handleAuthenticate = async (service) => {
        setAuthenticatingId(service.id);
        const result = await authenticateService(service.id);
        if (result.success) {
            Alert.alert('Success', 'Service authenticated successfully!');
        } else {
            Alert.alert('Error', result.message || 'Authentication failed.');
        }
        setAuthenticatingId(null);
    };

    const handleSaveService = () => {
        if (!formData.provider || !formData.apiUrl) {
            alert('Please fill in Provider and API URL');
            return;
        }

        if (editingService) {
            updateService(formData);
        } else {
            addService(formData);
        }
        setModalVisible(false);
    };

    const ServiceCard = ({ service }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.providerInfo}>
                    <Server size={20} color={colors.primary} />
                    <Text style={[styles.providerName, { color: colors.text }]}>{service.provider}</Text>
                    <View style={[styles.statusBadge, {
                        backgroundColor: service.status === 'Default' ? colors.success + '20' : colors.textMuted + '20'
                    }]}>
                        <Text style={[styles.statusText, {
                            color: service.status === 'Default' ? colors.success : colors.textSecondary
                        }]}>{service.status}</Text>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => handleEditService(service)} style={styles.iconBtn}>
                        <Edit2 size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteService(service.id)} style={styles.iconBtn}>
                        <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.infoLine}>
                    <Globe size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{service.apiUrl}</Text>
                </View>
                <View style={styles.infoLine}>
                    <User size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                        {service.type === 'playlab' ? 'Direct API Key' : `${service.username} (${service.companyId})`}
                    </Text>
                </View>
                <View style={styles.infoLine}>
                    <Key size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
                        {service.type === 'playlab' ? 'Project ID' : 'App ID'}: {service.applicationId}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.authBtn,
                    {
                        backgroundColor: service.isAuthenticated ? colors.success + '20' : colors.primary + '10',
                        borderColor: service.isAuthenticated ? colors.success : colors.primary
                    }
                ]}
                onPress={() => handleAuthenticate(service)}
                disabled={authenticatingId === service.id}
            >
                {authenticatingId === service.id ? (
                    <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                    <>
                        {service.isAuthenticated ? (
                            <CheckCircle size={16} color={colors.success} style={{ marginRight: 8 }} />
                        ) : (
                            <Lock size={16} color={colors.primary} style={{ marginRight: 8 }} />
                        )}
                        <Text style={[
                            styles.authBtnText,
                            { color: service.isAuthenticated ? colors.success : colors.primary }
                        ]}>
                            {service.isAuthenticated ? 'Authenticated' : 'Authenticate Service'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigate('/settings')} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Services</Text>
                <TouchableOpacity onPress={handleAddService} style={styles.addButton}>
                    <Plus size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} scrollEnabled={Platform.OS !== 'web'}>
                {services.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Server size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No services added yet</Text>
                    </View>
                ) : (
                    services.map(service => <ServiceCard key={service.id} service={service} />)
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>
                                {editingService ? 'Edit Service' : 'Add New Service'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: colors.error }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Service Provider</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                    value={formData.provider}
                                    onChangeText={(text) => setFormData({ ...formData, provider: text })}
                                    placeholder="e.g. November AI"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>API URL</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                    value={formData.apiUrl}
                                    onChangeText={(text) => setFormData({ ...formData, apiUrl: text })}
                                    placeholder="https://api.example.com"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>API Key</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                    value={formData.apiKey}
                                    onChangeText={(text) => setFormData({ ...formData, apiKey: text })}
                                    placeholder="Enter API key"
                                    secureTextEntry={true}
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            {formData.provider?.toLowerCase().includes('playlab') ? (
                                <View style={styles.inputGroup}>
                                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Project ID</Text>
                                    <TextInput
                                        style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                        value={formData.applicationId}
                                        onChangeText={(text) => setFormData({ ...formData, applicationId: text })}
                                        placeholder="Enter Project ID"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>
                            ) : (
                                <>
                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Username</Text>
                                        <TextInput
                                            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                            value={formData.username}
                                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                                            placeholder="Enter username"
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
                                        <TextInput
                                            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                            value={formData.password}
                                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                                            placeholder="Enter password"
                                            secureTextEntry={true}
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Agent ID</Text>
                                        <TextInput
                                            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                            value={formData.agentId}
                                            onChangeText={(text) => setFormData({ ...formData, agentId: text })}
                                            placeholder="Enter Agent ID"
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Company ID</Text>
                                        <TextInput
                                            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                            value={formData.companyId}
                                            onChangeText={(text) => setFormData({ ...formData, companyId: text })}
                                            placeholder="Enter Company ID"
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.inputGroup}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Application ID</Text>
                                        <TextInput
                                            style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                            value={formData.applicationId}
                                            onChangeText={(text) => setFormData({ ...formData, applicationId: text })}
                                            placeholder="Enter Application ID"
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>
                                </>
                            )}

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Status</Text>
                                <View style={styles.statusOptions}>
                                    {['Default', 'Optional'].map(status => (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.statusBtn,
                                                {
                                                    borderColor: formData.status === status ? colors.primary : colors.border,
                                                    backgroundColor: formData.status === status ? colors.primary + '10' : 'transparent'
                                                }
                                            ]}
                                            onPress={() => setFormData({ ...formData, status })}
                                        >
                                            <Text style={{
                                                color: formData.status === status ? colors.primary : colors.textSecondary,
                                                fontWeight: formData.status === status ? '600' : '400'
                                            }}>{status}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                            onPress={handleSaveService}
                        >
                            <Text style={styles.saveBtnText}>Save Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 16,
        marginLeft: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        padding: 16,
    },
    card: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    providerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    cardActions: {
        flexDirection: 'row',
    },
    iconBtn: {
        marginLeft: 12,
        padding: 4,
    },
    cardBody: {
        gap: 4,
    },
    infoLine: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoValue: {
        fontSize: 12,
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    modalForm: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
    },
    modalInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    statusOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    statusBtn: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    saveBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: Platform.OS === 'ios' ? 20 : 0,
    },
    saveBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    authBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
    },
    authBtnText: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Services;
