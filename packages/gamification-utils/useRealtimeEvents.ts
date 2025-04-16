"use client";

import { useEffect, useRef, useState } from 'react';
// @ts-expect-error: monorepo import may be valid in deployment context
import { createClient } from '@supabase/supabase-js';

export type EventTable =
  | 'xp_events'
  | 'badge_events'
  | 'fibonacci_token_rewards'
  | 'census_snapshots';

export interface RealtimeEvent<T = any> {
  table: EventTable;
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: T;
}

interface UseRealtimeEventsOptions {
  tables: EventTable[];
  filter?: (event: RealtimeEvent) => boolean;
}

export function useRealtimeEvents<T = any>({ tables, filter }: UseRealtimeEventsOptions) {
  const [events, setEvents] = useState<RealtimeEvent<T>[]>([]);
  const supabaseRef = useRef<any>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return;
    if (!supabaseRef.current) {
      supabaseRef.current = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
    }
    const supabase = supabaseRef.current;
    const subscriptions = tables.map((table) => {
      return supabase
        .channel(`${table}-realtime`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
          },
          (payload: any) => {
            const event: RealtimeEvent = {
              table,
              event: payload.eventType,
              payload: payload.new || payload.old,
            };
            if (!filter || filter(event)) {
              setEvents((prev) => [...prev, event]);
            }
          }
        )
        .subscribe();
    });
    return () => {
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tables.join(',')]);

  return events;
}

/*
Usage Example:
const events = useRealtimeEvents({ tables: ['xp_events', 'badge_events'] });
*/

// Export the hook as default for compatibility with admin app import
export default useRealtimeEvents;
