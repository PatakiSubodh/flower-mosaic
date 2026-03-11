import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingExcludes: {
    "*": [
      "./public/tiles/**/*",
      "./public/flowers-original/**/*"
    ]
  },
  serverExternalPackages: ["sharp"]
};


export default nextConfig;