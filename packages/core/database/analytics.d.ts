import type { PlatformSlug } from './platform';
/**
 * Track an analytics event for a specific platform
 */
export declare function trackEvent(eventName: string, platform: PlatformSlug, properties?: Record<string, any>, userId?: string): Promise<void>;
/**
 * Get analytics events for a user
 */
export declare function getUserEvents(userId?: string, platform?: PlatformSlug, limit?: number): Promise<import("@supabase/postgrest-js").PostgrestResponseFailure | import("@supabase/postgrest-js").PostgrestResponseSuccess<import("@supabase/postgrest-js").UnstableGetResult<Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"]["Row"], "analytics_events", (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] extends infer T ? T extends (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] ? T extends {
    Relationships: infer R;
} ? R : unknown : never : never, "*">[]> | {
    data: null;
    error: unknown;
}>;
/**
 * Get analytics events for a specific platform
 */
export declare function getEvents(platform: PlatformSlug, userId?: string, limit?: number): Promise<import("@supabase/postgrest-js").UnstableGetResult<Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"]["Row"], "analytics_events", (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] extends infer T ? T extends (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] ? T extends {
    Relationships: infer R;
} ? R : unknown : never : never, "*">[]>;
/**
 * Get analytics events for a specific user
 */
export declare function getUserAnalyticsEvents(userId: string, platform?: PlatformSlug, limit?: number): Promise<import("@supabase/postgrest-js").PostgrestSingleResponse<import("@supabase/postgrest-js").UnstableGetResult<Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any, (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"]["Row"], "analytics_events", (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] extends infer T ? T extends (Database[SchemaName] extends import("@supabase/supabase-js/dist/module/lib/types").GenericSchema ? Database[SchemaName] : any)["Tables"]["analytics_events"] ? T extends {
    Relationships: infer R;
} ? R : unknown : never : never, "*">[]>>;
//# sourceMappingURL=analytics.d.ts.map