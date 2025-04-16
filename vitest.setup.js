import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        pathname: '/',
        query: {},
    }),
}));
// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        pathname: '/',
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));
// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: () => ({
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
            onAuthStateChange: vi.fn(() => ({
                data: { subscription: { unsubscribe: vi.fn() } },
            })),
            signOut: vi.fn(),
        },
    }),
}));
// Set up environment variables needed in tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
// Suppress console warnings/errors in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
beforeAll(() => {
    console.error = (...args) => {
        if (/Warning:/.test(args[0]) ||
            /Error:/.test(args[0]) ||
            /Not implemented:/.test(args[0])) {
            return;
        }
        originalConsoleError(...args);
    };
    console.warn = (...args) => {
        if (/Warning:/.test(args[0])) {
            return;
        }
        originalConsoleWarn(...args);
    };
});
afterAll(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
});
// Cleanup after each test
afterEach(() => {
    cleanup();
});
//# sourceMappingURL=vitest.setup.js.map