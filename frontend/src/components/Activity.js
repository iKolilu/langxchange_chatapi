import React, { useState, useMemo, useCallback } from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import { Clock, CheckCircle, XCircle } from 'lucide-react-native';

// ─── SAME DATA ───────────────────────────────────────────────
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
        description: 'Analyzing GES Teaching Standards for compliance check.',
        status: 'Completed',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: 'act-4',
        action_uuid: 'uuid-4',
        type: 'AGENT ACTION',
        tool_name: 'send_email',
        description: 'Drafting weekly PLC summary report.',
        status: 'Declined',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
];

// ─── HELPERS ────────────────────────────────────────────────
const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return 'Yesterday';
};

const formatToolName = (name) =>
    name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// ─── STATUS CONFIG ──────────────────────────────────────────
const STATUS_CONFIG = {
    New: { icon: Clock, color: '#D97706' },
    Approved: { icon: CheckCircle, color: '#1E3A8A' },
    Completed: { icon: CheckCircle, color: '#059669' },
    Declined: { icon: XCircle, color: '#DC2626' },
};

// ─── COMPONENT ──────────────────────────────────────────────
const Activity = () => {
    const { theme } = useTheme();
    const { colors } = theme;

    const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    // ─── SPLIT DATA ─────────────────────────────────────────
    const { pending, others } = useMemo(() => {
        const sorted = [...activities].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        return {
            pending: sorted.filter(a => a.status === 'New'),
            others: sorted.filter(a => a.status !== 'New'),
        };
    }, [activities]);

    // ─── COUNTS ─────────────────────────────────────────────
    const counts = useMemo(() => {
        return {
            pending: activities.filter(a => a.status === 'New').length,
            approved: activities.filter(a => a.status === 'Approved').length,
            completed: activities.filter(a => a.status === 'Completed').length,
            declined: activities.filter(a => a.status === 'Declined').length,
        };
    }, [activities]);

    // ─── ACTION HANDLER ─────────────────────────────────────
    const handleUpdateStatus = (id, status) => {
        setProcessingId(id);
        setTimeout(() => {
            setActivities(prev =>
                prev.map(a =>
                    a.action_uuid === id ? { ...a, status } : a
                )
            );
            setProcessingId(null);
        }, 500);
    };

    // ─── SUMMARY CARD ───────────────────────────────────────
    const SummaryCard = ({ label, count }) => (
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.summaryCount, { color: colors.text }]}>{count}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>{label}</Text>
        </View>
    );

    // ─── PRIORITY CARD (NEW) ────────────────────────────────
    const PriorityCard = ({ item }) => {
        const isProcessing = processingId === item.action_uuid;

        return (
            <View style={[styles.priorityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.toolName, { color: colors.text }]}>
                    {formatToolName(item.tool_name)}
                </Text>

                <Text style={[styles.description, { color: colors.textSecondary }]}>
                    {item.description}
                </Text>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.secondaryBtn]}
                        onPress={() => handleUpdateStatus(item.action_uuid, 'Declined')}
                        disabled={isProcessing}
                    >
                        <Text style={{ color: colors.textSecondary }}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                        onPress={() => handleUpdateStatus(item.action_uuid, 'Approved')}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={{ color: '#fff', fontWeight: '600' }}>Approve</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    // ─── TIMELINE ROW ──────────────────────────────────────
    const TimelineRow = ({ item }) => {
        const config = STATUS_CONFIG[item.status];
        const Icon = config.icon;

        return (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <Icon size={16} color={config.color} />

                <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.rowTitle, { color: colors.text }]}>
                        {formatToolName(item.tool_name)}
                    </Text>
                    <Text style={[styles.rowDesc, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.description}
                    </Text>
                </View>

                <Text style={[styles.rowTime, { color: colors.textMuted }]}>
                    {formatTime(item.created_at)}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={[{ key: 'content' }]}
                renderItem={() => (
                    <View style={{ padding: 16 }}>

                        {/* HEADER */}
                        <Text style={[styles.title, { color: colors.text }]}>
                            Activity
                        </Text>
                        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                            Monitor and manage AI actions
                        </Text>

                        {/* SUMMARY */}
                        <View style={styles.summaryRow}>
                            <SummaryCard label="Pending" count={counts.pending} />
                            <SummaryCard label="Approved" count={counts.approved} />
                            <SummaryCard label="Completed" count={counts.completed} />
                            <SummaryCard label="Declined" count={counts.declined} />
                        </View>

                        {/* PRIORITY */}
                        {pending.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                                    Requires Attention
                                </Text>
                                {pending.map(item => (
                                    <PriorityCard key={item.id} item={item} />
                                ))}
                            </>
                        )}

                        {/* TIMELINE */}
                        <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 20 }]}>
                            Recent Activity
                        </Text>

                        {others.map(item => (
                            <TimelineRow key={item.id} item={item} />
                        ))}

                        {activities.length === 0 && (
                            <View style={styles.empty}>
                                <Text style={{ color: colors.textMuted }}>
                                    No activity yet
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
            />
        </SafeAreaView>
    );
};

// ─── STYLES ────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },

    title: { fontSize: 20, fontWeight: '800' },
    subtitle: { fontSize: 13, marginBottom: 14 },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    summaryCount: { fontSize: 16, fontWeight: '800' },
    summaryLabel: { fontSize: 11 },

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
    },

    priorityCard: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },

    toolName: { fontSize: 14, fontWeight: '700' },
    description: { fontSize: 13, marginTop: 4 },

    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 10,
    },

    primaryBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },

    secondaryBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },

    rowTitle: { fontSize: 13, fontWeight: '600' },
    rowDesc: { fontSize: 12 },

    rowTime: { fontSize: 11 },

    empty: {
        marginTop: 80,
        alignItems: 'center',
    },
});

export default Activity;