import React, { useState, useCallback, useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    TextInput,
    Platform
} from 'react-native';
import { useNavigate } from 'react-router-native';
import { useTheme } from '../contexts/ThemeContext';
import { MessageSquare, Search, Trash2, Sparkles } from 'lucide-react-native';

// ─── Sample Session Data ───────────────────────────────────────────────
const INITIAL_SESSIONS = [
    {
        id: 'sess-1',
        sessionUuid: 'uuid-101',
        agentId: 'agent-plc',
        agentName: 'PLC Teaching Assistant',
        lastMessage: 'Your lesson plan for Basic 4 Mathematics is ready for review.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'sess-2',
        sessionUuid: 'uuid-102',
        agentId: 'agent-curr',
        agentName: 'Curriculum Specialist',
        lastMessage: 'I suggest focusing on the "Number" strand for this week.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
        id: 'sess-3',
        sessionUuid: 'uuid-103',
        agentId: 'agent-admin',
        agentName: 'School Admin Bot',
        lastMessage: 'PLC attendance has been recorded for your last session.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    }
];

// ─── HELPERS ────────────────────────────────────────────────
const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return '1d';
};

const Chats = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { colors } = theme;

    const [sessions, setSessions] = useState(INITIAL_SESSIONS);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    const confirmDelete = (sessionId, agentName) => {
        const deleteAction = () => {
            setDeletingId(sessionId);
            setTimeout(() => {
                setSessions(prev => prev.filter(s => s.sessionUuid !== sessionId));
                setDeletingId(null);
            }, 500);
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Delete "${agentName}" session?`)) deleteAction();
        } else {
            Alert.alert(
                'Delete Chat',
                `Delete your chat with "${agentName}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: deleteAction },
                ]
            );
        }
    };

    const filtered = useMemo(() => {
        return sessions
            .filter(s =>
                s.agentName.toLowerCase().includes(search.toLowerCase()) ||
                s.lastMessage.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    }, [sessions, search]);

    const active = filtered.slice(0, 2);
    const rest = filtered.slice(2);

    // ─── ACTIVE CARD ─────────────────────────────────────────
    const ActiveCard = ({ item }) => (
        <TouchableOpacity
            style={[styles.activeCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigate(`/meetings/${item.sessionUuid}`)}
            activeOpacity={0.8}
        >
            <View style={styles.activeHeader}>
                <Sparkles size={14} color={colors.primary} />
                <Text style={[styles.activeLabel, { color: colors.primary }]}>
                    Active
                </Text>
            </View>

            <Text style={[styles.activeTitle, { color: colors.text }]}>
                {item.agentName}
            </Text>

            <Text style={[styles.activeMessage, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.lastMessage}
            </Text>

            <Text style={[styles.activeTime, { color: colors.textMuted }]}>
                {formatTime(item.lastMessageAt)}
            </Text>
        </TouchableOpacity>
    );

    // ─── LIST ROW ────────────────────────────────────────────
    const Row = ({ item }) => {
        const isDeleting = deletingId === item.sessionUuid;

        return (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => navigate(`/meetings/${item.sessionUuid}`)}
                >
                    <Text style={[styles.rowTitle, { color: colors.text }]}>
                        {item.agentName}
                    </Text>
                    <Text style={[styles.rowMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                </TouchableOpacity>

                <View style={styles.rowRight}>
                    <Text style={[styles.rowTime, { color: colors.textMuted }]}>
                        {formatTime(item.lastMessageAt)}
                    </Text>

                    <TouchableOpacity onPress={() => confirmDelete(item.sessionUuid, item.agentName)}>
                        {isDeleting ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Trash2 size={14} color={colors.textMuted} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Workspace
                </Text>
                <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                    Continue working on your sessions
                </Text>
            </View>

            {/* SEARCH */}
            <View style={styles.searchWrap}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={14} color={colors.textMuted} />
                    <TextInput
                        placeholder="Search sessions..."
                        placeholderTextColor={colors.textMuted}
                        value={search}
                        onChangeText={setSearch}
                        style={[styles.input, { color: colors.text }]}
                    />
                </View>
            </View>

            <FlatList
                data={[{ key: 'content' }]}
                renderItem={() => (
                    <View style={{ padding: 16 }}>

                        {/* ACTIVE */}
                        {active.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                                    Active Sessions
                                </Text>
                                {active.map(item => (
                                    <ActiveCard key={item.sessionUuid} item={item} />
                                ))}
                            </>
                        )}

                        {/* ALL */}
                        <Text style={[styles.sectionTitle, { color: colors.textMuted, marginTop: 20 }]}>
                            All Conversations
                        </Text>

                        {rest.map(item => (
                            <Row key={item.sessionUuid} item={item} />
                        ))}

                        {filtered.length === 0 && (
                            <View style={styles.empty}>
                                <MessageSquare size={40} color={colors.textMuted} />
                                <Text style={{ color: colors.textMuted, marginTop: 8 }}>
                                    No sessions found
                                </Text>
                            </View>
                        )}
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MessageSquare size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                            No sessions found.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

// ─── STYLES ────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },

    header: { padding: 16 },
    title: { fontSize: 20, fontWeight: '800' },
    subtitle: { fontSize: 13, marginTop: 4 },

    searchWrap: { paddingHorizontal: 16, paddingBottom: 8 },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        gap: 6,
    },
    input: { flex: 1, fontSize: 13 },

    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        marginBottom: 10,
        textTransform: 'uppercase',
    },

    activeCard: {
        borderWidth: 1,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },
    activeHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
    activeLabel: { fontSize: 11, fontWeight: '700' },
    activeTitle: { fontSize: 14, fontWeight: '700' },
    activeMessage: { fontSize: 13, marginTop: 4 },
    activeTime: { fontSize: 11, marginTop: 6 },

    row: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    rowTitle: { fontSize: 14, fontWeight: '600' },
    rowMessage: { fontSize: 12, marginTop: 2 },

    rowRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    rowTime: { fontSize: 11, marginBottom: 6 },

    empty: {
        marginTop: 80,
        alignItems: 'center',
    },
});

export default Chats;