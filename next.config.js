/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ["flagcdn.com"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ... other configurations
};

module.exports = nextConfig;
