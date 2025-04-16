import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join } from 'path';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function generateTypes() {
    // Define our database types
    const types = `
// Generated types from database schema
export type Platform = 'neothink' | 'ascenders' | 'immortals' | 'neothinkers'

export interface Profile {
  id: string
  user_id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  platform: Platform
  created_at: string
  updated_at: string
}

export interface PrivacySettings {
  id: string
  user_id: string
  email_visibility: 'public' | 'private' | 'members'
  profile_visibility: 'public' | 'private' | 'members'
  activity_visibility: 'public' | 'private' | 'members'
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  status: 'active' | 'canceled' | 'past_due'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string
  platform: Platform
  status: 'draft' | 'published' | 'archived'
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  order: number
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface ForumPost {
  id: string
  user_id: string
  title: string
  content: string
  platform: Platform
  status: 'published' | 'archived'
  created_at: string
  updated_at: string
}
`;
    // Write types to file
    const typesPath = join(process.cwd(), 'types', 'database.ts');
    writeFileSync(typesPath, types);
    console.log('Types generated successfully!');
}
generateTypes().catch(console.error);
//# sourceMappingURL=generate-types.js.map