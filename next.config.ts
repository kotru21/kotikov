import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Playwright and some tools use 127.0.0.1 while `next dev` binds to localhost.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
