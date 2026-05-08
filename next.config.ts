import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.greenweb.org",
      },
    ],
  },
};

export default nextConfig;
