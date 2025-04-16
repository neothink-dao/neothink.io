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
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          last_sign_in_at: string | null
          role: 'user' | 'admin'
          metadata: Json | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          role?: 'user' | 'admin'
          metadata?: Json | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          last_sign_in_at?: string | null
          role?: 'user' | 'admin'
          metadata?: Json | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          expires_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      rate_limits: {
        Row: {
          key: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          key: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          key?: string
          count?: number
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
} 