import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/ui/*.tsx'
  ],
  format: ['esm', 'cjs'],
  // dts: true, // handled by tsc for types
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'next'],
  tsconfig: './tsconfig.build.json',
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});