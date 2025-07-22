"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";

export default function LoginPage() {
  const router = useRouter();
  const { isLogin } = useGlobalLoginUser();
  // 카카오 로그인 URL
  const socialLoginForKakaoUrl = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao`;

  // const redirectAfterLogin = "https://www.yetda.booktri.site/loginsuccess";

  const redirectAfterLogin = "http://localhost:3000/loginsuccess";

  useEffect(() => {
    // 이미 로그인되어 있으면 메인 페이지로 리다이렉트
    if (isLogin) {
      router.push("/");
    }
  }, [isLogin, router]);

  const handleKakaoLogin = () => {
    // OAuth 로그인은 직접 리다이렉트해야 함
    const loginUrl = `${socialLoginForKakaoUrl}?state=${encodeURIComponent(
      redirectAfterLogin
    )}`;
    console.log("카카오 로그인 URL로 이동:", loginUrl);
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">환영합니다!</h2>
            <p className="text-blue-100">소셜 계정으로 간편하게 로그인하세요</p>
          </div>

          {/* 로그인 섹션 */}
          <div className="px-8 py-8">
            <button
              onClick={handleKakaoLogin}
              className="group relative w-full flex items-center justify-center py-4 px-6 border-2 border-transparent text-lg font-semibold rounded-2xl text-gray-800 bg-gradient-to-r from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
                  </svg>
                </div>
                <span>카카오로 로그인</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                로그인하면 서비스 이용약관 및 개인정보 처리방침에 동의하게
                됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            BookTree에서 새로운 독서 경험을 시작하세요 📚
          </p>
        </div>
      </div>
    </div>
  );
}
