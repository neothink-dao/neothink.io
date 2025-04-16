import { Platform } from '@neothink/types';
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogEntry = {
    level: LogLevel;
    message: string;
    context?: Record<string, any>;
    platform?: Platform;
    userId?: string;
    path?: string;
    timestamp?: string;
};
interface ILogger {
    debug(message: string, context?: Record<string, any>): void;
    info(message: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    error(message: string, context?: Record<string, any>): void;
}
/**
 * Logger class that supports both console and Supabase logging
 */
export declare class Logger implements ILogger {
    private platform;
    private userId?;
    private path?;
    private enableConsole;
    private enableSupabase;
    constructor(platform: Platform, options?: {
        userId?: string;
        path?: string;
        enableConsole?: boolean;
        enableSupabase?: boolean;
    });
    /**
     * Log a debug message
     */
    debug(message: string, context?: Record<string, any>): void;
    /**
     * Log an info message
     */
    info(message: string, context?: Record<string, any>): void;
    /**
     * Log a warning message
     */
    warn(message: string, context?: Record<string, any>): void;
    /**
     * Log an error message
     */
    error(message: string, context?: Record<string, any>): void;
    /**
     * Log a message with the specified level
     */
    private log;
    /**
     * Log to console with proper formatting
     */
    private logToConsole;
    /**
     * Log to Supabase for analytics and error tracking
     */
    private logToSupabase;
    /**
     * Set user ID for logging
     */
    setUserId(userId: string): void;
    /**
     * Set current path for logging
     */
    setPath(path: string): void;
}
/**
 * Create a logger instance for the specified platform
 */
export declare function createLogger(platform: Platform, options?: {
    userId?: string;
    path?: string;
    enableConsole?: boolean;
    enableSupabase?: boolean;
}): Logger;
/**
 * Start timing an operation
 */
export declare function startTimer(label: string): void;
/**
 * End timing an operation and get the duration in ms
 */
export declare function endTimer(label: string): number;
/**
 * End timing an operation and log it
 */
export declare function endTimerAndLog(label: string, logger: Logger, options?: {
    level?: LogLevel;
    additionalContext?: Record<string, any>;
}): number;
export {};
//# sourceMappingURL=index.d.ts.map