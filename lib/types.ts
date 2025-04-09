import { Database } from './database.types';

export type Platform = 'hub' | 'ascenders' | 'neothinkers' | 'immortals';

export interface Content {
  id: string;
  title: string;
  slug: string;
  content: string;
  platform: Platform;
  route: string;
  subroute?: string | null;
  content_data?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  platform: Platform;
  route: string;
  subroute?: string | null;
  progress: Record<string, any>;
  last_accessed: string;
}

export interface Event {
  id: string;
  platform: Platform;
  route: string;
  event_type: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  registration_link?: string | null;
  created_at: string;
  created_by: string;
}

export type Tables = Database['public']['Tables'];
export type ContentRow = Tables['content']['Row'];
export type ProgressRow = Tables['user_progress']['Row'];
export type EventRow = Tables['events']['Row']; 