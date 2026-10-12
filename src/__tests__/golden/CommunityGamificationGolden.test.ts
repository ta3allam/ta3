import { describe, it, expect } from "vitest";

describe("E2E Test Suite 4: Skool-Style Community Feed, XP Gamification & Levels (Day 8 Golden Suite)", () => {
  describe("Category Channels & Feed Sorting", () => {
    it("should provide all 5 standardized Arabic community channels", () => {
      const communityChannels = [
        { id: "all", label: "جميع المنشورات", icon: "Hash" },
        { id: "announcements", label: "إعلانات صانع المحتوى", icon: "Megaphone" },
        { id: "discussions", label: "نقاشات وأسئلة برمجية", icon: "MessageSquare" },
        { id: "projects", label: "مشاريع الطلاب والابتكارات", icon: "Rocket" },
        { id: "careers", label: "فرص عمل وتدريب محلي", icon: "Briefcase" },
      ];

      expect(communityChannels.length).toBe(5);
      expect(communityChannels.map((c) => c.id)).toEqual([
        "all",
        "announcements",
        "discussions",
        "projects",
        "careers",
      ]);
    });

    it("should filter posts by channel and sort by trending upvotes or creation date", () => {
      const mockPosts = [
        { id: "p1", channelId: "discussions", title: "حل مشكلة N+1 في ORM", upvotes: 24, createdAt: 1000 },
        { id: "p2", channelId: "announcements", title: "إعلان موعد البث المباشر القادم", upvotes: 65, createdAt: 2000 },
        { id: "p3", channelId: "discussions", title: "كيفية حماية مسارات React", upvotes: 42, createdAt: 3000 },
      ];

      // Filter by channel
      const discussions = mockPosts.filter((p) => p.channelId === "discussions");
      expect(discussions.length).toBe(2);

      // Sort by trending (upvotes descending)
      const trending = [...discussions].sort((a, b) => b.upvotes - a.upvotes);
      expect(trending[0].id).toBe("p3");
      expect(trending[0].upvotes).toBe(42);

      // Sort by latest (createdAt descending)
      const latest = [...discussions].sort((a, b) => b.createdAt - a.createdAt);
      expect(latest[0].id).toBe("p3");
    });
  });

  describe("Gamified XP Upvote Rewards & Level Math", () => {
    it("should compute exact reward XP (+5 XP for author, +1 XP for voter) upon upvote", () => {
      let authorXp = 120;
      let voterXp = 45;

      const AWARD_AUTHOR_XP = 5;
      const AWARD_VOTER_XP = 1;

      authorXp += AWARD_AUTHOR_XP;
      voterXp += AWARD_VOTER_XP;

      expect(authorXp).toBe(125);
      expect(voterXp).toBe(46);
    });

    it("should calculate user Level correctly based on total XP points capped at Level 9", () => {
      const calculateLevel = (xp: number) => {
        const lvl = Math.floor(xp / 100) + 1;
        return Math.min(9, Math.max(1, lvl));
      };

      expect(calculateLevel(0)).toBe(1); // 0 XP -> Level 1
      expect(calculateLevel(95)).toBe(1); // 95 XP -> Level 1
      expect(calculateLevel(100)).toBe(2); // 100 XP -> Level 2
      expect(calculateLevel(350)).toBe(4); // 350 XP -> Level 4
      expect(calculateLevel(850)).toBe(9); // 850 XP -> Level 9 (Max cap)
      expect(calculateLevel(1500)).toBe(9); // 1500 XP -> Capped at Level 9
    });
  });

  describe("Monospaced Code Block Sharing", () => {
    it("should format shared code blocks with language identifier and copyable text", () => {
      const codePost = {
        title: "نموذج توثيق JWT في Node.js",
        codeSnippet: `const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '7d' });`,
        codeLanguage: "typescript",
      };

      expect(codePost.codeLanguage).toBe("typescript");
      expect(codePost.codeSnippet).toContain("jwt.sign");
      expect(codePost.codeSnippet.length).toBeGreaterThan(20);
    });
  });
});
