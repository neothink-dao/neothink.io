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
    'zod'
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
      },
    };
    return config;
  }
}

export default nextConfig
