import type { NextConfig } from "next";

const NEW_RESUME = "/Sajidur_Rahman_Sajid_Resume.pdf";
const NO_STORE = { key: "Cache-Control", value: "no-store, max-age=0" };

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 100],
  },
  experimental: {
    optimizePackageImports: ["motion", "lucide-react"],
  },
  async redirects() {
    return [
      {
        source: "/work/:path*",
        destination: "/projects/:path*",
        permanent: true,
      },
      // The resume used to live at two URLs. Keep both working for old links
      // (LinkedIn Featured, emails, CVs) but always forward to the current file.
      // Temporary redirects so browsers never pin the old location.
      { source: "/resume.pdf", destination: NEW_RESUME, permanent: false },
      { source: "/Sajidur_Rahman_Sajid.pdf", destination: NEW_RESUME, permanent: false },
    ];
  },
  async headers() {
    return [
      // Never serve a stale resume from a browser or CDN cache.
      { source: NEW_RESUME, headers: [NO_STORE] },
      { source: "/resume.pdf", headers: [NO_STORE] },
      { source: "/Sajidur_Rahman_Sajid.pdf", headers: [NO_STORE] },
      // Static portfolio images: cache for a day and refresh in the background.
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
