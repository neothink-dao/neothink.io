import { defineConfig } from 'tsup';
export default defineConfig({
    entry: ['src/index.ts', 'src/providers/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
        'react',
        'react-dom',
        'next',
        '@supabase/supabase-js',
        '@neothink/types'
    ],
});
//# sourceMappingURL=tsup.config.js.map