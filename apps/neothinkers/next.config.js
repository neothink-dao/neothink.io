/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@neothink/ui',
    '@neothink/auth',
    '@neothink/database',
    '@neothink/types',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'joinneothinkers.org'],
    },
  },
};

module.exports = nextConfig; 