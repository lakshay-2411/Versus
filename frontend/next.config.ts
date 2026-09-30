import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
      },
      {
        hostname: "**.onrender.com",
        protocol: "https",
      },
      {
        hostname: "**.up.railway.app",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
