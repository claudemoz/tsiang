import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Self-contained server in .next/standalone, used by the Dockerfile.
  output: "standalone",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Images are resized and converted by Cloudinary (data/media.ts), not by the Next server.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
  // Notes used to live at /lab/<note>; they now sit inside their lab, /lab/<lab>/<note>.
  async redirects() {
    const moved = "agent-vpn-paquet-linux|go-grpc-plateforme-vpn";
    return [
      { source: `/lab/:note(${moved})`, destination: "/lab/plateforme-vpn/:note", permanent: true },
      { source: `/en/lab/:note(${moved})`, destination: "/en/lab/plateforme-vpn/:note", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/cv/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400" }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
