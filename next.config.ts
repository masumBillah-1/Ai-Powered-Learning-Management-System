/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "www.cdmi.in",
      },
      {
        protocol: "https",
        hostname: "cdmi.in",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
    // include both 75 and 92 since some images use quality 92
    qualities: [75, 92],
  },
};

module.exports = nextConfig;

