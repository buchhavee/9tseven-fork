import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
    // AVIF first (≈20% smaller than WebP), WebP fallback. Next picks per Accept header.
    formats: ["image/avif", "image/webp"],
    // Allowlist; Next 16 requires this to be explicit. 85 across the site.
    qualities: [85],
    // Cap upper end at 2048 — 3840 is wasteful for this site's hero/product cards on retina.
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048],
    // 800 added so grid cards (sizes="800px") can resolve to a w=800 file at 1x DPR.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 800],
    minimumCacheTTL: 2678400,
  },
  /* config options here */
};

export default nextConfig;
