import { describe, it, expect } from 'vitest';

describe('MaterialViewerModal Security & URL Sanitization', () => {
  function sanitizeUrl(url?: string): string {
    if (!url) return '#';
    const trimmed = url.trim().toLowerCase();
    if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
      return '#';
    }
    return url;
  }

  it('should allow valid http and https URLs', () => {
    expect(sanitizeUrl('https://ta3.edu/materials/lecture1.pdf')).toBe('https://ta3.edu/materials/lecture1.pdf');
    expect(sanitizeUrl('http://ta3.edu/video.mp4')).toBe('http://ta3.edu/video.mp4');
  });

  it('should block malicious javascript: protocol URLs', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('  JAVASCRIPT:void(0) ')).toBe('#');
  });

  it('should block data: URI scheme payloads', () => {
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
  });
});
