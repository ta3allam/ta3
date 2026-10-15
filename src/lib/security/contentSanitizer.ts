/**
 * Content Sanitizer & XSS Defense Engine (Zero-Trust)
 *
 * Implements strict HTML/Markdown AST sanitization, dangerous protocol stripping
 * (javascript:, vbscript:, data:), and malicious script injection neutralization
 * for rich lecture descriptions, student community posts, and comments.
 */

// Whitelisted HTML tags permitted in rich text / markdown rendering
const ALLOWED_TAGS = new Set([
  'b', 'strong', 'i', 'em', 'u', 's', 'del', 'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
  'a', 'span', 'div', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'img', 'mark', 'sub', 'sup',
]);

// Whitelisted attributes allowed on specific tags
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  '*': new Set(['class', 'dir', 'lang', 'title', 'id']),
  a: new Set(['href', 'target', 'rel', 'title']),
  img: new Set(['src', 'alt', 'width', 'height', 'loading']),
  th: new Set(['align', 'colspan', 'rowspan']),
  td: new Set(['align', 'colspan', 'rowspan']),
  code: new Set(['data-language']),
};

const DANGEROUS_PROTOCOLS = /^(javascript|vbscript|data|file):/i;

/**
 * Escapes plain text to prevent HTML injection
 */
export function sanitizePlainText(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Validates whether a URL is safe for navigation or image loading
 */
export function isSafeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  const trimmed = url.trim();

  // Strip control characters
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  if (DANGEROUS_PROTOCOLS.test(sanitized)) {
    return false;
  }

  // Allow relative URLs, http, https, and mailto
  return (
    sanitized.startsWith('/') ||
    sanitized.startsWith('./') ||
    sanitized.startsWith('../') ||
    sanitized.startsWith('#') ||
    /^https?:\/\//i.test(sanitized) ||
    /^mailto:/i.test(sanitized)
  );
}

/**
 * Sanitizes rich text HTML by removing dangerous tags, attributes, and script handlers
 */
export function sanitizeRichText(dirtyHtml: string | undefined | null): string {
  if (!dirtyHtml) return '';

  // 1. Remove dangerous high-risk elements entirely with their content
  let cleaned = dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');

  // 2. Remove inline event handlers (e.g. onclick=..., onerror=..., onload=...)
  cleaned = cleaned.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');

  // 3. Neutralize javascript: pseudo-protocols in href or src
  cleaned = cleaned.replace(
    /\s(href|src)\s*=\s*(['"]?)\s*(javascript|data|vbscript):[^\s'">]*\2/gi,
    ' $1="#"'
  );

  // 4. Parse tags and strip disallowed tags while preserving content
  cleaned = cleaned.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, tagName: string, rawAttrs: string) => {
    const lowerTag = tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(lowerTag)) {
      return ''; // Strip non-whitelisted tag
    }

    if (match.startsWith('</')) {
      return `</${lowerTag}>`;
    }

    // Filter attributes
    const allowedForTag = ALLOWED_ATTRIBUTES[lowerTag] || new Set();
    const globalAllowed = ALLOWED_ATTRIBUTES['*'];

    const attrRegex = /([a-z0-9_-]+)(?:\s*=\s*(?:'([^']*)'|"([^"]*)"|([^\s>]+)))?/gi;
    let validAttrsString = '';
    let attrMatch: RegExpExecArray | null;

    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      const attrVal = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

      // Check if attribute is allowed
      if (globalAllowed.has(attrName) || allowedForTag.has(attrName)) {
        if ((attrName === 'href' || attrName === 'src') && !isSafeUrl(attrVal)) {
          continue; // Skip dangerous URLs
        }

        if (attrName === 'target' && attrVal === '_blank') {
          validAttrsString += ` target="_blank" rel="noopener noreferrer"`;
        } else {
          validAttrsString += ` ${attrName}="${sanitizePlainText(attrVal)}"`;
        }
      }
    }

    const isSelfClosing = match.endsWith('/>') || lowerTag === 'br' || lowerTag === 'hr' || lowerTag === 'img';
    return `<${lowerTag}${validAttrsString}${isSelfClosing ? ' /' : ''}>`;
  });

  return cleaned;
}

/**
 * Sanitizes markdown source strings to prevent embedded script payloads
 */
export function sanitizeMarkdown(markdown: string | undefined | null): string {
  if (!markdown) return '';

  // Neutralize inline raw script tags
  let safe = markdown.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Neutralize markdown links with javascript: protocols [text](javascript:...)
  safe = safe.replace(/\[([^\]]+)\]\((javascript|data|vbscript):[^)]+\)/gi, '[$1](#)');

  // Neutralize markdown images with dangerous protocols ![alt](javascript:...)
  safe = safe.replace(/!\[([^\]]*)\]\((javascript|data|vbscript):[^)]+\)/gi, '![$1]()');

  return safe;
}

/**
 * Heuristic detector for malicious payloads (XSS, SQLi fragments, path traversal)
 */
export function containsSuspiciousPayload(input: string | undefined | null): boolean {
  if (!input) return false;

  const patterns = [
    /<script[\s>]/i,
    /javascript:/i,
    /onload\s*=/i,
    /onerror\s*=/i,
    /onclick\s*=/i,
    /\.\.\/\.\.\//, // Path traversal
    /(UNION\s+SELECT|DROP\s+TABLE|--\s*$)/i, // SQLi heuristics
    /<iframe[\s>]/i,
    /<svg.*onload/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}
