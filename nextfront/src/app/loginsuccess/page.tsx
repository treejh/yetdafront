"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";

export default function LoginSuccessPage() {
  const router = useRouter();
  const { isLogin, loginUser, setLoginUser } = useGlobalLoginUser();
  const [isLoading, setIsLoading] = useState(true);
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log("LoginSuccess useEffect 실행됨", {
      hasInitialized: hasInitialized.current,
    });

    // 이미 초기화되었다면 실행하지 않음
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    let isCancelled = false;

    const fetchUserInfo = async () => {
      try {
        console.log("fetchUserInfo 시작");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/mypage`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (isCancelled) return; // 컴포넌트가 언마운트되었다면 중단

        if (response.ok) {
          const result = await response.json();
          console.log("fetchUserInfo 성공:", result);
          if (result.data && !isCancelled) {
            setLoginUser(result.data);
          }
        } else {
          console.log("fetchUserInfo 실패, 로그인 페이지로 이동");
          // 로그인 정보가 없으면 로그인 페이지로 리다이렉트
          router.push("/login");
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        if (!isCancelled) {
          router.push("/login");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchUserInfo();

    return () => {
      isCancelled = true;
    };
  }, []); // 의존성 배열을 비워서 한 번만 실행

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isLogin) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* 성공 애니메이션 */}
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
              <svg
                className="w-16 h-16 text-white animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20 mx-auto"></div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            로그인 성공! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            옛다에 오신 것을 환영합니다!
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
          <div className="text-center">
            <div className="mb-8">
              {loginUser.image ? (
                <img
                  src={loginUser.image}
                  alt="프로필"
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {loginUser.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                환영합니다, {loginUser.name}님! 👋
              </h2>
              <p className="text-gray-600 mb-6">{loginUser.email}</p>

              <div className="flex justify-center space-x-4 mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {loginUser.ssoProvider}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg
                    className="w-4 h-4 mr-2"
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
                  {loginUser.role}
                </span>
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    loginUser.userActive === "ACTIVE"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      loginUser.userActive === "ACTIVE"
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }`}
                  ></div>
                  {loginUser.userActive}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-white"
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    프로필 관리
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    개인정보와 계좌정보를 관리하세요
                  </p>
                  <button
                    onClick={() => router.push("/mypage")}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                  >
                    마이페이지로 이동
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    홈으로 이동
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    옛다의 다양한 기능을 경험해보세요
                  </p>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                  >
                    홈으로 이동
                  </button>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-xl mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    알림 확인
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    실시간 알림이 자동으로 연결됩니다
                  </p>
                  <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl text-center font-medium">
                    SSE 연결 활성화됨
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            언제든지 마이페이지에서 개인정보를 수정하실 수 있습니다.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            실시간 알림 기능이 자동으로 활성화되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
