export interface SecurityConfig {
    rateLimitRequests: number;
    rateLimitWindowMs: number;
    encryptionKey: string;
    jwtSecret: string;
}
declare class SecurityService {
    private static instance;
    private config;
    private constructor();
    static getInstance(config: SecurityConfig): SecurityService;
    sanitizeUserInput(input: any): any;
    getRateLimiter(): void;
    validateAuthToken(token: string): Promise<boolean>;
    encryptSensitiveData(data: string): string;
    decryptSensitiveData(encryptedData: string): string;
    generateHash(data: string): string;
    generateSecureToken(length?: number): string;
    getSecurityHeaders(): {
        'Strict-Transport-Security': string;
        'X-Frame-Options': string;
        'X-Content-Type-Options': string;
        'Referrer-Policy': string;
        'Content-Security-Policy': string;
        'Permissions-Policy': string;
    };
    private getCSP;
    private getPermissionsPolicy;
    validateDataPrivacy(data: any): boolean;
    logSecurityEvent(event: string, details: any): void;
}
export declare const security: SecurityService;
export {};
//# sourceMappingURL=index.d.ts.map