export * from './models';
export type { SecurityLog, SecurityEvent, SecurityEventSeverity, SecurityEventType } from './models';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Platform bridge tables
      platform_preferences: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          preferences: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          preferences?: Json;
          updated_at?: string;
        };
      };
      
      platform_notifications: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          title: string;
          message: string;
          type: string;
          read: boolean;
          data: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          title: string;
          message: string;
          type: string;
          read?: boolean;
          data?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          title?: string;
          message?: string;
          type?: string;
          read?: boolean;
          data?: Json;
        };
      };
      
      platform_state: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          key: string;
          value: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          key: string;
          value: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
      
      // AI integration tables
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          title: string;
          messages: Json;
          model: string;
          created_at: string;
          updated_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          title: string;
          messages: Json;
          model: string;
          created_at?: string;
          updated_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          title?: string;
          messages?: Json;
          model?: string;
          updated_at?: string;
          metadata?: Json;
        };
      };
      
      ai_embeddings: {
        Row: {
          id: string;
          content: string;
          embedding: number[];
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          content: string;
          embedding: number[];
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          content?: string;
          embedding?: number[];
          metadata?: Json;
        };
      };
      
      ai_usage_metrics: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          model: string;
          tokens_input: number;
          tokens_output: number;
          duration_ms: number;
          cost: number;
          created_at: string;
          request_id: string;
          context_type: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          model: string;
          tokens_input: number;
          tokens_output: number;
          duration_ms: number;
          cost: number;
          created_at?: string;
          request_id: string;
          context_type: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          model?: string;
          tokens_input?: number;
          tokens_output?: number;
          duration_ms?: number;
          cost?: number;
          request_id?: string;
          context_type?: string;
        };
      };
    };
    
    Views: {
      [_ in never]: never;
    };
    
    Functions: {
      match_ai_embeddings: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
          filter_metadata?: Json;
        };
        Returns: {
          id: string;
          content: string;
          metadata: Json;
          similarity: number;
        }[];
      };
    };
    
    Enums: {
      [_ in never]: never;
    };
    
    CompositeTypes: {
      [_ in never]: never;
    };
  };
} 