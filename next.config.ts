import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
  },
  async redirects() {
    return [
      {
        source: "/work/:path*",
        destination: "/projects/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
