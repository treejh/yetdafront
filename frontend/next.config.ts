import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["yetdas3.s3.ap-northeast-2.amazonaws.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
