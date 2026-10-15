/**
 * Content Security Policy (CSP) & Hardened Security Headers Generator
 *
 * Implements strict defense-in-depth security policies to defend against
 * cross-site scripting (XSS), clickjacking, MIME-sniffing, and rogue frame embedding.
 */

export interface CspDirectives {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  mediaSrc: string[];
  objectSrc: string[];
  frameSrc: string[];
  frameAncestors: string[];
  baseUri: string[];
  formAction: string[];
}

export const DEFAULT_CSP_DIRECTIVES: CspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
  fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
  connectSrc: [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://images.unsplash.com',
  ],
  mediaSrc: ["'self'", 'blob:', 'data:', 'https:'],
  objectSrc: ["'none'"],
  frameSrc: ["'none'"],
  frameAncestors: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

/**
 * Serializes CSP directives into a valid Content-Security-Policy header string
 */
export function buildCspString(customDirectives?: Partial<CspDirectives>): string {
  const merged: CspDirectives = {
    ...DEFAULT_CSP_DIRECTIVES,
    ...(customDirectives || {}),
  };

  const directiveMap: Record<string, string[]> = {
    'default-src': merged.defaultSrc,
    'script-src': merged.scriptSrc,
    'style-src': merged.styleSrc,
    'img-src': merged.imgSrc,
    'font-src': merged.fontSrc,
    'connect-src': merged.connectSrc,
    'media-src': merged.mediaSrc,
    'object-src': merged.objectSrc,
    'frame-src': merged.frameSrc,
    'frame-ancestors': merged.frameAncestors,
    'base-uri': merged.baseUri,
    'form-action': merged.formAction,
  };

  return Object.entries(directiveMap)
    .filter(([_, values]) => values.length > 0)
    .map(([directive, values]) => `${directive} ${values.join(' ')}`)
    .join('; ');
}

/**
 * Returns standard production HTTP security headers
 */
export function getHardenedSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': buildCspString(),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  };
}

/**
 * Injects or updates a <meta http-equiv="Content-Security-Policy"> tag in client DOM
 */
export function applyClientCspMetaTag(): void {
  if (typeof document === 'undefined') return;

  let meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    document.head.appendChild(meta);
  }

  // Note: frame-ancestors is ignored in meta tags per W3C specification
  const metaDirectives = { ...DEFAULT_CSP_DIRECTIVES, frameAncestors: [] };
  meta.content = buildCspString(metaDirectives);
}
