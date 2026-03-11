/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
    // include both 75 and 92 since some images use quality 92
    qualities: [75, 92],
  },
};

module.exports = nextConfig;

