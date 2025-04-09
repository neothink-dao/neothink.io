export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string;
          name: string;
          platform: string;
          points: number | null;
          requirements: Json | null;
          updated_at: string | null;
        };
        Insert: {
          badge_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name: string;
          platform: string;
          points?: number | null;
          requirements?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          badge_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          name?: string;
          platform?: string;
          points?: number | null;
          requirements?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      activity_feed: {
        Row: {
          activity_type: string;
          content_id: string | null;
          content_type: string | null;
          created_at: string | null;
          id: string;
          metadata: Json | null;
          platform: string;
          updated_at: string | null;
          user_id: string | null;
          visibility: string;
        };
        Insert: {
          activity_type: string;
          content_id?: string | null;
          content_type?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          platform: string;
          updated_at?: string | null;
          user_id?: string | null;
          visibility: string;
        };
        Update: {
          activity_type?: string;
          content_id?: string | null;
          content_type?: string | null;
          created_at?: string | null;
          id?: string;
          metadata?: Json | null;
          platform?: string;
          updated_at?: string | null;
          user_id?: string | null;
          visibility?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          created_at: string | null;
          event_name: string;
          id: string;
          platform: string;
          properties: Json | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          event_name: string;
          id?: string;
          platform: string;
          properties?: Json | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          event_name?: string;
          id?: string;
          platform?: string;
          properties?: Json | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      analytics_metrics: {
        Row: {
          created_at: string | null;
          dimension_values: Json | null;
          id: string;
          measured_at: string;
          metric_key: string;
          metric_value: number;
          platform: string;
        };
        Insert: {
          created_at?: string | null;
          dimension_values?: Json | null;
          id?: string;
          measured_at: string;
          metric_key: string;
          metric_value: number;
          platform: string;
        };
        Update: {
          created_at?: string | null;
          dimension_values?: Json | null;
          id?: string;
          measured_at?: string;
          metric_key?: string;
          metric_value?: number;
          platform?: string;
        };
        Relationships: [];
      };
      analytics_reports: {
        Row: {
          created_at: string | null;
          created_by: string | null;
          id: string;
          parameters: Json | null;
          platform: string;
          report_data: Json | null;
          report_type: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          parameters?: Json | null;
          platform: string;
          report_data?: Json | null;
          report_type: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          created_by?: string | null;
          id?: string;
          parameters?: Json | null;
          platform?: string;
          report_data?: Json | null;
          report_type?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      analytics_summaries: {
        Row: {
          created_at: string | null;
          end_date: string;
          id: string;
          metrics: Json;
          platform: string;
          start_date: string;
          summary_type: string;
          time_period: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          end_date: string;
          id?: string;
          metrics: Json;
          platform: string;
          start_date: string;
          summary_type: string;
          time_period: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          end_date?: string;
          id?: string;
          metrics?: Json;
          platform?: string;
          start_date?: string;
          summary_type?: string;
          time_period?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      ascenders_profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          level: number | null;
          preferences: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      hub_profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          preferences: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          preferences?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          preferences?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      immortals_profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          level: number | null;
          preferences: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      neothinkers_profiles: {
        Row: {
          bio: string | null;
          created_at: string;
          display_name: string | null;
          id: string;
          level: number | null;
          preferences: Json;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          bio?: string | null;
          created_at?: string;
          display_name?: string | null;
          id?: string;
          level?: number | null;
          preferences?: Json;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      platform_access: {
        Row: {
          access_level: string | null;
          expires_at: string | null;
          granted_at: string | null;
          granted_by: string | null;
          id: string;
          platform_slug: string;
          user_id: string;
        };
        Insert: {
          access_level?: string | null;
          expires_at?: string | null;
          granted_at?: string | null;
          granted_by?: string | null;
          id?: string;
          platform_slug: string;
          user_id: string;
        };
        Update: {
          access_level?: string | null;
          expires_at?: string | null;
          granted_at?: string | null;
          granted_by?: string | null;
          id?: string;
          platform_slug?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          guardian_since: string | null;
          id: string;
          is_ascender: boolean | null;
          is_guardian: boolean | null;
          is_immortal: boolean | null;
          is_neothinker: boolean | null;
          platforms: string[] | null;
          role: string | null;
          subscribed_platforms: string[] | null;
          subscription_period_end: string | null;
          subscription_period_start: string | null;
          subscription_status: string | null;
          subscription_tier: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email: string;
          full_name?: string | null;
          guardian_since?: string | null;
          id: string;
          is_ascender?: boolean | null;
          is_guardian?: boolean | null;
          is_immortal?: boolean | null;
          is_neothinker?: boolean | null;
          platforms?: string[] | null;
          role?: string | null;
          subscribed_platforms?: string[] | null;
          subscription_period_end?: string | null;
          subscription_period_start?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          guardian_since?: string | null;
          id?: string;
          is_ascender?: boolean | null;
          is_guardian?: boolean | null;
          is_immortal?: boolean | null;
          is_neothinker?: boolean | null;
          platforms?: string[] | null;
          role?: string | null;
          subscribed_platforms?: string[] | null;
          subscription_period_end?: string | null;
          subscription_period_start?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      mv_content_engagement_stats: {
        Row: {
          avg_completion_time_seconds: number | null;
          completions: number | null;
          module_id: string | null;
          module_title: string | null;
          platform: string | null;
          unique_users: number | null;
        };
        Relationships: [];
      };
      mv_user_progress_stats: {
        Row: {
          completed_lessons: number | null;
          completed_modules: number | null;
          last_activity: string | null;
          platform: string | null;
          total_points: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
      user_health_summary: {
        Row: {
          average_value: number | null;
          first_reading: string | null;
          last_reading: string | null;
          max_value: number | null;
          metric_type: string | null;
          min_value: number | null;
          reading_count: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Enums: {
      ascender_focus: "ascender" | "ascension" | "flow" | "ascenders";
      experience_phase: "discover" | "onboard" | "progress" | "endgame";
      immortal_focus: "immortal" | "immortalis" | "project_life" | "immortals";
      neothinker_focus:
        | "neothinker"
        | "neothink"
        | "revolution"
        | "fellowship"
        | "movement"
        | "command"
        | "mark_hamilton"
        | "neothinkers";
      platform_type:
        | "neothink_hub"
        | "ascender"
        | "neothinker"
        | "immortal"
        | "hub"
        | "ascenders"
        | "neothinkers"
        | "immortals";
      token_type: "live" | "love" | "life";
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Platform-specific profile types
export type HubProfile = Tables<'hub_profiles'>;
export type AscendersProfile = Tables<'ascenders_profiles'>;
export type NeothinkersProfile = Tables<'neothinkers_profiles'>;
export type ImmortalsProfile = Tables<'immortals_profiles'>;
export type PlatformAccess = Tables<'platform_access'>;

// Main profile type
export type Profile = Tables<'profiles'>;

// Analytics types
export type AnalyticsEvent = Tables<'analytics_events'>;
export type AnalyticsMetric = Tables<'analytics_metrics'>;
export type AnalyticsSummary = Tables<'analytics_summaries'>;
export type AnalyticsReport = Tables<'analytics_reports'>;

// Platform type enum
export type PlatformType = Enums<'platform_type'>;

export const PLATFORMS = {
  HUB: 'hub',
  ASCENDERS: 'ascenders',
  NEOTHINKERS: 'neothinkers',
  IMMORTALS: 'immortals'
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS]; 