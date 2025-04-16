import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware, getPlatformFromHost } from './middleware';
import { createPlatformClient } from '@neothink/database';
// Mock Supabase client
vi.mock('@neothink/database', () => ({
    createPlatformClient: vi.fn(() => ({
        from: vi.fn(() => ({
            insert: vi.fn().mockResolvedValue({ data: null, error: null }),
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    gte: vi.fn().mockReturnValue({
                        single: vi.fn().mockResolvedValue({ data: { count: 1 }, error: null })
                    })
                }),
                count: vi.fn().mockReturnValue({
                    eq: vi.fn().mockReturnValue({
                        gte: vi.fn().mockReturnValue({
                            single: vi.fn().mockResolvedValue({ count: 1 })
                        })
                    })
                })
            }),
            delete: vi.fn().mockResolvedValue({ data: null, error: null }),
            update: vi.fn().mockResolvedValue({ data: null, error: null })
        }))
    }))
}));
describe('Security Middleware', () => {
    let mockRequest;
    beforeEach(() => {
        // Create a mock request
        mockRequest = new Request('https://hub.neothink.com/api/test');
        Object.defineProperty(mockRequest, 'nextUrl', {
            get: () => new URL('https://hub.neothink.com/api/test')
        });
        Object.defineProperty(mockRequest, 'ip', {
            get: () => '127.0.0.1'
        });
    });
    describe('getPlatformFromHost', () => {
        it('should detect platform from host', () => {
            expect(getPlatformFromHost('hub.neothink.com')).toBe('hub');
            expect(getPlatformFromHost('ascenders.neothink.com')).toBe('ascenders');
            expect(getPlatformFromHost('immortals.neothink.com')).toBe('immortals');
            expect(getPlatformFromHost('neothinkers.neothink.com')).toBe('neothinkers');
            expect(getPlatformFromHost('unknown.neothink.com')).toBe('hub');
        });
    });
    describe('Security Headers', () => {
        it('should set security headers', async () => {
            const response = await middleware(mockRequest);
            expect(response.headers.get('X-Frame-Options')).toBe('DENY');
            expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
            expect(response.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
            expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block');
            expect(response.headers.get('X-Permitted-Cross-Domain-Policies')).toBe('none');
            expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'");
        });
        it('should set HSTS header in production', async () => {
            const originalEnv = process.env.NODE_ENV;
            process.env.NODE_ENV = 'production';
            const response = await middleware(mockRequest);
            expect(response.headers.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains; preload');
            process.env.NODE_ENV = originalEnv;
        });
    });
    describe('Suspicious Activity Detection', () => {
        it('should detect SQL injection attempts', async () => {
            const sqlRequest = new Request('https://hub.neothink.com/api/test?q=1%27%20OR%201=1--');
            Object.defineProperty(sqlRequest, 'nextUrl', {
                get: () => new URL('https://hub.neothink.com/api/test?q=1%27%20OR%201=1--')
            });
            const response = await middleware(sqlRequest);
            expect(response.status).toBe(403);
        });
        it('should detect XSS attempts', async () => {
            const xssRequest = new Request('https://hub.neothink.com/api/test?q=<script>alert(1)</script>');
            Object.defineProperty(xssRequest, 'nextUrl', {
                get: () => new URL('https://hub.neothink.com/api/test?q=<script>alert(1)</script>')
            });
            const response = await middleware(xssRequest);
            expect(response.status).toBe(403);
        });
        it('should detect path traversal attempts', async () => {
            const pathRequest = new Request('https://hub.neothink.com/api/../../../etc/passwd');
            Object.defineProperty(pathRequest, 'nextUrl', {
                get: () => new URL('https://hub.neothink.com/api/../../../etc/passwd')
            });
            const response = await middleware(pathRequest);
            expect(response.status).toBe(403);
        });
    });
    describe('Rate Limiting', () => {
        it('should rate limit sensitive endpoints', async () => {
            const authRequest = new Request('https://hub.neothink.com/api/auth/login');
            Object.defineProperty(authRequest, 'nextUrl', {
                get: () => new URL('https://hub.neothink.com/api/auth/login')
            });
            Object.defineProperty(authRequest, 'ip', {
                get: () => '127.0.0.1'
            });
            // Mock high request count
            const mockedCreateClient = vi.mocked(createPlatformClient);
            mockedCreateClient.mockImplementationOnce(() => ({
                from: vi.fn(() => ({
                    select: vi.fn().mockReturnValue({
                        count: vi.fn().mockReturnValue({
                            eq: vi.fn().mockReturnValue({
                                gte: vi.fn().mockReturnValue({
                                    single: vi.fn().mockResolvedValue({ count: 101 })
                                })
                            })
                        })
                    })
                }))
            }));
            const response = await middleware(authRequest);
            expect(response.status).toBe(429);
        });
    });
    describe('Static Assets', () => {
        it('should skip middleware for static assets', async () => {
            const staticRequest = new Request('https://hub.neothink.com/_next/static/test.js');
            Object.defineProperty(staticRequest, 'nextUrl', {
                get: () => new URL('https://hub.neothink.com/_next/static/test.js')
            });
            const response = await middleware(staticRequest);
            expect(response.headers.get('X-Frame-Options')).toBeNull();
        });
    });
});
//# sourceMappingURL=middleware.test.js.map