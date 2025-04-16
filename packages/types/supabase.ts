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
          badge_url: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          platform: string
          points: number | null
          requirements: Json | null
          updated_at: string | null
        }
        Insert: {
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          platform: string
          points?: number | null
          requirements?: Json | null
          updated_at?: string | null
        }
        Update: {
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          platform?: string
          points?: number | null
          requirements?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      activity_feed: {
        Row: {
          activity_type: string
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          platform: string
          updated_at: string | null
          user_id: string | null
          visibility: string
        }
        Insert: {
          activity_type: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          platform: string
          updated_at?: string | null
          user_id?: string | null
          visibility: string
        }
        Update: {
          activity_type?: string
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string
          updated_at?: string | null
          user_id?: string | null
          visibility?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_name: string
          id: string
          platform: string
          properties: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          id?: string
          platform: string
          properties?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          id?: string
          platform?: string
          properties?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      content: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          description: string | null;
          content: string | null;
          metadata: Json;
          published: boolean;
          app: string;
          type: string;
          tags: string[];
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          description?: string | null;
          content?: string | null;
          metadata?: Json;
          published?: boolean;
          app: string;
          type: string;
          tags?: string[];
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          description?: string | null;
          content?: string | null;
          metadata?: Json;
          published?: boolean;
          app?: string;
          type?: string;
          tags?: string[];
        };
      };
      profiles: {
        Row: {
          id: string;
          updated_at: string;
          full_name: string | null;
          avatar_url: string | null;
          email: string | null;
          app_metadata: Json;
          hub_access: boolean;
          ascenders_access: boolean;
          neothinkers_access: boolean;
          immortals_access: boolean;
        };
        Insert: {
          id: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          app_metadata?: Json;
          hub_access?: boolean;
          ascenders_access?: boolean;
          neothinkers_access?: boolean;
          immortals_access?: boolean;
        };
        Update: {
          id?: string;
          updated_at?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          email?: string | null;
          app_metadata?: Json;
          hub_access?: boolean;
          ascenders_access?: boolean;
          neothinkers_access?: boolean;
          immortals_access?: boolean;
        };
      };
      progress: {
        Row: {
          id: string;
          user_id: string;
          content_id: string;
          progress: number;
          completed: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content_id: string;
          progress?: number;
          completed?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content_id?: string;
          progress?: number;
          completed?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          metadata: Json;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          metadata?: Json;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
          metadata?: Json;
        };
      };
    };
    Views: {
      mv_content_engagement_stats: {
        Row: {
          avg_completion_time_seconds: number | null
          completions: number | null
          module_id: string | null
          module_title: string | null
          platform: string | null
          unique_users: number | null
        }
        Relationships: []
      }
      mv_user_progress_stats: {
        Row: {
          completed_lessons: number | null
          completed_modules: number | null
          last_activity: string | null
          platform: string | null
          total_points: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_health_summary: {
        Row: {
          average_value: number | null
          first_reading: string | null
          last_reading: string | null
          max_value: number | null
          metric_type: string | null
          min_value: number | null
          reading_count: number | null
          user_id: string | null
        }
        Relationships: []
      }
    };
    Functions: {
      add_user_to_tenant: {
        Args: { _user_id: string; _tenant_slug: string; _role?: string }
        Returns: boolean
      }
      check_email_exists: {
        Args: { email: string }
        Returns: boolean
      }
    };
    Enums: {
      ascender_focus: "ascender" | "ascension" | "flow" | "ascenders"
      experience_phase: "discover" | "onboard" | "progress" | "endgame"
      immortal_focus: "immortal" | "immortalis" | "project_life" | "immortals"
      neothinker_focus:
        | "neothinker"
        | "neothink"
        | "revolution"
        | "fellowship"
        | "movement"
        | "command"
        | "mark_hamilton"
        | "neothinkers"
      platform_type:
        | "neothink_hub"
        | "ascender"
        | "neothinker"
        | "immortal"
        | "hub"
        | "ascenders"
        | "neothinkers"
        | "immortals"
      token_type: "live" | "love" | "life"
    };
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ascender_focus: ["ascender", "ascension", "flow", "ascenders"],
      experience_phase: ["discover", "onboard", "progress", "endgame"],
      immortal_focus: ["immortal", "immortalis", "project_life", "immortals"],
      neothinker_focus: [
        "neothinker",
        "neothink",
        "revolution",
        "fellowship",
        "movement",
        "command",
        "mark_hamilton",
        "neothinkers",
      ],
      platform_type: [
        "neothink_hub",
        "ascender",
        "neothinker",
        "immortal",
        "hub",
        "ascenders",
        "neothinkers",
        "immortals",
      ],
      token_type: ["live", "love", "life"],
    },
  },
} as const 