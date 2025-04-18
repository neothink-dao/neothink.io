'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createPlatformClient } from '@neothink/database';
// DEPRECATED: Use PlatformSlug from @neothink/database instead
import { logSecurityEvent } from '../utils/securityLogging';
// Create context
const SecurityContext = createContext(null);
/**
 * Hook to use security features
 */
export function useSecurityProvider() {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurityProvider must be used within a SecurityProvider');
    }
    return context;
}
/**
 * Security Provider Component
 *
 * Provides security context to the application
 */
export function SecurityProvider({ platformSlug, children }) {
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Initialize on mount
    useEffect(() => {
        async function initialize() {
            try {
                await refreshCsrfToken();
                setIsLoading(false);
            }
            catch (err) {
                setError(err.message || 'Failed to initialize security provider');
                setIsLoading(false);
            }
        }
        initialize();
        // Set up CSRF token refresh timer (every 15 minutes)
        const refreshTimer = setInterval(() => {
            refreshCsrfToken();
        }, 15 * 60 * 1000);
        return () => clearInterval(refreshTimer);
    }, [platformSlug]);
    /**
     * Generate a new CSRF token
     */
    async function refreshCsrfToken() {
        try {
            // Generate a random token
            const randomBytes = new Uint8Array(32);
            window.crypto.getRandomValues(randomBytes);
            const token = Array.from(randomBytes)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            // Store in state and sessionStorage
            setCsrfToken(token);
            sessionStorage.setItem('csrf-token', token);
            return token;
        }
        catch (err) {
            setError('Failed to generate CSRF token');
            throw err;
        }
    }
    /**
     * Log a security event from the client side
     */
    async function logClientSideSecurityEvent(event, severity, details) {
        try {
            const supabase = createPlatformClient(platformSlug);
            await logSecurityEvent(supabase, {
                type: event,
                severity,
                userId: undefined, // Optionally set if available
                context: {
                    url: window.location.href,
                    referrer: document.referrer,
                },
                details: details || {}
            });
        }
        catch (err) {
            console.error('Failed to log security event:', err);
        }
    }
    // Context value
    const value = {
        csrfToken,
        refreshCsrfToken,
        logSecurityEvent: logClientSideSecurityEvent,
        isLoading,
        error
    };
    return (<SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>);
}
/**
 * CSRF Token Provider
 *
 * Higher-order component to add CSRF tokens to fetch requests automatically
 */
export function withCsrfProtection(Component) {
    const WithCsrfProtection = (props) => {
        const { csrfToken } = useSecurityProvider();
        // Override fetch to include CSRF token automatically
        useEffect(() => {
            const originalFetch = window.fetch;
            window.fetch = async function (input, init) {
                // Only add CSRF token for same-origin POST/PUT/DELETE/PATCH requests
                if (init && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(init.method || '')) {
                    // Handle URL string or Request object
                    const url = typeof input === 'string' ? new URL(input, window.location.origin) :
                        (input instanceof Request ? new URL(input.url) : input);
                    // Check if same origin
                    if ((typeof input === 'string' && input.startsWith('/')) ||
                        (url instanceof URL && url.origin === window.location.origin)) {
                        // Clone and modify the init object to include CSRF token
                        init = Object.assign(Object.assign({}, init), { headers: Object.assign(Object.assign({}, init.headers), { 'X-CSRF-Token': csrfToken }) });
                    }
                }
                return originalFetch.call(window, input, init);
            };
            // Restore original fetch on unmount
            return () => {
                window.fetch = originalFetch;
            };
        }, [csrfToken]);
        return <Component {...props}/>;
    };
    return WithCsrfProtection;
}
//# sourceMappingURL=useSecurityProvider.js.map