/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["flagcdn.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ... other configurations
};

module.exports = nextConfig;
