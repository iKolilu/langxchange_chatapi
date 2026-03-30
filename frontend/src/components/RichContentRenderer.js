import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Linking,
    Platform,
    Modal,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { FileText, Globe, Image as ImageIcon, Share2, ChevronDown, ChevronUp, ExternalLink, Download, X, File, Code } from 'lucide-react-native';
import { marked } from 'marked';

/**
 * Wraps raw HTML content with a styled document structure.
 */
const wrapHtml = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: #ffffff;
            color: #111827;
            line-height: 1.7;
            margin: 0;
            padding: 20px;
            font-size: 15px;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #3B82F6;
            margin-top: 1.4em;
            margin-bottom: 0.4em;
            font-weight: 700;
        }
        p { margin-bottom: 1em; }
        pre, code {
            background-color: #F3F4F6;
            border: 1px solid #E5E7EB;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.88em;
        }
        pre { padding: 15px; overflow-x: auto; white-space: pre-wrap; }
        img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #E5E7EB; }
        th { background-color: #EFF6FF; font-weight: 600; color: #3B82F6; }
        tr:hover { background-color: #F9FAFB; }
        a { color: #3B82F6; text-decoration: none; }
        ul, ol { padding-left: 20px; margin-bottom: 1em; }
        li { margin-bottom: 0.4em; }
        blockquote {
            border-left: 4px solid #3B82F6;
            padding-left: 16px;
            margin: 16px 0;
            color: #6B7280;
            font-style: italic;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`;

/**
 * Export/share HTML content. On web: triggers download. On native: uses Web Share API or opens link.
 */
const exportContent = async (block, format, setIsExporting, setShowExportMenu) => {
    setIsExporting(true);
    setShowExportMenu(false);
    try {
        if (block.type === 'pdf') {
            if (format === 'pdf') {
                Linking.openURL(block.src);
            } else {
                alert(`Direct conversion of PDF to ${format.toUpperCase()} is not supported. Please open the PDF to save it manually.`);
            }
            return;
        }

        let contentToExport = block.content;
        if (block.type === 'markdown') {
            contentToExport = marked.parse(block.content);
        }

        if (Platform.OS === 'web') {
            if (format === 'pdf') {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                    printWindow.document.write(wrapHtml(contentToExport));
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 500);
                }
            } else {
                let blob, ext, mimeType;
                if (format === 'txt') {
                    const text = contentToExport.replace(/<[^>]*>?/gm, '');
                    blob = new Blob([text], { type: 'text/plain' });
                    ext = 'txt'; mimeType = 'text/plain';
                } else {
                    blob = new Blob([wrapHtml(contentToExport)], { type: 'application/msword' });
                    ext = 'doc'; mimeType = 'application/msword';
                }
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `ai_content_${Date.now()}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } else {
            alert(`Export as ${format.toUpperCase()} is available on web. On mobile, use the Share button.`);
        }
    } catch (err) {
        console.error(`Export error (${format}):`, err);
        alert(`Failed to export as ${format.toUpperCase()}`);
    } finally {
        setIsExporting(false);
    }
};



const RichContentRenderer = ({ block, headerTitle, isSilent = false }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleShare = () => {
        if (block.type === 'html' || block.type === 'markdown' || block.type === 'pdf') {
            setShowExportMenu(true);
        } else if (block.src) {
            Linking.openURL(block.src);
        }
    };



    const renderHeader = (IconComponent, label, color) => (
        <View style={[styles.header, { borderBottomColor: '#E5E7EB', backgroundColor: color + '18' }]}>
            <View style={styles.headerLeft}>
                <IconComponent size={14} color={color} />
                <Text style={[styles.headerLabel, { color }]}>{label}</Text>
            </View>
            <View style={styles.headerRight}>
                {isExporting ? (
                    <ActivityIndicator size="small" color="#3B82F6" style={{ marginRight: 8 }} />
                ) : (
                    <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
                        <Share2 size={16} color="#6B7280" />
                    </TouchableOpacity>
                )}
                {block.type === 'html' && (
                    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)} style={styles.iconBtn}>
                        {isExpanded ? <ChevronUp size={16} color="#6B7280" /> : <ChevronDown size={16} color="#6B7280" />}
                    </TouchableOpacity>
                )}
                {block.src && (
                    <TouchableOpacity onPress={() => Linking.openURL(block.src)} style={styles.iconBtn}>
                        <ExternalLink size={16} color="#6B7280" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, isSilent && styles.silentContainer]}>
            {!isSilent && block.type === 'html' && renderHeader(Globe, headerTitle || 'Lesson Plan Review', '#3B82F6')}
            {!isSilent && block.type === 'markdown' && renderHeader(Code, headerTitle || 'Generated Content', '#10B981')}
            {!isSilent && block.type === 'pdf' && renderHeader(FileText, 'PDF Document', '#EF4444')}
            {!isSilent && block.type === 'image' && renderHeader(ImageIcon, 'Image', '#10B981')}

            {/* Markdown Content */}
            {block.type === 'markdown' && isExpanded && (
                <View style={styles.markdownContainer}>
                    {Platform.OS === 'web' ? (
                        <div
                            dangerouslySetInnerHTML={{ __html: marked.parse(block.content) }}
                            style={{ padding: 16, fontSize: '15px', color: '#1F2937', lineHeight: '1.6' }}
                        />
                    ) : (
                        <Text style={styles.nativeHtmlNote}>{block.content}</Text>
                    )}
                </View>
            )}

            {/* HTML Content */}
            {block.type === 'html' && isExpanded && (
                <View style={[styles.iframeContainer, isSilent && styles.silentIframeContainer]}>
                    {Platform.OS === 'web' ? (
                        <iframe
                            srcDoc={wrapHtml(block.content)}
                            style={{
                                width: '100%',
                                height: isSilent ? 'auto' : '400px',
                                minHeight: isSilent ? '40px' : '400px',
                                border: 'none',
                                backgroundColor: isSilent ? 'transparent' : '#FFFFFF',
                            }}
                            onLoad={(e) => {
                                if (isSilent) {
                                    const iframe = e.target;
                                    try {
                                        const height = iframe.contentWindow.document.body.scrollHeight;
                                        iframe.style.height = height + 'px';
                                        iframe.parentElement.style.height = height + 'px';
                                    } catch (err) {
                                        // Ignore cross-origin etc if it happens (though srcDoc should be fine)
                                    }
                                }
                            }}
                            title={headerTitle || "Content"}
                        />
                    ) : (
                        <Text style={styles.nativeHtmlNote}>
                            {isSilent ? block.content.replace(/<[^>]*>?/gm, ' ').trim() : `Content: ${block.content.replace(/<[^>]*>?/gm, ' ').trim().substring(0, 300)}...`}
                        </Text>
                    )}
                </View>
            )}

            {/* PDF Content */}
            {block.type === 'pdf' && (
                <TouchableOpacity style={styles.pdfContainer} onPress={() => Linking.openURL(block.src)}>
                    <File size={40} color="#EF4444" />
                    <Text style={styles.pdfTitle}>Open PDF Document</Text>
                    <Text style={styles.pdfSubtitle}>Tap to view in browser</Text>
                </TouchableOpacity>
            )}

            {/* Image Content */}
            {block.type === 'image' && (
                <TouchableOpacity onPress={() => Linking.openURL(block.src)}>
                    <Image
                        source={{ uri: block.src }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}

            {/* Export Menu Modal */}
            <Modal
                visible={showExportMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowExportMenu(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowExportMenu(false)}
                >
                    <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.menuTitle}>Export / Download</Text>
                            <TouchableOpacity onPress={() => setShowExportMenu(false)}>
                                <X size={22} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => exportContent(block, 'pdf', setIsExporting, setShowExportMenu)}
                        >
                            <View style={[styles.menuItemIcon, { backgroundColor: '#FEE2E2' }]}>
                                <FileText size={20} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.menuItemTitle}>PDF Document</Text>
                                <Text style={styles.menuItemSubtitle}>Open print dialog to save as PDF</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => exportContent(block, 'txt', setIsExporting, setShowExportMenu)}
                        >
                            <View style={[styles.menuItemIcon, { backgroundColor: '#DBEAFE' }]}>
                                <Download size={20} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={styles.menuItemTitle}>Plain Text (.txt)</Text>
                                <Text style={styles.menuItemSubtitle}>Download as plain text file</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => exportContent(block, 'doc', setIsExporting, setShowExportMenu)}
                        >
                            <View style={[styles.menuItemIcon, { backgroundColor: '#DBEAFE' }]}>
                                <File size={20} color="#2B579A" />
                            </View>
                            <View>
                                <Text style={styles.menuItemTitle}>Word Document (.doc)</Text>
                                <Text style={styles.menuItemSubtitle}>Download as Word document</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setShowExportMenu(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    silentContainer: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        marginVertical: 0,
        borderRadius: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerLabel: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        padding: 4,
        marginLeft: 4,
    },
    iframeContainer: {
        width: '100%',
        height: 400,
    },
    silentIframeContainer: {
        height: 'auto',
    },
    nativeHtmlNote: {
        padding: 16,
        fontSize: 13,
        color: '#374151',
        lineHeight: 20,
    },
    markdownContainer: {
        width: '100%',
        backgroundColor: '#fff',
    },

    pdfContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
    },
    pdfTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginTop: 10,
    },
    pdfSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    image: {
        width: '100%',
        height: 220,
        backgroundColor: '#F3F4F6',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    menuContainer: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        gap: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F3F4F6',
    },
    menuItemIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    menuItemSubtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 2,
    },
    cancelBtn: {
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '600',
    },
});

export default RichContentRenderer;
