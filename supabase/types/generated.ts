// AUTO-GENERATED: Typescript types for Supabase database
// Generated for Neothink DAO monorepo (DAO-owned, DAO-governed)
// Do not edit directly. Regenerate after each migration or schema change.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
      // ... (truncated for brevity, full types should be pasted here)
    }
    // ... (other schema sections)
  }
  // ... (other schemas)
}

// Utility types for enums, composite types, etc. (truncated for brevity)
// See Supabase CLI or dashboard for full generated output.
