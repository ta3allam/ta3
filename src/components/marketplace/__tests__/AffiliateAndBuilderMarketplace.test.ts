import { describe, it, expect, vi } from 'vitest';
import { AFFILIATE_COURSES, AffiliateCourse } from '@/data/affiliateCourses';

describe('Day 3 Milestone: Marketplace Affiliate Hub & Creator Studio', () => {
  it('should have a rich, valid curated affiliate dataset with required fields', () => {
    expect(AFFILIATE_COURSES.length).toBeGreaterThanOrEqual(8);

    AFFILIATE_COURSES.forEach((course: AffiliateCourse) => {
      expect(course.id).toBeDefined();
      expect(course.title.length).toBeGreaterThan(5);
      expect(course.originalTitle.length).toBeGreaterThan(5);
      expect(['Coursera', 'Udemy', 'edX', 'DeepLearning.AI', 'CS50', 'Frontend Masters']).toContain(course.provider);
      expect(course.affiliateUrl).toMatch(/^https?:\/\//);
      expect(course.rating).toBeGreaterThanOrEqual(4.0);
      expect(course.keySkills.length).toBeGreaterThan(0);
      expect(typeof course.hasArabicSubtitles).toBe('boolean');
    });
  });

  it('should include high-value courses with exclusive discount coupons', () => {
    const discountedCourses = AFFILIATE_COURSES.filter(c => c.couponCode && c.discountPercentage);
    expect(discountedCourses.length).toBeGreaterThanOrEqual(4);

    const udemyCourse = AFFILIATE_COURSES.find(c => c.id === 'aff-udemy-angela-bootcamp');
    expect(udemyCourse).toBeDefined();
    expect(udemyCourse?.couponCode).toBe('TA3ALLAM_MEGA');
    expect(udemyCourse?.discountPercentage).toBe(85);
    expect(udemyCourse?.discountedPriceUSD).toBe(12.99);
  });

  it('should support free tracks such as Harvard CS50x with valid credentials', () => {
    const cs50 = AFFILIATE_COURSES.find(c => c.id === 'aff-cs50-x');
    expect(cs50).toBeDefined();
    expect(cs50?.isFree).toBe(true);
    expect(cs50?.certificateIncluded).toBe(true);
    expect(cs50?.hasArabicSubtitles).toBe(true);
  });

  it('should filter courses by provider accurately', () => {
    const courseraCourses = AFFILIATE_COURSES.filter(c => c.provider === 'Coursera');
    expect(courseraCourses.length).toBeGreaterThanOrEqual(2);
    expect(courseraCourses.every(c => c.provider === 'Coursera')).toBe(true);

    const udemyCourses = AFFILIATE_COURSES.filter(c => c.provider === 'Udemy');
    expect(udemyCourses.length).toBeGreaterThanOrEqual(3);
    expect(udemyCourses.every(c => c.provider === 'Udemy')).toBe(true);
  });

  it('should filter courses by Arabic subtitle availability', () => {
    const arabicSubtitled = AFFILIATE_COURSES.filter(c => c.hasArabicSubtitles);
    expect(arabicSubtitled.length).toBeGreaterThanOrEqual(6);
    expect(arabicSubtitled.every(c => c.hasArabicSubtitles)).toBe(true);
  });

  it('should filter courses by category track', () => {
    const aiCourses = AFFILIATE_COURSES.filter(c => c.category === 'ai');
    expect(aiCourses.length).toBeGreaterThanOrEqual(2);
    expect(aiCourses.some(c => c.id === 'aff-dl-specialization')).toBe(true);

    const webCourses = AFFILIATE_COURSES.filter(c => c.category === 'web');
    expect(webCourses.length).toBeGreaterThanOrEqual(3);
  });

  it('should perform multi-keyword search across titles, instructors, and skills', () => {
    const searchParam = 'React';
    const matches = AFFILIATE_COURSES.filter(c =>
      c.title.toLowerCase().includes(searchParam.toLowerCase()) ||
      c.originalTitle.toLowerCase().includes(searchParam.toLowerCase()) ||
      c.keySkills.some(s => s.toLowerCase().includes(searchParam.toLowerCase()))
    );

    expect(matches.length).toBeGreaterThanOrEqual(2);
    expect(matches.some(c => c.id === 'aff-meta-frontend')).toBe(true);
    expect(matches.some(c => c.id === 'aff-fm-react-deepdive')).toBe(true);
  });
});
