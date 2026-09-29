import { describe, it, expect } from 'vitest';

describe('Skool-Style Community Engine & Gamification Unit Tests (Day 1)', () => {
  it('should toggle post upvote counter and award XP accurately', () => {
    let postUpvotes = 10;
    let authorXp = 100;
    let voterXp = 20;
    let hasUpvoted = false;

    // First click: upvote (+5 XP author, +1 XP voter)
    if (!hasUpvoted) {
      postUpvotes += 1;
      authorXp += 5;
      voterXp += 1;
      hasUpvoted = true;
    }
    expect(postUpvotes).toBe(11);
    expect(authorXp).toBe(105);
    expect(voterXp).toBe(21);
    expect(hasUpvoted).toBe(true);

    // Second click: un-upvote
    if (hasUpvoted) {
      postUpvotes -= 1;
      authorXp -= 5;
      voterXp -= 1;
      hasUpvoted = false;
    }
    expect(postUpvotes).toBe(10);
    expect(authorXp).toBe(100);
    expect(voterXp).toBe(20);
    expect(hasUpvoted).toBe(false);
  });

  it('should calculate author level dynamically based on XP brackets', () => {
    const calculateLevel = (xp: number) => {
      if (xp >= 1000) return 9;
      if (xp >= 500) return 6;
      if (xp >= 300) return 5;
      if (xp >= 200) return 4;
      if (xp >= 100) return 3;
      if (xp >= 50) return 2;
      return 1;
    };

    expect(calculateLevel(25)).toBe(1);
    expect(calculateLevel(60)).toBe(2);
    expect(calculateLevel(150)).toBe(3);
    expect(calculateLevel(350)).toBe(5);
    expect(calculateLevel(1200)).toBe(9);
  });

  it('should maintain pinned posts at the top of the feed stream', () => {
    const mockPosts = [
      { id: '1', title: 'سؤال برمجيات', isPinned: false, upvotes: 50 },
      { id: '2', title: 'إعلان مثبت من المعلم', isPinned: true, upvotes: 10 },
      { id: '3', title: 'مشروع تخرج', isPinned: false, upvotes: 30 }
    ];

    const sorted = [...mockPosts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.upvotes - a.upvotes;
    });

    expect(sorted[0].id).toBe('2');
    expect(sorted[0].isPinned).toBe(true);
    expect(sorted[1].id).toBe('1');
  });

  it('should search posts by title, content, author, or tags', () => {
    const mockPosts = [
      { id: '1', title: 'دورة React المتقدمة', author: 'أحمد', content: 'شرح مفصل عن Hooks', tags: ['React', 'Frontend'] },
      { id: '2', title: 'مدخل إلى قواعد البيانات', author: 'سامر', content: 'أنظمة PostgreSQL', tags: ['SQL', 'Postgres'] },
      { id: '3', title: 'فرصة عمل في دمشق', author: 'خالد', content: 'مطلوب مصمم UI/UX', tags: ['وظائف', 'تصميم'] }
    ];

    const search = (q: string) => {
      const term = q.toLowerCase();
      return mockPosts.filter(p =>
        p.title.toLowerCase().includes(term) ||
        p.content.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.tags.some(t => t.toLowerCase().includes(term))
      );
    };

    expect(search('React').length).toBe(1);
    expect(search('دمشق').length).toBe(1);
    expect(search('Postgres').length).toBe(1);
    expect(search('غير_موجود').length).toBe(0);
  });

  it('should append inline comment and increment comment counter', () => {
    const post = {
      id: 'cp-100',
      title: 'نقاش حول بنية التطبيقات',
      commentsCount: 2,
      comments: [
        { id: 'c1', authorName: 'علي', content: 'رائع' },
        { id: 'c2', authorName: 'سارة', content: 'شكراً' }
      ]
    };

    const newComment = { id: 'c3', authorName: 'عمر', content: 'هل هناك تسجيل للمحاضرة؟' };
    const updatedPost = {
      ...post,
      commentsCount: post.commentsCount + 1,
      comments: [...post.comments, newComment]
    };

    expect(updatedPost.commentsCount).toBe(3);
    expect(updatedPost.comments[2].content).toBe('هل هناك تسجيل للمحاضرة؟');
  });
});
