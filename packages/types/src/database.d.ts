/**
 * TypeScript definitions for Neothink Supabase database
 */
export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
export interface Database {
    public: {
        Tables: {
            feedback: {
                Row: {
                    id: string;
                    app_name: string;
                    content: string;
                    user_id: string | null;
                    created_at: string;
                    sentiment: string | null;
                };
                Insert: {
                    id?: string;
                    app_name: string;
                    content: string;
                    user_id?: string | null;
                    created_at?: string;
                    sentiment?: string | null;
                };
                Update: {
                    id?: string;
                    app_name?: string;
                    content?: string;
                    user_id?: string | null;
                    created_at?: string;
                    sentiment?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "feedback_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            chat_history: {
                Row: {
                    id: string;
                    app_name: string;
                    user_id: string;
                    message: string;
                    response: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    app_name: string;
                    user_id: string;
                    message: string;
                    response: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    app_name?: string;
                    user_id?: string;
                    message?: string;
                    response?: string;
                    created_at?: string;
                };
                Relationships: [
                    {
                        foreignKeyName: "chat_history_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            user_profiles: {
                Row: {
                    id: string;
                    email: string;
                    raw_user_meta_data: Json | null;
                    role: string | null;
                    app_subscriptions: Json | null;
                    created_at: string | null;
                    updated_at: string | null;
                };
                Relationships: [];
            };
        };
        Functions: {
            analyze_sentiment: {
                Args: {
                    feedback_text: string;
                };
                Returns: string;
            };
            summarize_feedback: {
                Args: {
                    app: string;
                    days?: number;
                };
                Returns: {
                    app_name: string;
                    feedback_count: number;
                    positive_count: number;
                    negative_count: number;
                    neutral_count: number;
                }[];
            };
            set_user_role: {
                Args: {
                    user_id: string;
                    role: string;
                };
                Returns: void;
            };
            update_user_app_subscriptions: {
                Args: {
                    user_id: string;
                    app_names: string[];
                };
                Returns: void;
            };
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T];
//# sourceMappingURL=database.d.ts.map