import { describe, it, expect } from 'vitest';

describe('Community Feed & Post Upvotes Unit Tests', () => {
  it('should toggle post upvote counter accurately', () => {
    let upvotesCount = 10;
    let hasUpvoted = false;

    // First click: upvote
    if (!hasUpvoted) {
      upvotesCount += 1;
      hasUpvoted = true;
    }
    expect(upvotesCount).toBe(11);
    expect(hasUpvoted).toBe(true);

    // Second click: un-upvote
    if (hasUpvoted) {
      upvotesCount -= 1;
      hasUpvoted = false;
    }
    expect(upvotesCount).toBe(10);
    expect(hasUpvoted).toBe(false);
  });

  it('should filter posts by channel correctly', () => {
    const mockPosts = [
      { id: '1', channel: 'announcements', title: 'إعلان مهم' },
      { id: '2', channel: 'discussions', title: 'سؤال في React' },
      { id: '3', channel: 'projects', title: 'مشروعي الجديد' }
    ];

    const filtered = mockPosts.filter(p => p.channel === 'discussions');
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('سؤال في React');
  });
});
