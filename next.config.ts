import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["lisabeth-irrevocable-predatorily.ngrok-free.dev"],
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
      allowedOrigins: ["lisabeth-irrevocable-predatorily.ngrok-free.dev"],
    },
  },
};

export default nextConfig;
