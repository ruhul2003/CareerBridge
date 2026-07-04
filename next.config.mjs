/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**', // ** mane dynamic placeholder links allow kora holo
      },
    ],
  },
};

export default nextConfig;