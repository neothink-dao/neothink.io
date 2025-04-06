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
      notifications: {
        Row: {
          id: string
          user_id: string
          tenant_slug: string
          platform_id: string
          title: string
          message: string
          type: string
          link: string | null
          is_read: boolean
          created_at: string
          expires_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          tenant_slug: string
          platform_id: string
          title: string
          message: string
          type: string
          link?: string | null
          is_read?: boolean
          created_at?: string
          expires_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          tenant_slug?: string
          platform_id?: string
          title?: string
          message?: string
          type?: string
          link?: string | null
          is_read?: boolean
          created_at?: string
          expires_at?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      notification_settings: {
        Row: {
          id: string
          user_id: string
          tenant_slug: string
          email_enabled: boolean
          push_enabled: boolean
          in_app_enabled: boolean
          types_disabled: string[] | null
          quiet_hours_start: string | null
          quiet_hours_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tenant_slug: string
          email_enabled?: boolean
          push_enabled?: boolean
          in_app_enabled?: boolean
          types_disabled?: string[] | null
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tenant_slug?: string
          email_enabled?: boolean
          push_enabled?: boolean
          in_app_enabled?: boolean
          types_disabled?: string[] | null
          quiet_hours_start?: string | null
          quiet_hours_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          is_guardian: boolean
          platform_access: Json | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          is_guardian?: boolean
          platform_access?: Json | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          is_guardian?: boolean
          platform_access?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 