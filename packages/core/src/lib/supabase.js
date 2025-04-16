import { createClient } from '@supabase/supabase-js';
// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Create Supabase client with enhanced security options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'neothink-auth-token', // Custom storage key
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    db: {
        schema: 'public'
    },
    global: {
        headers: {
            'x-application-name': 'neothink-platform',
            'x-application-version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        }
    }
});
// Helper function to get service role client with additional security
export const getServiceRoleClient = () => {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            headers: {
                'x-application-name': 'neothink-platform-service',
                'x-application-version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            }
        }
    });
};
// Type-safe database queries with error handling
export const db = {
    users: supabase.from('users'),
    profiles: supabase.from('profiles'),
    sessions: supabase.from('sessions'),
};
// Enhanced error handling with security logging
export class SupabaseError extends Error {
    constructor(message, code, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'SupabaseError';
        // Log security-relevant errors
        if (code === 'PGRST301' || code === 'PGRST302') {
            console.error('Security violation detected:', { message, code, details });
        }
    }
}
// Rate limiting with enhanced security
export const withRateLimit = async (key, limit, window) => {
    try {
        const { data, error } = await supabase
            .from('rate_limits')
            .select('count, last_updated')
            .eq('key', key)
            .single();
        if (error)
            throw new SupabaseError(error.message, error.code);
        const now = new Date();
        const lastUpdated = (data === null || data === void 0 ? void 0 : data.last_updated) ? new Date(data.last_updated) : null;
        // Reset count if window has passed
        if (lastUpdated && (now.getTime() - lastUpdated.getTime()) > window * 1000) {
            await supabase
                .from('rate_limits')
                .upsert({ key, count: 1, last_updated: now.toISOString() })
                .throwOnError();
            return true;
        }
        if (!data || data.count < limit) {
            await supabase
                .from('rate_limits')
                .upsert({
                key,
                count: ((data === null || data === void 0 ? void 0 : data.count) || 0) + 1,
                last_updated: now.toISOString()
            })
                .throwOnError();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error('Rate limiting error:', error);
        return false; // Fail open in case of errors
    }
};
//# sourceMappingURL=supabase.js.map