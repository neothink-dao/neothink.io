export type Json = string | number | boolean | null | {
    [key: string]: Json | undefined;
} | Json[];
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
        };
    };
};
//# sourceMappingURL=generated.d.ts.map