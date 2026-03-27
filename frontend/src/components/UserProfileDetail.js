import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    SafeAreaView
} from 'react-native';
import { useNavigate } from 'react-router-native';
import {
    ChevronLeft, User as UserIcon, Mail, Phone,
    School, Book, Briefcase, MapPin, BadgeCheck
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const UserProfileDetail = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { currentUser } = useAuth();
    const { colors, spacing, borderRadius } = theme;

    if (!currentUser) return null;

    const ProfileItem = ({ icon: Icon, label, value, color = colors.textSecondary }) => (
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
            <View style={styles.labelContainer}>
                <Icon size={18} color={colors.textMuted} style={styles.icon} />
                <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
    );

    const SubjectChip = ({ subject }) => (
        <View style={[styles.chip, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
            <Text style={[styles.chipText, { color: colors.primary }]}>{subject}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
                <TouchableOpacity onPress={() => navigate('/settings')} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.primary} />
                    <Text style={[styles.backText, { color: colors.primary }]}>Settings</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Profile Details</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} scrollEnabled={Platform.OS !== 'web'}>
                {/* Header Profile Section */}
                <View style={[styles.profileHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                            {currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>{currentUser.name}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: colors.primary + '20' }]}>
                        <BadgeCheck size={14} color={colors.primary} />
                        <Text style={[styles.roleText, { color: colors.primary }]}>{currentUser.role}</Text>
                    </View>
                </View>

                {/* Account Details */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CONTACT INFORMATION</Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <ProfileItem
                        icon={Mail}
                        label="Email Address"
                        value={currentUser.email}
                    />
                    <ProfileItem
                        icon={Phone}
                        label="Phone Number"
                        value={currentUser.phoneNumber}
                    />
                </View>

                {/* Professional Details */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>
                    PROFESSIONAL ASSIGNMENT
                </Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <ProfileItem
                        icon={Briefcase}
                        label="Designation / Role"
                        value={currentUser.role}
                    />
                    <ProfileItem
                        icon={School}
                        label="School"
                        value={currentUser.school}
                    />
                    <ProfileItem
                        icon={MapPin}
                        label="Region / District"
                        value={`${currentUser.region} · ${currentUser.district}`}
                    />
                    {currentUser.class && (
                        <ProfileItem
                            icon={Book}
                            label="Assigned Class"
                            value={currentUser.class}
                        />
                    )}
                </View>

                {/* Subjects */}
                <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.lg }]}>
                    SUBJECTS TAUGHT
                </Text>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 16 }]}>
                    <View style={styles.chipContainer}>
                        {currentUser.subjectsTaught?.map((subject, index) => (
                            <SubjectChip key={index} subject={subject} />
                        )) || <Text style={{ color: colors.textMuted }}>No subjects assigned</Text>}
                    </View>
                </View>

                <View style={styles.noticeCard}>
                    <Text style={[styles.noticeText, { color: colors.textMuted }]}>
                        Profile information is managed by the District IT Coordinator. If any details are incorrect, please contact your SISO.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
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
        paddingTop: Platform.OS === 'ios' ? 0 : 16,
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
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: '700',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 6,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 1,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: 8,
    },
    infoRow: {
        padding: 16,
        borderBottomWidth: 1,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        marginRight: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    noticeCard: {
        marginTop: 24,
        padding: 16,
        alignItems: 'center',
    },
    noticeText: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
        fontStyle: 'italic',
    },
});

export default UserProfileDetail;
