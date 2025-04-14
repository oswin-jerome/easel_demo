import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  output: "standalone", // For Docker
  images: {
    unoptimized: true, // Skips server-side image optimization in Docker
  },
};

export default nextConfig;
