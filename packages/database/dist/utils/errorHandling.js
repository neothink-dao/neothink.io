/**
 * Standard error codes for database operations
 */
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["NOT_FOUND"] = "not_found";
    ErrorCode["DUPLICATE"] = "duplicate";
    ErrorCode["PERMISSION_DENIED"] = "permission_denied";
    ErrorCode["INVALID_PAYLOAD"] = "invalid_payload";
    ErrorCode["VALIDATION_ERROR"] = "validation_error";
    ErrorCode["RATE_LIMIT"] = "rate_limit";
    ErrorCode["DATABASE_ERROR"] = "database_error";
    ErrorCode["UNKNOWN_ERROR"] = "unknown_error";
})(ErrorCode || (ErrorCode = {}));
/**
 * Converts a PostgrestError to a standardized ApiError
 * @param error The Postgrest error from Supabase
 * @returns Standardized API error
 */
export function handleDatabaseError(error) {
    if (!error) {
        return {
            code: ErrorCode.UNKNOWN_ERROR,
            message: 'An unknown error occurred'
        };
    }
    // Extract error code and message from PostgrestError
    const { code, message, details } = error;
    // Map Postgres error codes to our standardized error codes
    switch (code) {
        case '23505': // unique_violation
            return {
                code: ErrorCode.DUPLICATE,
                message: 'A record with this information already exists',
                details: cleanErrorDetails(details)
            };
        case '23503': // foreign_key_violation
            return {
                code: ErrorCode.INVALID_PAYLOAD,
                message: 'Referenced record does not exist',
                details: cleanErrorDetails(details)
            };
        case '42P01': // undefined_table
            return {
                code: ErrorCode.NOT_FOUND,
                message: 'The requested resource could not be found',
                details: cleanErrorDetails(details)
            };
        case '42501': // insufficient_privilege
        case '42503': // insufficient_privilege
            return {
                code: ErrorCode.PERMISSION_DENIED,
                message: 'You do not have permission to perform this action',
                details: cleanErrorDetails(details)
            };
        case 'PGRST116': // Row-level security violation
            return {
                code: ErrorCode.PERMISSION_DENIED,
                message: 'Row-level security prevented this operation',
                details: cleanErrorDetails(details)
            };
        default:
            return {
                code: ErrorCode.DATABASE_ERROR,
                message: message || 'An error occurred while accessing the database',
                details: cleanErrorDetails(details)
            };
    }
}
/**
 * Handles any type of error and converts to ApiError
 * @param error Any caught error
 * @returns Standardized ApiError
 */
export function handleError(error) {
    // Handle Supabase PostgrestError
    if (error?.code && typeof error.code === 'string') {
        return handleDatabaseError(error);
    }
    // Handle already formatted ApiError
    if (error?.code && typeof error.code === 'string' && error.message) {
        return error;
    }
    // Handle normal Error objects
    if (error instanceof Error) {
        return {
            code: ErrorCode.UNKNOWN_ERROR,
            message: error.message,
            details: {
                name: error.name,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        };
    }
    // Handle other types
    return {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unknown error occurred',
        details: typeof error === 'object' ? { ...error } : { error }
    };
}
/**
 * Wraps a database call in a try-catch with standardized error handling
 * @param databaseFn Function that performs a database operation
 * @returns Result of the database operation or throws a standardized error
 */
export async function withErrorHandling(databaseFn) {
    try {
        return await databaseFn();
    }
    catch (error) {
        throw handleError(error);
    }
}
/**
 * Cleans error details for public consumption
 * @param details Raw error details
 * @returns Sanitized error details
 */
function cleanErrorDetails(details) {
    if (!details)
        return undefined;
    // If it's a string, return it wrapped in a details object
    if (typeof details === 'string') {
        return { message: details };
    }
    // If it's an object, clean any sensitive information
    if (typeof details === 'object') {
        const cleaned = { ...details };
        // Remove potentially sensitive fields
        delete cleaned.password;
        delete cleaned.secret;
        delete cleaned.token;
        delete cleaned.key;
        return cleaned;
    }
    return undefined;
}
