import { describe, it, expect } from 'vitest';
import { createPlatformClient } from './index';
describe('createPlatformClient', () => {
    it('should be defined', () => {
        expect(createPlatformClient).toBeTypeOf('function');
    });
    it('should return a client instance for the hub platform', () => {
        const client = createPlatformClient('hub');
        expect(client).toBeDefined();
        expect(typeof client).toBe('object');
        // Optionally, check for known Supabase client methods
        expect(client).toHaveProperty('from');
        expect(client).toHaveProperty('auth');
    });
});
//# sourceMappingURL=createPlatformClient.test.js.map