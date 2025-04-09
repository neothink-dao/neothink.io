import { supabase } from '../database/client';
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
export class Logger implements ILogger {
  private platform: Platform;
  private userId?: string;
  private path?: string;
  private enableConsole: boolean;
  private enableSupabase: boolean;

  constructor(
    platform: Platform,
    options?: {
      userId?: string;
      path?: string;
      enableConsole?: boolean;
      enableSupabase?: boolean;
    }
  ) {
    this.platform = platform;
    this.userId = options?.userId;
    this.path = options?.path;
    this.enableConsole = options?.enableConsole ?? process.env.NODE_ENV === 'development';
    this.enableSupabase = options?.enableSupabase ?? process.env.NODE_ENV === 'production';
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>): void {
    this.log('error', message, context);
  }

  /**
   * Log a message with the specified level
   */
  private async log(level: LogLevel, message: string, context?: Record<string, any>): Promise<void> {
    const timestamp = new Date().toISOString();
    
    const logEntry: LogEntry = {
      level,
      message,
      context,
      platform: this.platform,
      userId: this.userId,
      path: this.path,
      timestamp,
    };

    // Log to console in development
    if (this.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Log to Supabase in production
    if (this.enableSupabase) {
      await this.logToSupabase(logEntry);
    }
  }

  /**
   * Log to console with proper formatting
   */
  private logToConsole(logEntry: LogEntry): void {
    const { level, message, context, platform, userId, path, timestamp } = logEntry;
    
    // Format context for console
    const formattedContext = context ? JSON.stringify(context, null, 2) : '';
    
    // Create console message
    const consoleMessage = [
      `[${timestamp}]`,
      `[${level.toUpperCase()}]`,
      platform ? `[${platform}]` : '',
      userId ? `[User: ${userId.substring(0, 8)}...]` : '',
      path ? `[${path}]` : '',
      message,
      formattedContext ? `\n${formattedContext}` : '',
    ].filter(Boolean).join(' ');
    
    // Log to appropriate console method
    switch (level) {
      case 'debug':
        console.debug(consoleMessage);
        break;
      case 'info':
        console.info(consoleMessage);
        break;
      case 'warn':
        console.warn(consoleMessage);
        break;
      case 'error':
        console.error(consoleMessage);
        break;
    }
  }

  /**
   * Log to Supabase for analytics and error tracking
   */
  private async logToSupabase(logEntry: LogEntry): Promise<void> {
    try {
      // Only log warnings and errors to Supabase to avoid excess data
      if (logEntry.level !== 'warn' && logEntry.level !== 'error') {
        return;
      }
      
      const { level, message, context, platform, userId, path } = logEntry;
      
      // Insert into analytics_events table
      await supabase.from('analytics_events').insert({
        user_id: userId,
        event_name: `log_${level}`,
        platform: platform || 'hub',
        properties: {
          message,
          context,
          path,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      // Fallback to console if Supabase logging fails
      console.error('Failed to log to Supabase:', error);
      console.error('Original log entry:', logEntry);
    }
  }

  /**
   * Set user ID for logging
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Set current path for logging
   */
  setPath(path: string): void {
    this.path = path;
  }
}

/**
 * Create a logger instance for the specified platform
 */
export function createLogger(
  platform: Platform,
  options?: {
    userId?: string;
    path?: string;
    enableConsole?: boolean;
    enableSupabase?: boolean;
  }
): Logger {
  return new Logger(platform, options);
}

/**
 * Performance monitoring helpers
 */

const timers: Record<string, number> = {};

/**
 * Start timing an operation
 */
export function startTimer(label: string): void {
  timers[label] = performance.now();
}

/**
 * End timing an operation and get the duration in ms
 */
export function endTimer(label: string): number {
  if (!timers[label]) {
    console.warn(`Timer "${label}" doesn't exist`);
    return 0;
  }
  
  const duration = performance.now() - timers[label];
  delete timers[label];
  return duration;
}

/**
 * End timing an operation and log it
 */
export function endTimerAndLog(
  label: string,
  logger: Logger,
  options?: { level?: LogLevel; additionalContext?: Record<string, any> }
): number {
  const duration = endTimer(label);
  
  const level = options?.level || 'debug';
  const message = `Operation "${label}" completed in ${duration.toFixed(2)}ms`;
  
  logger[level](message, {
    duration,
    ...options?.additionalContext,
  });
  
  return duration;
} 