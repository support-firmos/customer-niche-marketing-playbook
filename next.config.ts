import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data: https://storage.googleapis.com; connect-src 'self' https://openrouter.ai;",
          },
        ],
      },
    ];
  },
  experimental: {
    // Only include if you're using server actions; remove if not needed
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Enable Turbopack explicitly if desired (optional)
    // turbo: {},
  },
};

export default nextConfig;