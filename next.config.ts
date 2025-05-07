import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
  // Enable CSS source maps
  productionBrowserSourceMaps: true,
};

export default nextConfig;
