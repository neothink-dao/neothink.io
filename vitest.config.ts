import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/vitest.config.ts'],
    },
  },
  resolve: {
    alias: {
      '@neothink/database': resolve(__dirname, './packages/database/src'),
      '@neothink/auth': resolve(__dirname, './packages/auth/src'),
      '@neothink/ui': resolve(__dirname, './packages/ui/src'),
      '@neothink/types': resolve(__dirname, './packages/types/src'),
    },
  },
}); 