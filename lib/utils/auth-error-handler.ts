/**
 * Authentication error handler with improved error messages and logging
 */

// Define error types
export type AuthErrorCode = 
  | 'auth/invalid-email'
  | 'auth/invalid-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-not-verified'
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/too-many-requests'
  | 'auth/unauthorized'
  | 'auth/network-error'
  | 'auth/platform-access-denied'
  | 'auth/subscription-required'
  | 'auth/general-error';

// Define error messages
const errorMessages: Record<AuthErrorCode, string> = {
  'auth/invalid-email': 'The email address is not valid.',
  'auth/invalid-password': 'The password is invalid or the user does not have a password.',
  'auth/email-already-in-use': 'An account already exists with this email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-disabled': 'This user account has been disabled.',
  'auth/user-not-found': 'No user found with this email address.',
  'auth/wrong-password': 'The password is invalid for the given email.',
  'auth/email-not-verified': 'Please verify your email before signing in.',
  'auth/expired-action-code': 'The action code has expired.',
  'auth/invalid-action-code': 'The action code is invalid.',
  'auth/too-many-requests': 'Too many unsuccessful login attempts. Please try again later.',
  'auth/unauthorized': 'You do not have permission to access this resource.',
  'auth/network-error': 'Network error. Please check your connection and try again.',
  'auth/platform-access-denied': 'You do not have access to this platform.',
  'auth/subscription-required': 'A subscription is required to access this platform.',
  'auth/general-error': 'An error occurred. Please try again later.'
};

// Define error actions
export type ErrorAction = 
  | 'SHOW_MESSAGE' 
  | 'REDIRECT' 
  | 'RETRY' 
  | 'CONTACT_SUPPORT' 
  | 'SUBSCRIPTION_UPGRADE';

// Map errors to recommended actions
const errorActions: Partial<Record<AuthErrorCode, ErrorAction>> = {
  'auth/email-not-verified': 'REDIRECT',
  'auth/expired-action-code': 'REDIRECT',
  'auth/invalid-action-code': 'REDIRECT',
  'auth/too-many-requests': 'CONTACT_SUPPORT',
  'auth/platform-access-denied': 'REDIRECT',
  'auth/subscription-required': 'SUBSCRIPTION_UPGRADE'
};

// Log levels
export type LogLevel = 'info' | 'warn' | 'error';

/**
 * Get user-friendly error message from error code or error object
 * @param error Error code or error object
 * @returns User-friendly error message
 */
export function getAuthErrorMessage(error: AuthErrorCode | Error | string): string {
  if (error instanceof Error) {
    // Extract error code from error message if possible
    const errorCode = extractErrorCode(error.message);
    if (errorCode && errorCode in errorMessages) {
      return errorMessages[errorCode as AuthErrorCode];
    }
    return error.message;
  }
  
  // If error is a string but not a known error code
  if (typeof error === 'string' && !(error in errorMessages)) {
    return error;
  }
  
  // Return the error message for the known error code
  return errorMessages[error as AuthErrorCode] || 'An unknown error occurred';
}

/**
 * Extract error code from Supabase error message
 * @param message Error message
 * @returns Error code or null
 */
function extractErrorCode(message: string): AuthErrorCode | null {
  // Common Supabase error patterns
  if (message.includes('Email not confirmed')) {
    return 'auth/email-not-verified';
  }
  if (message.includes('Invalid login credentials')) {
    return 'auth/wrong-password';
  }
  if (message.includes('User already registered')) {
    return 'auth/email-already-in-use';
  }
  // More patterns can be added as needed
  
  return null;
}

/**
 * Get recommended action for an error
 * @param error Error code or error object
 * @returns Recommended action
 */
export function getErrorAction(error: AuthErrorCode | Error | string): ErrorAction {
  let errorCode: AuthErrorCode;
  
  if (error instanceof Error) {
    // Extract error code from error message if possible
    const extractedCode = extractErrorCode(error.message);
    errorCode = extractedCode || 'auth/general-error';
  } else if (typeof error === 'string' && error in errorMessages) {
    errorCode = error as AuthErrorCode;
  } else {
    errorCode = 'auth/general-error';
  }
  
  return errorActions[errorCode] || 'SHOW_MESSAGE';
}

/**
 * Log authentication error to console and/or server
 * @param error Error to log
 * @param context Additional context about the error
 * @param level Log level
 */
export function logAuthError(
  error: AuthErrorCode | Error | string,
  context: Record<string, any> = {},
  level: LogLevel = 'error'
): void {
  const errorMessage = getAuthErrorMessage(error);
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    message: errorMessage,
    originalError: error instanceof Error ? error.message : error,
    ...context
  };
  
  // Console logging
  switch (level) {
    case 'info':
      console.info(`[AUTH][${timestamp}]`, logData);
      break;
    case 'warn':
      console.warn(`[AUTH][${timestamp}]`, logData);
      break;
    case 'error':
    default:
      console.error(`[AUTH][${timestamp}]`, logData);
  }
  
  // Server-side logging (if available)
  logToServer(logData, level).catch(e => 
    console.error('Failed to log to server:', e)
  );
}

/**
 * Send log data to server
 * @param logData Data to log
 * @param level Log level
 */
async function logToServer(
  logData: Record<string, any>,
  level: LogLevel
): Promise<void> {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  try {
    // Send log data to server endpoint
    // This is a simple implementation that can be replaced with a more
    // robust logging solution like Sentry, LogRocket, etc.
    await fetch('/api/logs/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        level,
        data: logData
      }),
      // Don't wait for response to avoid blocking
      keepalive: true
    });
  } catch (error) {
    // Silently fail to avoid disrupting user experience
    console.error('Error sending logs to server:', error);
  }
}

/**
 * Handle authentication error with proper logging and user feedback
 * @param error Error to handle
 * @param context Additional context
 * @returns Object with message and recommended action
 */
export function handleAuthError(
  error: AuthErrorCode | Error | string,
  context: Record<string, any> = {}
): { message: string; action: ErrorAction } {
  // Log the error
  logAuthError(error, context);
  
  // Get user-friendly message
  const message = getAuthErrorMessage(error);
  
  // Get recommended action
  const action = getErrorAction(error);
  
  return { message, action };
} 