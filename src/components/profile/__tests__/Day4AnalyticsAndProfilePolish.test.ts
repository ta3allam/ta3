import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Day 4: Creator Analytics & Profile Form RTL Alignments', () => {
  const analyticsFilePath = path.resolve(__dirname, '../../../pages/analytics/CreatorAnalytics.tsx');
  const profilePageFilePath = path.resolve(__dirname, '../../../pages/profile/UserProfilePage.tsx');
  const profileModalFilePath = path.resolve(__dirname, '../UserProfileModal.tsx');

  describe('1. Creator Analytics Filter Controls & Bottom Clearance', () => {
    it('should configure timeRange select with min-width and shrink-0 to prevent label truncation', () => {
      const content = fs.readFileSync(analyticsFilePath, 'utf-8');
      expect(content).toContain('min-w-[130px] shrink-0');
      expect(content).not.toContain('font-bold w-32');
    });

    it('should provide safe bottom padding on CreatorAnalytics to prevent mobile navbar clipping', () => {
      const content = fs.readFileSync(analyticsFilePath, 'utf-8');
      expect(content).toContain('pb-28 md:pb-8');
    });
  });

  describe('2. User Profile Form Alignment & Monospace International Inputs', () => {
    it('should style email input with dir=ltr, text-left, and pl-10 to avoid icon overlap', () => {
      const content = fs.readFileSync(profilePageFilePath, 'utf-8');
      expect(content).toContain('dir="ltr"');
      expect(content).toContain('pl-10 text-left font-mono');
    });

    it('should style phone input with dir=ltr, text-left font-mono, and pl-10 for international formatting', () => {
      const content = fs.readFileSync(profilePageFilePath, 'utf-8');
      expect(content).toContain('placeholder="+963 9xx xxx xxx"');
      expect(content).toContain('pl-10 text-left font-mono');
    });

    it('should enforce dir=rtl on bio textarea for natural Arabic sentence and punctuation flow', () => {
      const content = fs.readFileSync(profilePageFilePath, 'utf-8');
      expect(content).toContain('dir="rtl"');
      expect(content).toContain('text-right');
    });

    it('should provide safe bottom padding on UserProfilePage to clear mobile bottom navigation', () => {
      const content = fs.readFileSync(profilePageFilePath, 'utf-8');
      expect(content).toContain('pb-28 md:pb-8');
    });
  });

  describe('3. User Profile Modal Consistency Parity', () => {
    it('should match phone, email, and bio RTL rules in UserProfileModal', () => {
      const content = fs.readFileSync(profileModalFilePath, 'utf-8');
      expect(content).toContain('pl-10 text-left font-mono');
      expect(content).toContain('dir="ltr"');
      expect(content).toContain('dir="rtl"');
    });
  });
});
