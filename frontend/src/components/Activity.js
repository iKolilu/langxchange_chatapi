import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    RefreshControl,
    SafeAreaView,
    Platform
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react-native';

// ─── Sample Activity Data (Following november_mobile schema) ────────────────
const INITIAL_ACTIVITIES = [
    {
        id: 'act-1',
        action_uuid: 'uuid-1',
        type: 'AGENT ACTION',
        tool_name: 'google_search',
        description: 'Searching for updated curriculum standards for Mathematics B4.',
        status: 'New',
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: 'act-2',
        action_uuid: 'uuid-2',
        type: 'AGENT ACTION',
        tool_name: 'generate_image',
        description: 'Generating visual aids for photosynthesis lesson plan.',
        status: 'Approved',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: 'act-3',
        action_uuid: 'uuid-3',
        type: 'AGENT ACTION',
        tool_name: 'read_document',
        description: 'Analyzing "GES_Teaching_Standards.pdf" for compliance check.',
        status: 'Completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: 'act-4',
        action_uuid: 'uuid-4',
        type: 'AGENT ACTION',
        tool_name: 'send_email',
        description: 'Drafting weekly PLC summary report for Shama District.',
        status: 'Declined',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
];

const STATUS_STYLES = {
    New: { color: '#D97706', bg: '#FFFBEB', icon: Clock },
    Approved: { color: '#1E3A8A', bg: '#EFF6FF', icon: CheckCircle },
    Completed: { color: '#059669', bg: '#ECFDF5', icon: CheckCircle },
    Declined: { color: '#DC2626', bg: '#FEF2F2', icon: XCircle },
};

const Activity = () => {
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const { colors, spacing } = theme;

    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    };

    const handleUpdateStatus = (actionUuid, status) => {
        setProcessingId(actionUuid);
        setTimeout(() => {
            setActivities(prev => prev.map(item =>
                item.action_uuid === actionUuid ? { ...item, status } : item
            ));
            setProcessingId(null);
            if (status === 'Approved') {
                Alert.alert('Success', 'Action approved successfully.');
            }
        }, 600);
    };

    const renderActivity = ({ item }) => {
        const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.New;
        const StatusIcon = statusStyle.icon;

        return (
            <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {/* Left accent bar */}
                <View style={[styles.accentBar, { backgroundColor: statusStyle.color }]} />

                <View style={styles.activityRow}>
                    <View style={[styles.typeBadge, { backgroundColor: colors.primarySurface }]}>
                        <Text style={[styles.typeText, { color: colors.primary }]}>{item.type}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <StatusIcon size={10} color={statusStyle.color} />
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {item.status.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.actionTitle, { color: colors.text }]}>{item.tool_name}</Text>
                <Text style={[styles.details, { color: colors.textSecondary }]}>{item.description}</Text>

                {item.status === 'New' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.declineButton]}
                            onPress={() => handleUpdateStatus(item.action_uuid, 'Declined')}
                            disabled={processingId === item.action_uuid}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.buttonText, { color: '#DC2626' }]}>Decline</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.approveButton]}
                            onPress={() => handleUpdateStatus(item.action_uuid, 'Approved')}
                            disabled={processingId === item.action_uuid}
                            activeOpacity={0.8}
                        >
                            {processingId === item.action_uuid ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>Approve</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                    {new Date(item.created_at).toLocaleString()}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={activities}
                    keyExtractor={(item) => item.id}
                    renderItem={renderActivity}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                                No recent activity.
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    listContent: { padding: 16, paddingBottom: 32 },
    activityCard: {
        marginBottom: 14,
        padding: 16,
        paddingLeft: 20,
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
        position: 'relative',
        ...Platform.select({
            ios: { shadowColor: '#0F2557', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 10 },
            android: { elevation: 3 },
            web: { boxShadow: '0 4px 16px rgba(15, 37, 87, 0.06)' }
        })
    },
    accentBar: {
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 6,
    },
    details: {
        fontSize: 13,
        marginBottom: 12,
        lineHeight: 20,
    },
    timestamp: {
        fontSize: 11,
        marginTop: 4,
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
        marginBottom: 12,
        gap: 10,
    },
    button: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 10,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '700',
    },
    approveButton: {
        backgroundColor: '#1E3A8A',
        ...Platform.select({
            ios: { shadowColor: '#1E3A8A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8 },
            web: { boxShadow: '0 3px 12px rgba(30, 58, 138, 0.3)', cursor: 'pointer' },
        }),
    },
    declineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#FCA5A5',
    },
});

export default Activity;
