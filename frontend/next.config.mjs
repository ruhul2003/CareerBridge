/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',   // ← Added this
      },
      {
        protocol: 'https',
        hostname: '**',              // Allow all domains (for development)
      },
    ],
  },
};

export default nextConfig;