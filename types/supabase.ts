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
          full_name: string | null
          avatar_url: string | null
          email: string | null
          app_metadata: Json | null
          hub_access: boolean
          ascenders_access: boolean
          neothinkers_access: boolean
          immortals_access: boolean
        }
        Insert: {
          id: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          app_metadata?: Json | null
          hub_access?: boolean
          ascenders_access?: boolean
          neothinkers_access?: boolean
          immortals_access?: boolean
        }
        Update: {
          id?: string
          updated_at?: string | null
          full_name?: string | null
          avatar_url?: string | null
          email?: string | null
          app_metadata?: Json | null
          hub_access?: boolean
          ascenders_access?: boolean
          neothinkers_access?: boolean
          immortals_access?: boolean
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
      content: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          description: string | null
          content: string | null
          metadata: Json | null
          published: boolean
          app: string
          type: string
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description?: string | null
          content?: string | null
          metadata?: Json | null
          published?: boolean
          app: string
          type: string
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string | null
          content?: string | null
          metadata?: Json | null
          published?: boolean
          app?: string
          type?: string
          tags?: string[] | null
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          content_id: string
          progress: number
          completed: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content_id: string
          progress?: number
          completed?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content_id?: string
          progress?: number
          completed?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          platform: string
          properties: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          platform: string
          properties?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          platform?: string
          properties?: Json | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 