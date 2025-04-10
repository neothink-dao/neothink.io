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
      feedback: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          content: string
          sentiment: 'positive' | 'neutral' | 'negative'
          status: 'new' | 'in_progress' | 'resolved' | 'closed'
          app_name: string
          platform: string
          user_id: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          content: string
          sentiment?: 'positive' | 'neutral' | 'negative'
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          app_name: string
          platform: string
          user_id?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          content?: string
          sentiment?: 'positive' | 'neutral' | 'negative'
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          app_name?: string
          platform?: string
          user_id?: string | null
          metadata?: Json
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          app_name: string
          title: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          title?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          title?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string | null
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id?: string | null
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string | null
          role?: 'user' | 'assistant' | 'system'
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      ai_embeddings: {
        Row: {
          id: string
          content_id: string
          content_type: string
          embedding: unknown // Vector type not directly representable in TypeScript
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          content_id: string
          content_type: string
          embedding?: unknown
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string
          content_type?: string
          embedding?: unknown
          metadata?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          app_name: string
          type: string
          title: string
          message: string
          link: string | null
          is_read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          type: string
          title: string
          message: string
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          is_read?: boolean
          metadata?: Json
          created_at?: string
        }
      }
      ai_suggestions: {
        Row: {
          id: string
          user_id: string | null
          app_name: string
          content_id: string | null
          content_type: string
          suggestion_type: string
          content: string
          confidence: number
          is_applied: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          app_name: string
          content_id?: string | null
          content_type: string
          suggestion_type: string
          content: string
          confidence: number
          is_applied?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          app_name?: string
          content_id?: string | null
          content_type?: string
          suggestion_type?: string
          content?: string
          confidence?: number
          is_applied?: boolean
          created_at?: string
        }
      }
      ai_analytics: {
        Row: {
          id: string
          event_type: string
          app_name: string
          user_id: string | null
          metrics: Json
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          app_name: string
          user_id?: string | null
          metrics: Json
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          app_name?: string
          user_id?: string | null
          metrics?: Json
          metadata?: Json
          created_at?: string
        }
      }
      user_ai_preferences: {
        Row: {
          id: string
          user_id: string
          app_name: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_name: string
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_name?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      security_logs: {
        Row: {
          id: string
          event_type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          context: Json
          details: Json
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          platform: string | null
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          event_type: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          context?: Json
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          platform?: string | null
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          event_type?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          context?: Json
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          platform?: string | null
          timestamp?: string
          created_at?: string
        }
      }
      rate_limits: {
        Row: {
          id: string
          key: string
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          key: string
          timestamp?: string
          created_at?: string
        }
        Update: {
          id?: string
          key?: string
          timestamp?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_embedding: {
        Args: {
          content: string
        }
        Returns: unknown // Vector type
      }
      search_similar_content: {
        Args: {
          query_text: string
          content_type: string
          similarity_threshold?: number
          max_results?: number
        }
        Returns: {
          content_id: string
          similarity: number
        }[]
      }
      track_ai_analytics: {
        Args: {
          p_event_type: string
          p_app_name: string
          p_metrics: Json
          p_metadata?: Json
        }
        Returns: string
      }
      check_password_breach: {
        Args: {
          password: string
        }
        Returns: boolean
      }
      clean_old_rate_limits: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
} 