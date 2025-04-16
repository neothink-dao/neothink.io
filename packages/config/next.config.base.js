const { withNx } = require('@nx/next');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const NextFederationPlugin = require('@module-federation/nextjs-mf');

const federationConfig = {
  name: 'host',
  filename: 'static/chunks/remoteEntry.js',
  remotes: {
    hub: `hub@${process.env.HUB_URL}/_next/static/chunks/remoteEntry.js`,
    neothinkers: `neothinkers@${process.env.NEOTHINKERS_URL}/_next/static/chunks/remoteEntry.js`,
    ascenders: `ascenders@${process.env.ASCENDERS_URL}/_next/static/chunks/remoteEntry.js`,
    immortals: `immortals@${process.env.IMMORTALS_URL}/_next/static/chunks/remoteEntry.js`,
  },
  shared: {
    'react': {
      singleton: true,
      requiredVersion: false,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: false,
    },
    '@neothink/ui': {
      singleton: true,
      requiredVersion: false,
    },
    '@neothink/core': {
      singleton: true,
      requiredVersion: false,
    },
  },
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@neothink/ui', '@neothink/core'],
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    serverActions: true,
  },
  images: {
    domains: [process.env.SUPABASE_PROJECT_URL],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(new NextFederationPlugin(federationConfig));
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context && module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              const packageName = match ? match[1] : 'unknown';
              return `lib.${packageName.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          shared: {
            name: 'shared',
            test: /[\\/]packages[\\/]/,
            priority: 20,
          },
        },
      },
    };
    return config;
  },
};

module.exports = () => {
  const plugins = [withNx, withBundleAnalyzer];
  return plugins.reduce((acc, plugin) => plugin(acc), nextConfig);
};