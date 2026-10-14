/**
 * Centralized TanStack Query Key Factory
 *
 * Implements deterministic hierarchical tuple keys across all domain entities
 * (Courses, Receipts/Payouts, Cohorts, Community, User Profiles).
 * Ensures safe, scope-bounded cache invalidation and query deduplication.
 */

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: { category?: string; pricingType?: string; search?: string }) =>
    [...courseKeys.lists(), { ...(filters || {}) }] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (courseId: number | string) => [...courseKeys.details(), String(courseId)] as const,
  lectures: (courseId: number | string) => [...courseKeys.detail(courseId), 'lectures'] as const,
  lecture: (courseId: number | string, lectureId: number | string) =>
    [...courseKeys.lectures(courseId), String(lectureId)] as const,
  announcements: (courseId: number | string) =>
    [...courseKeys.detail(courseId), 'announcements'] as const,
  assignments: (courseId: number | string) =>
    [...courseKeys.detail(courseId), 'assignments'] as const,
  events: (courseId: number | string) =>
    [...courseKeys.detail(courseId), 'events'] as const,
  submissions: (courseId: number | string) =>
    [...courseKeys.detail(courseId), 'submissions'] as const,
};

export const receiptKeys = {
  all: ['receipts'] as const,
  lists: () => [...receiptKeys.all, 'list'] as const,
  list: (creatorId?: string) => [...receiptKeys.lists(), { creatorId }] as const,
  details: () => [...receiptKeys.all, 'detail'] as const,
  detail: (receiptId: string) => [...receiptKeys.details(), receiptId] as const,
  balance: (creatorId: string) => [...receiptKeys.all, 'balance', creatorId] as const,
  payouts: (creatorId: string) => [...receiptKeys.all, 'payouts', creatorId] as const,
  payoutStatus: (payoutId: string) => [...receiptKeys.all, 'payoutStatus', payoutId] as const,
};

export const cohortKeys = {
  all: ['cohorts'] as const,
  lists: () => [...cohortKeys.all, 'list'] as const,
  list: (filter?: { activeOnly?: boolean; courseId?: number }) =>
    [...cohortKeys.lists(), { ...(filter || {}) }] as const,
  details: () => [...cohortKeys.all, 'detail'] as const,
  detail: (cohortId: string | number) => [...cohortKeys.details(), String(cohortId)] as const,
  events: (cohortId: string | number) => [...cohortKeys.detail(cohortId), 'events'] as const,
  members: (cohortId: string | number) => [...cohortKeys.detail(cohortId), 'members'] as const,
  leaderboard: (cohortId: string | number) => [...cohortKeys.detail(cohortId), 'leaderboard'] as const,
};

export const communityKeys = {
  all: ['community'] as const,
  feed: (filters?: { tag?: string; sort?: 'recent' | 'top' | 'hot' }) =>
    [...communityKeys.all, 'feed', { ...(filters || {}) }] as const,
  details: () => [...communityKeys.all, 'detail'] as const,
  post: (postId: string | number) => [...communityKeys.details(), String(postId)] as const,
  comments: (postId: string | number) => [...communityKeys.post(postId), 'comments'] as const,
  likes: (postId: string | number) => [...communityKeys.post(postId), 'likes'] as const,
};

export const userKeys = {
  all: ['users'] as const,
  current: () => [...userKeys.all, 'current'] as const,
  profile: (userId: string | number) => [...userKeys.all, 'profile', String(userId)] as const,
  xp: (userId: string | number) => [...userKeys.all, 'xp', String(userId)] as const,
  notifications: (userId: string | number) => [...userKeys.all, 'notifications', String(userId)] as const,
};
