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
      reports: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          status: string
          priority: string
          image_path: string | null
          location: string | null
          address: string | null
          reporter_id: string | null
          confidence: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          status?: string
          priority?: string
          image_path?: string | null
          location?: string | null
          address?: string | null
          reporter_id?: string | null
          confidence?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          status?: string
          priority?: string
          image_path?: string | null
          location?: string | null
          address?: string | null
          reporter_id?: string | null
          confidence?: number
          created_at?: string
          updated_at?: string
        }
      },
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          points: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          points?: number
          created_at?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected'
          priority: 'low' | 'medium' | 'high' | 'critical'
          location: unknown // PostGIS geography type
          address: string | null
          image_urls: string[] | null
          reporter_id: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          status?: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          location?: unknown // PostGIS geography type
          address?: string | null
          image_urls?: string[] | null
          reporter_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          status?: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          location?: unknown // PostGIS geography type
          address?: string | null
          image_urls?: string[] | null
          reporter_id?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          issue_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          issue_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      issue_status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'rejected'
      priority_level: 'low' | 'medium' | 'high' | 'critical'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
