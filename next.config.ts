import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    formats: ["image/avif", "image/webp"], // Prioriterer billedformater der giver mindre filstørrelse end JPEG/PNG
    qualities: [85], // Komprimerer billeder til 85% kvalitet
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048], // Breakpoints tilpasset skærmstørrelser
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 800], // Størrelser til mindre billeder som thumbnails
    minimumCacheTTL: 2678400, // Cache optimerede billeder i 31 dage (sekunder) for at reducere serverbelastning
  },
  /* config options here */
};

export default nextConfig;
