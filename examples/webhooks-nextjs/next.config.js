/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    livekitApiKey: 'your-api-key',
    livekitApiSecret: 'your-api-secret',
  },
};

module.exports = nextConfig;
