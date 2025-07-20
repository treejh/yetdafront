import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://yetda.kro.kr/api/:path*", // 백엔드 서버 주소
      },
    ];
  },
  images: {
    domains: [
      "yetdas3.s3.ap-northeast-2.amazonaws.com", // S3 이미지 도메인 허용
      "booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com", // 추가 S3 도메인
    ],
  },
  eslint: {
    // 빌드 중에 ESLint 검사를 건너뜁니다
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 체크를 실행하지 않음
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
