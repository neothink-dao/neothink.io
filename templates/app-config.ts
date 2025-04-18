import { z } from 'zod';

// Environment variables schema
export const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  
  // App specific
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.boolean().default(false),
  NEXT_PUBLIC_ENABLE_AI: z.boolean().default(false),
  
  // API endpoints
  NEXT_PUBLIC_API_URL: z.string().url(),
  
  // Authentication
  NEXT_PUBLIC_AUTH_REDIRECT_URL: z.string().url(),
});

// Next.js configuration
export const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['your-domain.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

// TypeScript configuration
export const tsConfig = {
  compilerOptions: {
    target: 'es5',
    lib: ['dom', 'dom.iterable', 'esnext'],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    forceConsistentCasingInFileNames: true,
    noEmit: true,
    esModuleInterop: true,
    module: 'esnext',
    moduleResolution: 'node',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'preserve',
    incremental: true,
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
      '@core/*': ['../../packages/core/src/*'],
      '@ui/*': ['../../packages/ui/src/*'],
      '@database/*': ['../../packages/database/src/*'],
      '@config/*': ['../../packages/config/src/*'],
    },
  },
  include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
  exclude: ['node_modules'],
};

// Vercel deployment configuration
export const vercelConfig = {
  version: 2,
  buildCommand: 'pnpm build',
  installCommand: 'pnpm install',
  outputDirectory: '.next',
  framework: 'nextjs',
  env: {
    NEXT_PUBLIC_APP_URL: 'https://your-app.vercel.app',
    NEXT_PUBLIC_API_URL: 'https://api.your-app.vercel.app',
  },
  regions: ['iad1'], // US East (N. Virginia)
  routes: [
    {
      src: '/api/(.*)',
      dest: '/api/$1',
    },
    {
      src: '/(.*)',
      dest: '/$1',
    },
  ],
}; 