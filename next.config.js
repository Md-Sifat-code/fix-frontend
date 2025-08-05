/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // allow any domain
      },
    ],
  },
  // ... other configurations
}

module.exports = nextConfig
