/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  transpilePackages: [
    '@supabase/ssr',
    '@supabase/supabase-js',
    'zod',
    '@swc/core',
    '@swc/helpers'
  ],
  webpack: (config, { isServer }) => {
    // Ensure modules are resolved correctly
    config.resolve = {
      ...config.resolve,
      modules: ['node_modules', '.'],
      fallback: {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    };

    // Add the monorepo root to the module resolution paths
    config.resolve.modules.push(process.cwd() + '/../..');

    return config;
  }
}

export default nextConfig
