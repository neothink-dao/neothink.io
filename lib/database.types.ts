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
          id: string;
          email: string;
          full_name: string | null;
          active_platforms: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          active_platforms?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          active_platforms?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      content: {
        Row: {
          id: string;
          title: string;
          slug: string | null;
          content: string | null;
          platform: string;
          route: string;
          subroute: string | null;
          content_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string | null;
          content?: string | null;
          platform: string;
          route: string;
          subroute?: string | null;
          content_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string | null;
          content?: string | null;
          platform?: string;
          route?: string;
          subroute?: string | null;
          content_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          route: string;
          subroute: string | null;
          progress: Json | null;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          route: string;
          subroute?: string | null;
          progress?: Json | null;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          route?: string;
          subroute?: string | null;
          progress?: Json | null;
          last_accessed?: string;
        };
      };
      events: {
        Row: {
          id: string;
          platform: string;
          route: string;
          event_type: string;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          registration_link: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          platform: string;
          route: string;
          event_type: string;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          registration_link?: string | null;
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          platform?: string;
          route?: string;
          event_type?: string;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          registration_link?: string | null;
          created_at?: string;
          created_by?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
} 