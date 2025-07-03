
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Remove TypeScript specific options
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      { // Added pattern for encrypted-tbn0.gstatic.com
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      { // Added pattern for avatar.vercel.sh (used for avatars)
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
