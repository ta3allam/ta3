import { supabase } from './supabase';

export interface DiscussionReply {
  id: number;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'admin';
  content: string;
  createdAt: string;
  isSolution?: boolean;
}

export interface DiscussionThread {
  id: number;
  courseId: number;
  title: string;
  content: string;
  authorName: string;
  authorRole: 'student' | 'teacher' | 'admin';
  createdAt: string;
  replies: DiscussionReply[];
  isSolved?: boolean;
}

/**
 * Subscribes to real-time discussion updates for a specific course using Supabase Realtime channels.
 */
export function subscribeToDiscussions(
  courseId: number,
  onUpdate: (payload: any) => void
) {
  const channel = supabase
    .channel(`course_discussions_${courseId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'discussions',
        filter: `course_id=eq.${courseId}`
      },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
