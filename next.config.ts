import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: [
    "local-origin.dev",
    "*.local-origin.dev",
    "b25b25c3f2d1.ngrok-free.app",
  ],
};

export default nextConfig;
