/**
 * Rich Content Detection Utility
 * Parses AI response text and identifies embeddable content (HTML, PDF, images)
 */

/**
 * Detects rich content blocks within a text string.
 * @param {string} content - Raw text content from AI response
 * @returns {Array<{type: string, content: string, src?: string}>}
 */
export const detectRichContent = (content) => {
    const blocks = [];

    // Regex for HTML code blocks: ```html ... ```
    const htmlRegex = /```html\n([\s\S]*?)```/g;

    // Regex for Markdown code blocks: ```markdown ... ```
    const mdBlockRegex = /```markdown\n([\s\S]*?)```/g;

    // Regex for generic code blocks: ``` ... ``` (if not already matched)
    const genericCodeRegex = /```\n?([\s\S]*?)```/g;

    // Regex for image URLs
    const imgRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^\s]*)?)/gi;

    // Regex for PDF URLs
    const pdfRegex = /(https?:\/\/[^\s]+?\.pdf(?:\?[^\s]*)?)/gi;

    // Regex for markdown images ![alt](url)
    const mdImgRegex = /!\[.*?\]\((https?:\/\/.*?)\)/g;

    let lastIndex = 0;
    const matches = [];

    // Find all HTML blocks
    let match;
    while ((match = htmlRegex.exec(content)) !== null) {
        matches.push({
            index: match.index,
            length: match[0].length,
            block: { type: 'html', content: match[1].trim() }
        });
    }

    // Find all Markdown blocks
    while ((match = mdBlockRegex.exec(content)) !== null) {
        if (!matches.some(m => match.index >= m.index && match.index < m.index + m.length)) {
            matches.push({
                index: match.index,
                length: match[0].length,
                block: { type: 'markdown', content: match[1].trim() }
            });
        }
    }

    // Find all Generic Code blocks
    while ((match = genericCodeRegex.exec(content)) !== null) {
        if (!matches.some(m => match.index >= m.index && match.index < m.index + m.length)) {
            matches.push({
                index: match.index,
                length: match[0].length,
                block: { type: 'markdown', content: match[1].trim() } // Treat generic as markdown
            });
        }
    }


    // Find all Markdown images
    while ((match = mdImgRegex.exec(content)) !== null) {
        matches.push({
            index: match.index,
            length: match[0].length,
            block: { type: 'image', content: '', src: match[1] }
        });
    }

    // Find PDF URLs
    while ((match = pdfRegex.exec(content)) !== null) {
        if (!matches.some(m => match.index >= m.index && match.index < m.index + m.length)) {
            matches.push({
                index: match.index,
                length: match[0].length,
                block: { type: 'pdf', content: '', src: match[0], extension: 'pdf' }
            });
        }
    }

    // Find Image URLs (standalone)
    while ((match = imgRegex.exec(content)) !== null) {
        if (!matches.some(m => match.index >= m.index && match.index < m.index + m.length)) {
            matches.push({
                index: match.index,
                length: match[0].length,
                block: { type: 'image', content: '', src: match[0] }
            });
        }
    }

    // Sort by index
    matches.sort((a, b) => a.index - b.index);

    // Reconstruct with plain text in between
    matches.forEach(m => {
        if (m.index > lastIndex) {
            blocks.push({
                type: 'text',
                content: content.substring(lastIndex, m.index)
            });
        }
        blocks.push(m.block);
        lastIndex = m.index + m.length;
    });

    if (lastIndex < content.length) {
        blocks.push({
            type: 'text',
            content: content.substring(lastIndex)
        });
    }

    return blocks.length > 0 ? blocks : [{ type: 'text', content }];
};
