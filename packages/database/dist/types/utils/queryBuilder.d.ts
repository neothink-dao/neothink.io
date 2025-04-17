import { SupabaseClient } from '@supabase/supabase-js';
import { QueryParams, PaginatedResponse } from '../types/models';
/**
 * NOTE: To avoid deep type instantiation errors with large Supabase schemas,
 * these helpers use SupabaseClient<any> and string for table names.
 * Consumers should cast results as needed for type safety at the app layer.
 */
/**
 * Builds a Supabase query with pagination, filtering and sorting
 * @param client The Supabase client
 * @param table Database table name
 * @param params Query parameters for pagination, filtering and sorting
 * @returns A configured query builder
 */
export declare function buildQuery(client: SupabaseClient<any>, table: string, params?: QueryParams): any;
/**
 * Executes a paginated query and formats response with pagination info
 * @param client The Supabase client
 * @param table Database table name
 * @param params Query parameters for pagination, filtering and sorting
 * @returns Paginated response with data and pagination metadata
 */
export declare function executePagedQuery(client: SupabaseClient<any>, table: string, params?: QueryParams): Promise<PaginatedResponse<any>>;
/**
 * Creates a properly structured filter for array containment
 * @param field The array field to search in
 * @param value The value to search for
 * @returns Properly structured filter object
 */
export declare function arrayContains(field: string, value: string | string[]): Record<string, any>;
/**
 * Creates a properly structured filter for case-insensitive text search
 * @param field The text field to search in
 * @param searchTerm The search term
 * @returns Properly structured filter object
 */
export declare function textSearch(field: string, searchTerm: string): Record<string, any>;
/**
 * Creates a properly structured filter for range queries
 * @param field The field to apply range filter to
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Properly structured filter object
 */
export declare function rangeFilter(field: string, min?: number | string, max?: number | string): Record<string, any>;
/**
 * Creates a properly structured filter for date range queries
 * @param field The date field to filter
 * @param startDate Start date (inclusive)
 * @param endDate End date (inclusive)
 * @returns Properly structured filter object
 */
export declare function dateRangeFilter(field: string, startDate?: string, endDate?: string): Record<string, any>;
