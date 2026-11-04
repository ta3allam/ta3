import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Day 3: Marketplace & Community Polish', () => {
  const marketplaceFilePath = path.resolve(__dirname, '../../../pages/marketplace/Marketplace.tsx');
  const communityFeedFilePath = path.resolve(__dirname, '../../../pages/community/CommunityFeed.tsx');
  const postCardFilePath = path.resolve(__dirname, '../../community/CommunityPostCard.tsx');

  describe('1. Marketplace Tab Switcher & Mobile Responsiveness', () => {
    it('should use responsive flex-col sm:flex-row on master tabs to eliminate horizontal squishing', () => {
      const content = fs.readFileSync(marketplaceFilePath, 'utf-8');
      expect(content).toContain('flex flex-col sm:flex-row gap-1 h-auto');
      expect(content).not.toContain('grid grid-cols-2 gap-1');
    });

    it('should hide native scrollbars on category and provider filter chip rows', () => {
      const content = fs.readFileSync(marketplaceFilePath, 'utf-8');
      expect(content).toContain('overflow-x-auto no-scrollbar scroll-smooth py-2 border-t border-[#EDEBE0]');
    });

    it('should provide safe bottom padding on Marketplace to prevent mobile navbar clipping', () => {
      const content = fs.readFileSync(marketplaceFilePath, 'utf-8');
      expect(content).toContain('pb-28 md:pb-8');
    });
  });

  describe('2. Community Feed Copy Sanitization & Ergonomics', () => {
    it('should not contain third-party platform labels (Skool)', () => {
      const content = fs.readFileSync(communityFeedFilePath, 'utf-8');
      expect(content).not.toContain('Skool');
      expect(content).toContain('نموذج مجتمعات التعلّم التفاعلية');
    });

    it('should replace gamification XP references with authentic platform interaction points', () => {
      const content = fs.readFileSync(communityFeedFilePath, 'utf-8');
      expect(content).not.toContain('نقاط خبرة (XP)');
      expect(content).toContain('شارات التفاعل المعرفي');
      expect(content).toContain('نقطة');
    });

    it('should provide safe bottom padding on CommunityFeed to prevent mobile navbar clipping', () => {
      const content = fs.readFileSync(communityFeedFilePath, 'utf-8');
      expect(content).toContain('pb-28 md:pb-8');
    });
  });

  describe('3. Community Post Card Badges Layout & Token Hygiene', () => {
    it('should wrap post header badges with flex-wrap to prevent mobile badge collision', () => {
      const content = fs.readFileSync(postCardFilePath, 'utf-8');
      expect(content).toContain('flex flex-wrap justify-between items-center gap-2 text-xs');
      expect(content).toContain('flex flex-wrap items-center gap-1.5');
    });

    it('should use valid hex color token #6B1F2A instead of broken color literals', () => {
      const content = fs.readFileSync(postCardFilePath, 'utf-8');
      expect(content).toContain('text-[#6B1F2A]');
      expect(content).not.toContain('text-[#Damask Red]');
    });
  });
});
