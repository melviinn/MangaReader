import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // domains: ["uploads.mangadex.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
