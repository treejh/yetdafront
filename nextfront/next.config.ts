import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://yetda.kro.kr/api/:path*", // 백엔드 서버 주소
      },
    ];
  },
  images: {
    domains: ["yetdas3.s3.ap-northeast-2.amazonaws.com"], // S3 이미지 도메인 허용
  },
};

export default nextConfig;
