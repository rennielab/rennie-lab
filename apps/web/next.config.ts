import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The lockfile warning at startup is cosmetic — it's caused by a stray
  // package-lock.json in /Users/benrennie/Downloads. Safe to ignore.
};

export default nextConfig;
