/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  // Turbopack configuration for Next.js 16+
  turbopack: {
    // Empty config to suppress warnings
  },
  typescript: {
    // Skip TypeScript checking during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

