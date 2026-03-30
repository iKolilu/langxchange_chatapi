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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigate } from 'react-router-native';
import { ChevronLeft, Plus, Trash2, Edit2, CreditCard, Globe, Hash, CheckCircle2, Circle, Calendar } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const ID_TYPES = [
    'Passport',
    'Drivers License',
    'Teacher ID',
    'Work ID',
    'Other ID',
];

const STATUS_OPTIONS = [
    'Default',
    'Option',
];

const COUNTRIES = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
    "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Holy See", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
    "Vanuatu", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
];

const Identifications = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { colors, spacing, borderRadius } = theme;

    const [identifications, setIdentifications] = useState([
        {
            id: 1,
            idType: 'National ID',
            idNo: 'GHA-123456789-0',
            country: 'Ghana',
            status: 'Default',
            expiryDate: '2030-12-31',
        },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        idType: 'Passport',
        idNo: '',
        country: 'Ghana',
        status: 'Option',
        expiryDate: '',
    });

    const handleAddId = () => {
        setEditingId(null);
        setFormData({
            idType: 'Passport',
            idNo: '',
            country: 'Ghana',
            status: 'Option',
            expiryDate: '',
        });
        setModalVisible(true);
    };

    const handleEditId = (idDoc) => {
        setEditingId(idDoc);
        setFormData({ ...idDoc });
        setModalVisible(true);
    };

    const handleDeleteId = (id) => {
        Alert.alert(
            'Delete Identification',
            'Are you sure you want to delete this identification document?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: () => {
                        setIdentifications(identifications.filter(item => item.id !== id));
                    }
                },
            ]
        );
    };

    const handleSaveId = () => {
        if (!formData.idType || !formData.idNo || !formData.country || !formData.status || !formData.expiryDate) {
            alert('Please fill in all fields');
            return;
        }

        if (editingId) {
            setIdentifications(identifications.map(item => item.id === editingId.id ? { ...formData } : item));
        } else {
            setIdentifications([...identifications, { ...formData, id: Date.now() }]);
        }
        setModalVisible(false);
    };

    const IdCard = ({ idDoc }) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
                <View style={styles.idInfo}>
                    <CreditCard size={20} color={colors.primary} />
                    <View style={styles.typeStatusContainer}>
                        <Text style={[styles.idType, { color: colors.text }]}>{idDoc.idType}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: idDoc.status === 'Default' ? colors.success + '20' : colors.textMuted + '20' }]}>
                            <Text style={[styles.statusBadgeText, { color: idDoc.status === 'Default' ? colors.success : colors.textSecondary }]}>{idDoc.status}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    <TouchableOpacity onPress={() => handleEditId(idDoc)} style={styles.iconBtn}>
                        <Edit2 size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteId(idDoc.id)} style={styles.iconBtn}>
                        <Trash2 size={16} color={colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.infoLine}>
                    <Hash size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{idDoc.idNo}</Text>
                </View>
                <View style={styles.infoLine}>
                    <Globe size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{idDoc.country}</Text>
                </View>
                <View style={styles.infoLine}>
                    <Calendar size={14} color={colors.textMuted} />
                    <Text style={[styles.infoValue, { color: colors.textSecondary }]}>Expires: {idDoc.expiryDate}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigate('/settings')} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Identifications</Text>
                <TouchableOpacity onPress={handleAddId} style={styles.addButton}>
                    <Plus size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} scrollEnabled={Platform.OS !== 'web'}>
                {identifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <CreditCard size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No identifications added yet</Text>
                    </View>
                ) : (
                    identifications.map(idDoc => <IdCard key={idDoc.id} idDoc={idDoc} />)
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
                                {editingId ? 'Edit Identification' : 'Add Identification'}
                            </Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={{ color: colors.error }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalForm}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ID Type</Text>
                                <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
                                    <Picker
                                        selectedValue={formData.idType}
                                        onValueChange={(value) => setFormData({ ...formData, idType: value })}
                                        style={[styles.picker, { color: colors.text }]}
                                        dropdownIconColor={colors.primary}
                                    >
                                        {ID_TYPES.map(type => (
                                            <Picker.Item key={type} label={type} value={type} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>ID Number</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                    value={formData.idNo}
                                    onChangeText={(text) => setFormData({ ...formData, idNo: text })}
                                    placeholder="Enter ID number"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Status</Text>
                                <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
                                    <Picker
                                        selectedValue={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                        style={[styles.picker, { color: colors.text }]}
                                        dropdownIconColor={colors.primary}
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <Picker.Item key={status} label={status} value={status} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Country</Text>
                                <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
                                    <Picker
                                        selectedValue={formData.country}
                                        onValueChange={(value) => setFormData({ ...formData, country: value })}
                                        style={[styles.picker, { color: colors.text }]}
                                        dropdownIconColor={colors.primary}
                                    >
                                        <Picker.Item label="Select Country" value="" />
                                        {COUNTRIES.map(country => (
                                            <Picker.Item key={country} label={country} value={country} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                                <TextInput
                                    style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]}
                                    value={formData.expiryDate}
                                    onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={colors.textMuted}
                                />
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                            onPress={handleSaveId}
                        >
                            <Text style={styles.saveBtnText}>Save Identification</Text>
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
    idInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    typeStatusContainer: {
        marginLeft: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    idType: {
        fontSize: 16,
        fontWeight: '700',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '600',
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
        maxHeight: '85%',
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
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
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
});

export default Identifications;
