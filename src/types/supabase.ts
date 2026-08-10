export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          username: string
          role: 'student' | 'teacher' | 'admin'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          username: string
          role: 'student' | 'teacher' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          role?: 'student' | 'teacher' | 'admin'
          avatar_url?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: number
          code: string
          name: string
          category: string
          difficulty: string | null
          teacher_id: string | null
          bg_image: string | null
          period: string | null
          created_at: string
        }
        Insert: {
          id?: number
          code: string
          name: string
          category?: string
          difficulty?: string | null
          teacher_id?: string | null
          bg_image?: string | null
          period?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          name?: string
          category?: string
          difficulty?: string | null
          teacher_id?: string | null
          bg_image?: string | null
          period?: string | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: number
          student_id: string
          course_id: number
          enrolled_at: string
        }
        Insert: {
          id?: number
          student_id: string
          course_id: number
          enrolled_at?: string
        }
        Update: {
          id?: number
          student_id?: string
          course_id?: number
          enrolled_at?: string
        }
      }
      lectures: {
        Row: {
          id: number
          course_id: number
          title: string
          description: string | null
          duration: string | null
          video_url: string | null
          order_num: number
          created_at: string
        }
        Insert: {
          id?: number
          course_id: number
          title: string
          description?: string | null
          duration?: string | null
          video_url?: string | null
          order_num?: number
          created_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          title?: string
          description?: string | null
          duration?: string | null
          video_url?: string | null
          order_num?: number
          created_at?: string
        }
      }
      materials: {
        Row: {
          id: number
          lecture_id: number | null
          course_id: number
          title: string
          type: 'pdf' | 'video' | 'document' | 'link'
          url: string
          created_at: string
        }
        Insert: {
          id?: number
          lecture_id?: number | null
          course_id: number
          title: string
          type: 'pdf' | 'video' | 'document' | 'link'
          url: string
          created_at?: string
        }
        Update: {
          id?: number
          lecture_id?: number | null
          course_id?: number
          title?: string
          type?: 'pdf' | 'video' | 'document' | 'link'
          url?: string
          created_at?: string
        }
      }
      assignments: {
        Row: {
          id: number
          course_id: number
          title: string
          description: string | null
          due_date: string
          created_at: string
        }
        Insert: {
          id?: number
          course_id: number
          title: string
          description?: string | null
          due_date: string
          created_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          title?: string
          description?: string | null
          due_date?: string
          created_at?: string
        }
      }
      submissions: {
        Row: {
          id: number
          assignment_id: number
          student_id: string
          file_url: string | null
          notes: string | null
          submitted_at: string
          grade: number | null
          feedback: string | null
        }
        Insert: {
          id?: number
          assignment_id: number
          student_id: string
          file_url?: string | null
          notes?: string | null
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
        }
        Update: {
          id?: number
          assignment_id?: number
          student_id?: string
          file_url?: string | null
          notes?: string | null
          submitted_at?: string
          grade?: number | null
          feedback?: string | null
        }
      }
      discussions: {
        Row: {
          id: number
          course_id: number
          author_id: string
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: number
          course_id: number
          author_id: string
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          author_id?: string
          title?: string
          content?: string
          created_at?: string
        }
      }
      study_groups: {
        Row: {
          id: number
          course_id: number
          name: string
          description: string | null
          leader_id: string | null
          max_members: number
          created_at: string
        }
        Insert: {
          id?: number
          course_id: number
          name: string
          description?: string | null
          leader_id?: string | null
          max_members?: number
          created_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          name?: string
          description?: string | null
          leader_id?: string | null
          max_members?: number
          created_at?: string
        }
      }
    }
  }
}
