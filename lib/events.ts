import { createClient } from './supabase';
import { Event } from './types';

/**
 * Fetches events for a specific platform and optional route
 */
export async function getEvents(platform: string, route?: string): Promise<Event[]> {
  const supabase = createClient();
  
  let query = supabase
    .from('events')
    .select('*')
    .eq('platform', platform);
  
  if (route) {
    query = query.eq('route', route);
  }
  
  const { data, error } = await query
    .order('start_time', { ascending: true })
    .gte('end_time', new Date().toISOString()); // Only future or ongoing events
  
  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
  
  return data as Event[];
}

/**
 * Fetches a single event by ID
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    console.error('Error fetching event by ID:', error);
    throw error;
  }
  
  return data as Event;
}

/**
 * Creates a new event
 */
export async function createEvent(eventData: Omit<Event, 'id' | 'created_at'>): Promise<Event> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('events')
    .insert(eventData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating event:', error);
    throw error;
  }
  
  return data as Event;
}

/**
 * Updates an existing event
 */
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', eventId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating event:', error);
    throw error;
  }
  
  return data as Event;
} 