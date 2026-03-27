import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Modal,
} from 'react-native';
import {
    Send, User, Bot, X, Lock, ChevronDown, ChevronUp,
    Server, Globe, Key, Hash, Shield, AlertCircle, Copy,
    Share2, Download, Settings
} from 'lucide-react-native';
import { marked } from 'marked';
import { useService } from '../contexts/ServiceContext';
import { useAuth } from '../contexts/AuthContext';
import { detectRichContent } from '../utils/richContent';
import RichContentRenderer from './RichContentRenderer';

// ─── Agent Info Banner ────────────────────────────────────────────────────────

const AgentDetailsBanner = ({ service, isOpen, onToggle }) => {
    if (!service) return null;
    return (
        <View style={styles.agentBanner}>
            <TouchableOpacity style={styles.agentBannerHeader} onPress={onToggle} activeOpacity={0.7}>
                <View style={styles.agentBannerLeft}>
                    <Server size={14} color="#3B82F6" />
                    <Text style={styles.agentBannerTitle}>
                        {service.provider}
                    </Text>
                    <View style={[
                        styles.agentStatusDot,
                        { backgroundColor: service.isAuthenticated ? '#10B981' : '#EF4444' }
                    ]} />
                    <Text style={[
                        styles.agentStatusText,
                        { color: service.isAuthenticated ? '#10B981' : '#EF4444' }
                    ]}>
                        {service.isAuthenticated ? 'Active' : 'Offline'}
                    </Text>
                </View>
                {isOpen ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.agentDetails}>
                    <DetailRow icon={<Globe size={13} color="#6B7280" />} label="API URL" value={service.apiUrl} />
                    <DetailRow icon={<Hash size={13} color="#6B7280" />} label="Agent ID" value={service.agentId} />
                    <DetailRow icon={<Key size={13} color="#6B7280" />} label="App ID" value={service.applicationId} />
                    <DetailRow icon={<Shield size={13} color="#6B7280" />} label="Company" value={service.companyId} />
                    <DetailRow icon={<User size={13} color="#6B7280" />} label="User" value={service.username} />
                </View>
            )}
        </View>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        {icon}
        <Text style={styles.detailLabel}>{label}:</Text>
        <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="middle">
            {value || '—'}
        </Text>
    </View>
);

// ─── Message Bubble ───────────────────────────────────────────────────────────

const MessageBubble = ({ msg, onAuthenticateNow, isAuthenticating, sessionId, initialParams }) => {
    const blocks = msg.role === 'assistant' && !msg.isError
        ? detectRichContent(msg.text)
        : null;

    const hasRichContent = blocks && blocks.some(b => b.type !== 'text');

    return (
        <View style={[
            styles.messageContainer,
            msg.role === 'user' ? styles.userMessage : styles.botMessage
        ]}>
            <View style={[
                styles.avatar,
                msg.role === 'user' ? styles.userAvatar : {},
                msg.isError && { backgroundColor: '#EF4444' }
            ]}>
                {msg.role === 'user'
                    ? <User size={15} color="#fff" />
                    : <Bot size={15} color="#fff" />}
            </View>

            <View style={[
                styles.messageBubble,
                msg.role === 'user' ? styles.userBubble : styles.botBubble,
                msg.isError && styles.errorBubble
            ]}>
                {/* If there's rich content, render block-by-block */}
                {hasRichContent ? (
                    <View style={{ width: '100%' }}>
                        {blocks.map((block, i) =>
                            block.type === 'text'
                                ? block.content.trim()
                                    ? <RichContentRenderer
                                        key={i}
                                        block={{ type: 'html', content: marked.parse(block.content) }}
                                        isSilent={true}
                                    />
                                    : null
                                : <RichContentRenderer
                                    key={i}
                                    block={block}
                                    headerTitle={(() => {
                                        const planType = initialParams?.planType || '';
                                        if (planType.toLowerCase().includes('plc') || planType.toLowerCase().includes('session')) {
                                            return sessionId ? `PLC Session ${sessionId.substring(0, 8)} Plan` : 'PLC Session Plan';
                                        }
                                        const planId = initialParams?.id;
                                        return planId ? `Lesson Plan ${planId}` : 'Lesson Plan Review';
                                    })()}
                                />
                        )}
                    </View>
                ) : (
                    <RichContentRenderer
                        block={{ type: 'html', content: marked.parse(msg.text) }}
                        isSilent={true}
                    />
                )}

                {msg.role === 'assistant' && msg.rag_contexts && msg.rag_contexts.length > 0 && (
                    <View style={styles.sourcesContainer}>
                        <View style={styles.sourcesHeader}>
                            <AlertCircle size={10} color="#6B7280" />
                            <Text style={styles.sourcesHeaderText}>SOURCES OF INFORMATION</Text>
                        </View>
                        {msg.rag_contexts.map((ctx, idx) => (
                            <View key={idx} style={styles.sourceItem}>
                                <Text style={styles.sourceText} numberOfLines={1}>
                                    • {ctx.file_name || 'Document'}{ctx.page_number ? ` (Page ${ctx.page_number})` : ''}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {msg.isError && (
                    <TouchableOpacity
                        style={styles.inlineAuthBtn}
                        onPress={onAuthenticateNow}
                        disabled={isAuthenticating}
                    >
                        {isAuthenticating
                            ? <ActivityIndicator size="small" color="#B91C1C" />
                            : (
                                <>
                                    <Lock size={13} color="#B91C1C" style={{ marginRight: 6 }} />
                                    <Text style={styles.inlineAuthBtnText}>Authenticate Now</Text>
                                </>
                            )
                        }
                    </TouchableOpacity>
                )}

                <Text style={[
                    styles.timestamp,
                    msg.role === 'user' ? { color: 'rgba(255,255,255,0.65)' } : { color: '#9CA3AF' }
                ]}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
};

// ─── Main Chatbot Component ───────────────────────────────────────────────────

const Chatbot = ({ isOpen, onClose, initialParams, inline = false }) => {
    const { currentUser } = useAuth();
    const { services, defaultService, authenticateService } = useService();
    const [activeService, setActiveService] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const [showAgentDetails, setShowAgentDetails] = useState(false);
    const [showServiceMenu, setShowServiceMenu] = useState(false);
    const scrollViewRef = useRef();

    useEffect(() => {
        if (!activeService && defaultService) {
            setActiveService(defaultService);
        }
    }, [defaultService]);

    const generateUserId = useCallback(() =>
        'ges_user_' + Math.random().toString(36).substring(7), []);

    // NOTE: The backend rejects user_prompt > 1000 chars with a 422.
    // Always establish session with a short greeting — real content is sent via /message.
    const establishSession = async () => {
        if (!defaultService?.isAuthenticated || !defaultService?.token) return;
        try {
            // Use the username from service config if available, fallback to random ID
            const userId = defaultService.username || generateUserId();
            const url = `${defaultService.apiUrl}/exchat/${defaultService.agentId}/${defaultService.applicationId}/${userId}/session`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${defaultService.token}`,
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    user_prompt: `I am ${currentUser?.name}, a ${currentUser?.role || 'Teacher'} at ${currentUser?.school || 'my school'}, teaching class ${currentUser?.class || 'N/A'}. I need professional assistance with my ${currentUser?.subjectsTaught?.join(', ') || 'assigned'} subjects.`,
                    use_fileconfig: false,
                    use_ddbconfig: false,
                    use_vectorconfig: true,
                    use_mcpconfig: false,
                    use_remote_storage: false
                })

            });
            if (response.ok) {
                const data = await response.json();
                setSessionId(data.session_id);
                return data.session_id;
            } else {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.detail || err.message || `Session failed (${response.status})`);
            }
        } catch (error) {
            console.error('Session error:', error);
            throw error;
        }
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            if (defaultService?.isAuthenticated) {
                const agentInfo = defaultService
                    ? `\n\nAgent: ${defaultService.provider} (ID: ${defaultService.agentId})`
                    : '';
                const welcomeMsg = {
                    role: 'assistant',
                    text: `Hello ${currentUser?.name || ''}! 👋\n\nI am your **GES PLC Assistant**. I see you are teaching class **${currentUser?.class || 'N/A'}** at **${currentUser?.school || 'your school'}**.\n\nI'm ready to help you with professional lesson planning for **${currentUser?.subjectsTaught?.join(', ') || 'your subjects'}**.\n\nHow can I assist you today?`,
                    timestamp: new Date().toISOString()
                };

                setMessages([welcomeMsg]);
                const suggestPrompt = `Using the Selected Parameters below,\n${initialParams?.prompt || ''}\n\ncreate a lesson plan adjusted for differentiation`;
                setInputText(suggestPrompt);
            } else {
                setMessages([{
                    role: 'assistant',
                    text: 'The chat service is not authenticated. Please go to Settings > Services to authenticate your account.',
                    timestamp: new Date().toISOString(),
                    isError: true
                }]);
            }
        }
    }, [isOpen, defaultService, initialParams]);

    const handleAuthenticateNow = async () => {
        if (!activeService) return;
        setIsAuthenticating(true);
        const result = await authenticateService(activeService.id);
        if (result.success) setMessages([]);
        setIsAuthenticating(false);
    };

    const handleServiceSwitch = (service) => {
        setActiveService(service);
        setSessionId(null); // Reset session for new service
        setMessages([]); // Clear chat for new context
        setShowServiceMenu(false);
    };

    const handleSend = async () => {
        if (!inputText.trim() || !activeService?.isAuthenticated) return;

        const messageToSend = inputText;
        const userMsg = {
            role: 'user',
            text: messageToSend,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            if (activeService.type === 'playlab') {
                await handlePlaylabSend(messageToSend);
            } else {
                await handleLangxchangeSend(messageToSend);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setIsLoading(false);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: `Error: ${error.message}. Please try again.`,
                timestamp: new Date().toISOString(),
                isError: true
            }]);
        }
    };

    const handleLangxchangeSend = async (messageToSend) => {
        let currentSessionId = sessionId;
        if (!currentSessionId) {
            currentSessionId = await establishSession();
        }
        if (!currentSessionId) throw new Error('Could not establish chat session');

        // Use the new streaming endpoint
        const url = `${activeService.apiUrl}/exchat/${activeService.agentId}/${activeService.applicationId}/session/${currentSessionId}/stream`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${activeService.token}`,
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify({ message: messageToSend })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.message || `Request failed (${response.status})`);
        }

        if (!response.body) {
            throw new Error('ReadableStream not supported by server response');
        }

        // Initialize streaming reader
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';

        // Add an initial placeholder message for the assistant
        const assistantMsgId = Date.now().toString(); // Temporary ID for finding the message
        setMessages(prev => [...prev, {
            role: 'assistant',
            text: '',
            timestamp: new Date().toISOString(),
            tempId: assistantMsgId
        }]);

        setIsLoading(false);

        // Read the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.type === 'chunk' && data.content) {
                            assistantText += data.content;
                            updateAssistantMessage(assistantMsgId, assistantText);
                        } else if (data.type === 'message') {
                            updateAssistantMessage(assistantMsgId, data.content || assistantText, data.rag_contexts);
                        } else if (data.type === 'error') {
                            throw new Error(data.message);
                        }
                    } catch (e) {
                        console.warn('Error parsing stream chunk:', e, line);
                    }
                }
            }
        }
    };

    const handlePlaylabSend = async (messageToSend) => {
        let currentSessionId = sessionId;

        // 1. Create conversation if not exists
        if (!currentSessionId) {
            const convUrl = `${activeService.apiUrl}/projects/${activeService.applicationId}/conversations`;
            const convResponse = await fetch(convUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${activeService.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
            });

            if (!convResponse.ok) {
                const err = await convResponse.json().catch(() => ({}));
                throw new Error(err.error || `Failed to create conversation (${convResponse.status})`);
            }

            const convData = await convResponse.json();
            currentSessionId = convData.conversation.id;
            setSessionId(currentSessionId);
        }

        // 2. Send message and stream response
        const msgUrl = `${activeService.apiUrl}/projects/${activeService.applicationId}/conversations/${currentSessionId}/messages`;
        const response = await fetch(msgUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${activeService.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input: { message: messageToSend } })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            throw new Error(err.error || `Request failed (${response.status})`);
        }

        if (!response.body) {
            throw new Error('ReadableStream not supported by server response');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = '';
        const assistantMsgId = Date.now().toString();

        setMessages(prev => [...prev, {
            role: 'assistant',
            text: '',
            timestamp: new Date().toISOString(),
            tempId: assistantMsgId
        }]);

        setIsLoading(false);

        // Playlab streams data in SSE format:
        // event: append
        // data: {"delta":"..."}
        let currentEvent = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('event: ')) {
                    currentEvent = line.slice(7).trim();
                } else if (line.startsWith('data: ')) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (currentEvent === 'append' && data.delta) {
                            assistantText += data.delta;
                            updateAssistantMessage(assistantMsgId, assistantText);
                        } else if (currentEvent === 'error') {
                            throw new Error(data.error || 'Playlab generation error');
                        }
                    } catch (e) {
                        // Some lines might not be valid JSON if they contain multiple SSE fields
                        console.warn('Error parsing Playlab chunk:', e, line);
                    }
                }
            }
        }
    };

    const updateAssistantMessage = (tempId, text, rag_contexts = null) => {
        setMessages(prev => {
            const next = [...prev];
            const msgIndex = next.findIndex(m => m.tempId === tempId);
            if (msgIndex !== -1) {
                next[msgIndex] = {
                    ...next[msgIndex],
                    text: text,
                    ...(rag_contexts ? { rag_contexts } : {})
                };
            }
            return next;
        });
    };

    if (!isOpen && !inline) return null;

    const mainContent = (
        <SafeAreaView style={[styles.container, inline && { paddingTop: 0 }]}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        style={styles.titleRow}
                        onPress={() => setShowServiceMenu(!showServiceMenu)}
                        activeOpacity={0.7}
                    >
                        <Bot size={20} color="#3B82F6" />
                        <Text style={styles.title}>AI Assistant</Text>
                        <Settings size={14} color="#6B7280" style={{ marginLeft: 4 }} />
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: activeService?.isAuthenticated ? '#10B981' : '#EF4444' }
                        ]} />
                    </TouchableOpacity>
                    <Text style={styles.subtitle} numberOfLines={1}>
                        {activeService?.provider} • {initialParams?.title || 'Lesson Plan'}
                    </Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        onPress={() => setShowAgentDetails(!showAgentDetails)}
                        style={[styles.agentInfoBtn, showAgentDetails && styles.agentInfoBtnActive]}
                    >
                        <Server size={16} color={showAgentDetails ? '#3B82F6' : '#6B7280'} />
                    </TouchableOpacity>
                    {!inline && (
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={22} color="#4B5563" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* ── Service Selection Menu ── */}
            {showServiceMenu && (
                <View style={[styles.serviceMenu, inline && { top: 50 }]}>
                    <Text style={styles.menuLabel}>Switch AI Provider:</Text>
                    {services.map(s => (
                        <TouchableOpacity
                            key={s.id}
                            style={[
                                styles.menuItem,
                                activeService?.id === s.id && styles.menuItemActive
                            ]}
                            onPress={() => handleServiceSwitch(s)}
                        >
                            <View style={styles.menuItemMain}>
                                <Server size={14} color={activeService?.id === s.id ? '#3B82F6' : '#6B7280'} />
                                <Text style={[
                                    styles.menuItemText,
                                    activeService?.id === s.id && styles.menuItemTextActive
                                ]}>
                                    {s.provider}
                                </Text>
                            </View>
                            <View style={[
                                styles.agentStatusDot,
                                { backgroundColor: s.isAuthenticated ? '#10B981' : '#EF4444' }
                            ]} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* ── Agent Details Banner ── */}
            <AgentDetailsBanner
                service={activeService}
                isOpen={showAgentDetails}
                onToggle={() => setShowAgentDetails(!showAgentDetails)}
            />

            {/* ── Chat Area ── */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={index}
                        msg={msg}
                        onAuthenticateNow={handleAuthenticateNow}
                        isAuthenticating={isAuthenticating}
                        sessionId={sessionId}
                        initialParams={initialParams}
                    />
                ))}
                {isLoading && (
                    <View style={styles.loadingRow}>
                        <View style={styles.avatar}>
                            <Bot size={15} color="#fff" />
                        </View>
                        <View style={styles.typingBubble}>
                            <ActivityIndicator size="small" color="#3B82F6" />
                            <Text style={styles.typingText}>AI is thinking…</Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* ── Input ── */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={[styles.inputArea, inline && { paddingBottom: 20 }]}
            >
                {!defaultService?.isAuthenticated && (
                    <View style={styles.offlineBanner}>
                        <AlertCircle size={14} color="#92400E" />
                        <Text style={styles.offlineBannerText}>
                            Service offline — go to Settings &gt; Services to authenticate
                        </Text>
                    </View>
                )}
                <View style={styles.inputRow}>
                    <TextInput
                        style={[
                            styles.input,
                            !defaultService?.isAuthenticated && styles.inputDisabled
                        ]}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder={
                            defaultService?.isAuthenticated
                                ? 'Ask the AI assistant…'
                                : 'Service connection required'
                        }
                        multiline
                        editable={!!defaultService?.isAuthenticated}
                        placeholderTextColor="#9CA3AF"
                        onSubmitEditing={handleSend}
                    />
                    <TouchableOpacity
                        onPress={handleSend}
                        style={[
                            styles.sendBtn,
                            (!defaultService?.isAuthenticated || !inputText.trim() || isLoading) && styles.sendBtnDisabled
                        ]}
                        disabled={!defaultService?.isAuthenticated || !inputText.trim() || isLoading}
                    >
                        {isLoading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Send size={18} color="#fff" />}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

    if (inline) return mainContent;

    return (
        <Modal visible={isOpen} animationType="slide" transparent={false}>
            {mainContent}
        </Modal>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const markdownStyles = StyleSheet.create({
    body: { color: '#1F2937', fontSize: 15, lineHeight: 22 },
    paragraph: { marginBottom: 8 },
    strong: { fontWeight: '700', color: '#111827' },
    link: { color: '#3B82F6', textDecorationLine: 'underline' },
    list_item: { marginBottom: 4 },
    bullet_list: { marginBottom: 12 },
    ordered_list: { marginBottom: 12 },
    code_inline: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 4,
        borderRadius: 4,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontSize: 13,
    },
    code_block: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    fence: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
});

const userMarkdownStyles = StyleSheet.create({
    body: { color: '#fff', fontSize: 15, lineHeight: 22 },
    paragraph: { marginBottom: 4 },
    strong: { fontWeight: '700', color: '#fff' },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    // ── Header ──
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        zIndex: 50,
    },
    headerLeft: { flex: 1, marginRight: 12 },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 4,
    },
    subtitle: {
        fontSize: 11,
        color: '#6B7280',
        marginTop: 2,
        marginLeft: 28,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    agentInfoBtn: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    agentInfoBtnActive: {
        backgroundColor: '#EFF6FF',
    },
    closeBtn: {
        padding: 4,
    },
    // ── Service Menu ──
    serviceMenu: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 100,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    menuLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    menuItemActive: {
        backgroundColor: '#EFF6FF',
    },
    menuItemMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuItemText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    menuItemTextActive: {
        color: '#3B82F6',
        fontWeight: '600',
    },
    // ── Agent Banner ──
    agentBanner: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    agentBannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    agentBannerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    agentBannerTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
    },
    agentStatusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    agentStatusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    agentDetails: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#F9FAFB',
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6B7280',
        width: 60,
    },
    detailValue: {
        fontSize: 11,
        color: '#374151',
        flex: 1,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    // ── Chat ──
    chatArea: {
        flex: 1,
        width: '100%',
        maxWidth: 1200, // Optional: cap width on very large screens for readability
        alignSelf: 'center',
    },
    chatContent: {
        padding: 16,
        paddingBottom: 8,
        width: '100%',
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 14,
        alignItems: 'flex-end',
        width: '100%',
    },
    userMessage: { flexDirection: 'row-reverse' },
    botMessage: { flexDirection: 'row' },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
        flexShrink: 0,
    },
    userAvatar: { backgroundColor: '#6366F1' },
    messageBubble: {
        maxWidth: Platform.OS === 'web' ? '85%' : '80%',
        padding: 12,
        borderRadius: 18,
    },

    userBubble: {
        backgroundColor: '#3B82F6',
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    errorBubble: {
        borderColor: '#FCA5A5',
        backgroundColor: '#FEF2F2',
    },
    messageText: { fontSize: 15, lineHeight: 22 },
    userText: { color: '#fff' },
    botText: { color: '#1F2937', lineHeight: 22 },
    timestamp: {
        fontSize: 10,
        marginTop: 6,
        textAlign: 'right',
    },
    // ── Loading ──
    loadingRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 14,
    },
    typingBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        padding: 12,
    },
    typingText: {
        fontSize: 13,
        color: '#6B7280',
        fontStyle: 'italic',
    },
    // ── Auth inline ──
    inlineAuthBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FCA5A5',
    },
    inlineAuthBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#B91C1C',
    },
    // ── Input ──
    inputArea: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        paddingHorizontal: 12,
        paddingBottom: Platform.OS === 'ios' ? 4 : 12,
    },
    offlineBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 8,
    },
    offlineBannerText: {
        fontSize: 12,
        color: '#92400E',
        flex: 1,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 10,
        paddingBottom: 4,
    },
    input: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxHeight: 120,
        fontSize: 15,
        color: '#111827',
    },
    inputDisabled: {
        opacity: 0.5,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    sendBtnDisabled: {
        backgroundColor: '#93C5FD',
    },
    // ── Sources ──
    sourcesContainer: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    sourcesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    sourcesHeaderText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    sourceItem: {
        paddingVertical: 1,
    },
    sourceText: {
        fontSize: 11,
        color: '#6B7280',
        fontStyle: 'italic',
    },
});

export default Chatbot;
