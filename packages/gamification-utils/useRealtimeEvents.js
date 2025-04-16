"use client";
import { useEffect, useRef, useState } from 'react';
// @ts-expect-error: monorepo import may be valid in deployment context
import { createClient } from '@supabase/supabase-js';
export function useRealtimeEvents({ tables, filter }) {
    const [events, setEvents] = useState([]);
    const supabaseRef = useRef(null);
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
            return;
        if (!supabaseRef.current) {
            supabaseRef.current = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
        }
        const supabase = supabaseRef.current;
        const subscriptions = tables.map((table) => {
            return supabase
                .channel(`${table}-realtime`)
                .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table,
            }, (payload) => {
                const event = {
                    table,
                    event: payload.eventType,
                    payload: payload.new || payload.old,
                };
                if (!filter || filter(event)) {
                    setEvents((prev) => [...prev, event]);
                }
            })
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
//# sourceMappingURL=useRealtimeEvents.js.map