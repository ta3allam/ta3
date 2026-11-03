import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Day 2: Classroom, Discussion Filters & Groups Responsive Layout', () => {
  const coursesFilePath = path.resolve(__dirname, '../../../pages/courses/Courses.tsx');
  const discussionsFilePath = path.resolve(__dirname, '../../courses/CourseDiscussions.tsx');
  const groupsFilePath = path.resolve(__dirname, '../../../pages/courses/Groups.tsx');
  const discussionPageFilePath = path.resolve(__dirname, '../../../pages/courses/Discussion.tsx');
  const timelinePageFilePath = path.resolve(__dirname, '../../../pages/courses/Timeline.tsx');
  const cssFilePath = path.resolve(__dirname, '../../../index.css');

  describe('1. Global Styling & Scrollbar Optimization', () => {
    it('should define a .no-scrollbar utility in index.css for clean mobile scrolling', () => {
      const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
      expect(cssContent).toContain('.no-scrollbar');
      expect(cssContent).toContain('scrollbar-width: none');
    });
  });

  describe('2. Course Classroom Navigation Tabs', () => {
    it('should include smooth horizontal scrolling and hidden scrollbars on mobile tabs', () => {
      const content = fs.readFileSync(coursesFilePath, 'utf-8');
      expect(content).toContain('overflow-x-auto no-scrollbar scroll-smooth');
    });

    it('should provide responsive mobile edge scroll fade mask indicators', () => {
      const content = fs.readFileSync(coursesFilePath, 'utf-8');
      expect(content).toContain('bg-gradient-to-r from-[#EDEBE0] to-transparent');
      expect(content).toContain('bg-gradient-to-l from-[#EDEBE0] to-transparent');
      expect(content).toContain('lg:hidden');
    });
  });

  describe('3. Course Discussion Filters & Typo Fix', () => {
    it('should prevent filter pills overflow with horizontal scrolling and whitespace-nowrap', () => {
      const content = fs.readFileSync(discussionsFilePath, 'utf-8');
      expect(content).toContain('overflow-x-auto no-scrollbar max-w-full');
      expect(content).toContain('shrink-0 whitespace-nowrap');
    });

    it('should fix typo in discussion search placeholder from والمواقشات to والمناقشات', () => {
      const content = fs.readFileSync(discussionsFilePath, 'utf-8');
      expect(content).toContain('البحث في الأسئلة والمناقشات...');
      expect(content).not.toContain('والمواقشات');
    });
  });

  describe('4. Study Groups Mobile Responsive Layout', () => {
    it('should render both desktop table (hidden md:block) and mobile cards (block md:hidden)', () => {
      const content = fs.readFileSync(groupsFilePath, 'utf-8');
      expect(content).toContain('hidden md:block');
      expect(content).toContain('block md:hidden');
    });

    it('should ensure group mobile cards contain chat access and member badges', () => {
      const content = fs.readFileSync(groupsFilePath, 'utf-8');
      expect(content).toContain('الدردشة (');
      expect(content).toContain('الأعضاء:');
    });
  });

  describe('5. RTL Breadcrumb Navigation Flow', () => {
    it('should use leftward arrow (ArrowLeft) for RTL breadcrumb in Groups.tsx', () => {
      const content = fs.readFileSync(groupsFilePath, 'utf-8');
      expect(content).toContain('<ArrowLeft className="h-3 w-3 text-[#428177]" />');
      expect(content).not.toContain('<ArrowRight className="h-3 w-3" />');
    });

    it('should use leftward arrow (ArrowLeft) for RTL breadcrumb in Discussion.tsx and Timeline.tsx', () => {
      const discussionContent = fs.readFileSync(discussionPageFilePath, 'utf-8');
      expect(discussionContent).toContain('ArrowLeft');
      
      const timelineContent = fs.readFileSync(timelinePageFilePath, 'utf-8');
      expect(timelineContent).toContain('ArrowLeft');
    });
  });

  describe('6. Safe Bottom Padding for Mobile Nav Ergonomics', () => {
    it('should enforce pb-28 md:pb-8 on course subpages to clear the mobile bottom nav', () => {
      const coursesContent = fs.readFileSync(coursesFilePath, 'utf-8');
      const groupsContent = fs.readFileSync(groupsFilePath, 'utf-8');
      const discussionContent = fs.readFileSync(discussionPageFilePath, 'utf-8');
      const timelineContent = fs.readFileSync(timelinePageFilePath, 'utf-8');

      expect(coursesContent).toContain('pb-28 md:pb-8');
      expect(groupsContent).toContain('pb-28 md:pb-8');
      expect(discussionContent).toContain('pb-28 md:pb-8');
      expect(timelineContent).toContain('pb-28 md:pb-8');
    });
  });
});
