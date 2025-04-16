export type EventTable = 'xp_events' | 'badge_events' | 'fibonacci_token_rewards' | 'census_snapshots';
export interface RealtimeEvent<T = any> {
    table: EventTable;
    event: 'INSERT' | 'UPDATE' | 'DELETE';
    payload: T;
}
interface UseRealtimeEventsOptions {
    tables: EventTable[];
    filter?: (event: RealtimeEvent) => boolean;
}
export declare function useRealtimeEvents<T = any>({ tables, filter }: UseRealtimeEventsOptions): RealtimeEvent<T>[];
export default useRealtimeEvents;
//# sourceMappingURL=useRealtimeEvents.d.ts.map