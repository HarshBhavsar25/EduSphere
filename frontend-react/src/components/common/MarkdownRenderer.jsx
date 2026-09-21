import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked with GitHub Flavored Markdown and breaks
marked.setOptions({
  breaks: true,
  gfm: true,
});

export default function MarkdownRenderer({ content, className = '' }) {
  const renderedHtml = useMemo(() => {
    if (!content) return '';
    try {
      // Replace raw <br> tags with newline for proper markdown flow
      const normalized = content.replace(/<br\s*\/?>/gi, '\n');
      const rawHtml = marked.parse(normalized);
      return DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ['table', 'thead', 'tbody', 'tr', 'th', 'td', 'span', 'code', 'pre', 'hr', 'blockquote'],
      });
    } catch (err) {
      console.error('Markdown parsing error:', err);
      return content;
    }
  }, [content]);

  return (
    <div
      className={`markdown-body ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}
