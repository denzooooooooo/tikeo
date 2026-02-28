/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Transpile packages explicitly — ensures @tikeo/ui uses the same React instance
  transpilePackages: ['@tikeo/ui', '@tikeo/types', '@tikeo/utils'],

  // Limit parallelism to reduce file descriptor usage (fixes EMFILE on macOS)
  webpack: (config, { dev }) => {
    if (dev) {
      config.parallelism = 1;
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: ['**/node_modules', '**/.git'],
      };
    }
    return config;
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  // Output standalone pour optimiser le déploiement
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '192.168.1.134',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.134',
      },
      {
        protocol: 'https',
        hostname: 'tikeo.com',
      },
      {
        protocol: 'https',
        hostname: 'tikeoh.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tikeoh.com',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'commondatastorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // DNS Prefetch for performance
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          
          // Security Headers
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          
          // SEO Headers
          { key: 'Content-Language', value: 'fr-FR' },
          { key: 'robots', value: 'index, follow' },
        ],
      },
      {
        // Static assets caching
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Images caching
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' },
        ],
      },
    ];
  },

  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
    // En production, on pointe vers le VPS Hetzner
    // En développement, on pointe vers localhost
    const backendBase = process.env.NODE_ENV === 'production'
      ? apiUrl.replace('/api/v1', '')
      : 'http://localhost:3001';

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendBase}/api/v1/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${backendBase}/api/v1/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

};

module.exports = nextConfig;

