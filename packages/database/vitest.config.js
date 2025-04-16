import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            reporter: ['text', 'html'],
        },
        include: ['src/**/*.test.ts'],
    },
});
//# sourceMappingURL=vitest.config.js.map