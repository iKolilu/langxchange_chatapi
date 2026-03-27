import React, { useState, useCallback } from 'react';
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
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MessageSquare, Search, Trash2, ChevronRight } from 'lucide-react-native';

// ─── Sample Session Data (Following november_mobile schema) ────────────────
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

const Chats = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const { colors } = theme;

    const [sessions, setSessions] = useState(INITIAL_SESSIONS);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [revealedId, setRevealedId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    const confirmDelete = (sessionId, agentName) => {
        const deleteAction = () => {
            setDeletingId(sessionId);
            setRevealedId(null);
            setTimeout(() => {
                setSessions(prev => prev.filter(s => s.sessionUuid !== sessionId));
                setDeletingId(null);
            }, 600);
        };

        if (Platform.OS === 'web') {
            if (window.confirm(`Delete your chat with "${agentName}"?`)) {
                deleteAction();
            } else {
                setRevealedId(null);
            }
        } else {
            Alert.alert(
                'Delete Chat',
                `Delete your chat with "${agentName}"? This cannot be undone.`,
                [
                    { text: 'Cancel', style: 'cancel', onPress: () => setRevealedId(null) },
                    { text: 'Delete', style: 'destructive', onPress: deleteAction },
                ]
            );
        }
    };

    const filteredSessions = sessions.filter(s =>
        s.agentName.toLowerCase().includes(search.toLowerCase()) ||
        s.lastMessage.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

    const renderSession = ({ item }) => {
        const isRevealed = revealedId === item.sessionUuid;
        const isDeleting = deletingId === item.sessionUuid;

        return (
            <View style={styles.rowWrapper}>
                <TouchableOpacity
                    onPress={() => isRevealed ? setRevealedId(null) : navigate(`/meetings/${item.sessionUuid}`)}
                    onLongPress={() => setRevealedId(isRevealed ? null : item.sessionUuid)}
                    activeOpacity={0.7}
                    style={[
                        styles.sessionRow,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        isRevealed && styles.sessionRowRevealed
                    ]}
                >
                    {/* Avatar */}
                    <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.avatarText, { color: colors.primary }]}>
                            {item.agentName.charAt(0).toUpperCase()}
                        </Text>
                    </View>

                    {/* Content */}
                    <View style={styles.sessionContent}>
                        <View style={styles.sessionHeader}>
                            <Text style={[styles.agentName, { color: colors.text }]} numberOfLines={1}>
                                {item.agentName}
                            </Text>
                            <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                                {new Date(item.lastMessageAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <Text style={[styles.lastMessage, { color: colors.textSecondary }]} numberOfLines={1}>
                            {item.lastMessage}
                        </Text>
                    </View>

                    {!isRevealed && (
                        <ChevronRight size={18} color={colors.textMuted} />
                    )}
                </TouchableOpacity>

                {(isRevealed || isDeleting) && (
                    <TouchableOpacity
                        style={[styles.deleteBtn, { opacity: isDeleting ? 0.5 : 1 }]}
                        onPress={() => confirmDelete(item.sessionUuid, item.agentName)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Trash2 size={16} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.deleteBtnText}>Delete Session</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
                <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
                    Long press a session to delete
                </Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Search size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search sessions..."
                        placeholderTextColor={colors.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            <FlatList
                data={filteredSessions}
                keyExtractor={(item) => item.sessionUuid}
                renderItem={renderSession}
                contentContainerStyle={styles.listContent}
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
    headerSub: {
        fontSize: 11,
        marginTop: 2,
    },
    searchContainer: {
        padding: 12,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
        borderRadius: 10,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    rowWrapper: {
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
    },
    sessionRowRevealed: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
    },
    sessionContent: {
        flex: 1,
        marginRight: 8,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    agentName: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    timestamp: {
        fontSize: 11,
    },
    lastMessage: {
        fontSize: 13,
    },
    deleteBtn: {
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    deleteBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 13,
    },
    emptyContainer: {
        paddingTop: 100,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        marginTop: 12,
    },
});

export default Chats;
