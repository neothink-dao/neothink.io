export type SecurityEventSeverity = 'low' | 'medium' | 'high' | 'critical';
export declare const SecurityEventTypes: {
    readonly RATE_LIMIT_EXCEEDED: "rate_limit_exceeded";
    readonly SUSPICIOUS_ACTIVITY: "suspicious_activity";
    readonly AUTH_FAILURE: "auth_failure";
    readonly CSRF_FAILURE: "csrf_failure";
    readonly INVALID_REQUEST: "invalid_request";
    readonly SECURITY_HEADER_VIOLATION: "security_header_violation";
};
export type SecurityEventType = typeof SecurityEventTypes[keyof typeof SecurityEventTypes];
export interface SecurityEvent {
    event: string;
    severity: SecurityEventSeverity;
    platform_slug?: string;
    user_id?: string;
    ip_address?: string;
    user_agent?: string;
    request_path?: string;
    context?: Record<string, any>;
    details?: Record<string, any>;
    created_at: string;
}
export interface SecurityLog {
    id: string;
    event: string;
    severity: SecurityEventSeverity;
    platform_slug?: string;
    user_id?: string;
    ip_address?: string;
    user_agent?: string;
    request_path?: string;
    context?: Record<string, any>;
    details?: Record<string, any>;
    created_at: string;
}
//# sourceMappingURL=types.d.ts.map