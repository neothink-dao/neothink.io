import { PostgrestError } from '@supabase/supabase-js';
import { ApiError } from '../types/models';
/**
 * Standard error codes for database operations
 */
export declare enum ErrorCode {
    NOT_FOUND = "not_found",
    DUPLICATE = "duplicate",
    PERMISSION_DENIED = "permission_denied",
    INVALID_PAYLOAD = "invalid_payload",
    VALIDATION_ERROR = "validation_error",
    RATE_LIMIT = "rate_limit",
    DATABASE_ERROR = "database_error",
    UNKNOWN_ERROR = "unknown_error"
}
/**
 * Converts a PostgrestError to a standardized ApiError
 * @param error The Postgrest error from Supabase
 * @returns Standardized API error
 */
export declare function handleDatabaseError(error: PostgrestError | null): ApiError;
/**
 * Handles any type of error and converts to ApiError
 * @param error Any caught error
 * @returns Standardized ApiError
 */
export declare function handleError(error: any): ApiError;
/**
 * Wraps a database call in a try-catch with standardized error handling
 * @param databaseFn Function that performs a database operation
 * @returns Result of the database operation or throws a standardized error
 */
export declare function withErrorHandling<T>(databaseFn: () => Promise<T>): Promise<T>;
