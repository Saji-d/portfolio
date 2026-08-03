import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
