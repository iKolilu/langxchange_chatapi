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

    const renderActivity = ({ item }) => (
        <View style={[styles.activityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.activityRow}>
                <View style={[styles.typeBadge, { backgroundColor: colors.primary + '20' }]}>
                    <Text style={[styles.typeText, { color: colors.primary }]}>{item.type}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={[
                        styles.statusText,
                        {
                            color: item.status === 'Completed' ? '#10B981' :
                                item.status === 'New' ? '#F59E0B' :
                                    item.status === 'Approved' ? '#3B82F6' :
                                        '#EF4444'
                        }
                    ]}>
                        ● {item.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={[styles.actionTitle, { color: colors.text }]}>{item.tool_name}</Text>
            <Text style={[styles.details, { color: colors.textSecondary }]}>{item.description}</Text>

            {item.status === 'New' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.declineButton, { borderColor: '#EF4444' }]}
                        onPress={() => handleUpdateStatus(item.action_uuid, 'Declined')}
                        disabled={processingId === item.action_uuid}
                    >
                        <Text style={[styles.buttonText, { color: '#EF4444' }]}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.approveButton, { backgroundColor: colors.primary }]}
                        onPress={() => handleUpdateStatus(item.action_uuid, 'Approved')}
                        disabled={processingId === item.action_uuid}
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Activity</Text>
            </View>

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
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    activityCard: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
            android: { elevation: 2 },
            web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
        })
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    typeText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    statusBadge: {
        marginLeft: 'auto',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    details: {
        fontSize: 14,
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
        gap: 12,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    approveButton: {
        borderWidth: 0,
    },
    declineButton: {
        backgroundColor: 'transparent',
    },
});

export default Activity;
