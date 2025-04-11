import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
