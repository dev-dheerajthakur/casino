import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: [
    "10.177.124.6",
    "localhost",
    "172.22.106.6",
    "10.227.38.88",
    "10.58.182.6"
  ],
};

export default nextConfig;
