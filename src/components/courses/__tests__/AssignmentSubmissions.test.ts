import { describe, it, expect } from 'vitest';

describe('AssignmentSubmissions File Validation & Standard Digits', () => {
  function validateFileExtension(filename: string): boolean {
    const ext = filename.split('.').pop()?.toLowerCase();
    return ext === 'pdf' || ext === 'zip';
  }

  function validateFileSize(bytes: number, maxSizeMb: number = 25): boolean {
    return bytes <= maxSizeMb * 1024 * 1024;
  }

  function formatStandardDigitsDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  it('should strictly allow PDF and ZIP file extensions', () => {
    expect(validateFileExtension('homework.pdf')).toBe(true);
    expect(validateFileExtension('project.zip')).toBe(true);
    expect(validateFileExtension('solution.PDF')).toBe(true);
    expect(validateFileExtension('archive.ZIP')).toBe(true);
  });

  it('should reject non-PDF/ZIP file extensions (docx, txt, exe, js)', () => {
    expect(validateFileExtension('essay.docx')).toBe(false);
    expect(validateFileExtension('notes.txt')).toBe(false);
    expect(validateFileExtension('script.exe')).toBe(false);
    expect(validateFileExtension('payload.js')).toBe(false);
  });

  it('should enforce 25MB file size limit', () => {
    expect(validateFileSize(10 * 1024 * 1024)).toBe(true);
    expect(validateFileSize(25 * 1024 * 1024)).toBe(true);
    expect(validateFileSize(26 * 1024 * 1024)).toBe(false);
  });

  it('should format dates using standard Western/Arabic digits', () => {
    const formatted = formatStandardDigitsDate('2026-08-05T12:00:00.000Z');
    expect(formatted).toMatch(/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/);
    expect(formatted).toBe('2026/08/05');
  });
});
