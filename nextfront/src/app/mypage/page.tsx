"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";

type AccountInfo = {
  bank: string;
  account: string;
};

export default function MyPage() {
  const router = useRouter();
  const { isLogin, loginUser, setLoginUser, logout } = useGlobalLoginUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    bank: "",
    account: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // 디버깅을 위한 useEffect 추가 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("accountInfo 상태 변경:", accountInfo);
    }
  }, [accountInfo]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("isEditing 상태 변경:", isEditing);
    }
  }, [isEditing]);

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/mypage`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setLoginUser(result.data);
            setAccountInfo({
              bank: result.data.bank || "",
              account: result.data.account || "",
            });
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [isLogin, router]); // setLoginUser 제거

  const handleLogout = useCallback(() => {
    logout(() => {
      router.push("/");
    });
  }, [logout, router]);

  const handleSaveAccount = useCallback(async () => {
    if (!accountInfo.bank.trim() || !accountInfo.account.trim()) {
      alert("은행명과 계좌번호를 모두 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      console.log("계좌 정보 저장 시도:", accountInfo);
      console.log(
        "API URL:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/mypage/account`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/mypage/account`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(accountInfo),
        }
      );

      console.log("응답 상태:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("저장 성공:", result);

        // 사용자 정보 업데이트
        const updatedUser = { ...loginUser, ...accountInfo };
        setLoginUser(updatedUser);
        setIsEditing(false);
        alert("계좌 정보가 성공적으로 업데이트되었습니다.");
      } else {
        const errorData = await response.text();
        console.error("서버 오류:", response.status, errorData);
        alert(`계좌 정보 업데이트에 실패했습니다. (${response.status})`);
      }
    } catch (error) {
      console.error("계좌 정보 업데이트 실패:", error);
      alert("계좌 정보 업데이트 중 네트워크 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }, [accountInfo, loginUser, setLoginUser]);

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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                마이페이지
              </h1>
              <p className="text-slate-600 mt-2">계정 정보를 관리하세요</p>
            </div>
            <button
              onClick={handleLogout}
              className="group bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>로그아웃</span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 프로필 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 sticky top-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  {loginUser.image ? (
                    <img
                      src={loginUser.image}
                      alt="프로필"
                      className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {loginUser.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2">
                    <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {loginUser.name}
                </h2>
                <p className="text-slate-600 mb-4">{loginUser.email}</p>
                <div className="flex justify-center space-x-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {loginUser.ssoProvider}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {loginUser.role}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 프로필 정보 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl">
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
                <h2 className="text-xl font-bold text-slate-800 ml-4">
                  프로필 정보
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    이름
                  </label>
                  <p className="text-slate-800 font-medium text-lg">
                    {loginUser.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    이메일
                  </label>
                  <p className="text-slate-800 font-medium">
                    {loginUser.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    소셜 로그인
                  </label>
                  <p className="text-slate-800 font-medium">
                    {loginUser.ssoProvider}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    계정 상태
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      loginUser.userActive === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {loginUser.userActive}
                  </span>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    자기소개
                  </label>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-slate-700 leading-relaxed">
                      {loginUser.introduce || "자기소개가 등록되지 않았습니다."}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                    포트폴리오
                  </label>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    {loginUser.portfolioAddress ? (
                      <a
                        href={loginUser.portfolioAddress}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2 group"
                      >
                        <span>{loginUser.portfolioAddress}</span>
                        <svg
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    ) : (
                      <p className="text-slate-500">
                        포트폴리오 주소가 등록되지 않았습니다.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 계좌 정보 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl">
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
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 ml-4">
                    계좌 정보
                  </h2>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      console.log(
                        "수정 버튼 클릭, 현재 로그인 사용자:",
                        loginUser
                      );
                      console.log("현재 계좌 정보:", {
                        bank: loginUser.bank,
                        account: loginUser.account,
                      });

                      // 현재 로그인한 사용자의 계좌 정보로 초기화
                      const initialAccountInfo = {
                        bank: loginUser.bank || "",
                        account: loginUser.account || "",
                      };
                      console.log("초기화할 계좌 정보:", initialAccountInfo);
                      setAccountInfo(initialAccountInfo);
                      setIsEditing(true);
                    }}
                    className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center space-x-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>수정</span>
                    </span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  {/* 테스트 버튼 추가 */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-2">디버깅 정보:</p>
                    <p className="text-xs text-yellow-700">
                      수정 모드: {isEditing ? "ON" : "OFF"}
                    </p>
                    <p className="text-xs text-yellow-700">
                      은행: "{accountInfo.bank}"
                    </p>
                    <p className="text-xs text-yellow-700">
                      계좌: "{accountInfo.account}"
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        console.log("테스트 버튼 클릭");
                        setAccountInfo({
                          bank: "테스트은행",
                          account: "1234567890",
                        });
                      }}
                      className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs"
                    >
                      테스트 값 설정
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      은행
                    </label>
                    <input
                      type="text"
                      value={accountInfo.bank}
                      onChange={(e) => {
                        console.log("은행 입력 변경:", e.target.value);
                        setAccountInfo({
                          ...accountInfo,
                          bank: e.target.value,
                        });
                      }}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                      placeholder="은행명을 입력하세요"
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      현재 값: "{accountInfo.bank}"
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
                      계좌번호
                    </label>
                    <input
                      type="text"
                      value={accountInfo.account}
                      onChange={(e) => {
                        console.log("계좌번호 입력 변경:", e.target.value);
                        setAccountInfo({
                          ...accountInfo,
                          account: e.target.value,
                        });
                      }}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm"
                      placeholder="계좌번호를 입력하세요"
                      autoComplete="off"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      현재 값: "{accountInfo.account}"
                    </p>
                  </div>
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSaveAccount}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                    >
                      {isSaving ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="animate-spin h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>저장 중...</span>
                        </span>
                      ) : (
                        "저장"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        console.log("수정 취소");
                        setIsEditing(false);
                        setAccountInfo({
                          bank: loginUser.bank || "",
                          account: loginUser.account || "",
                        });
                      }}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-slate-500 text-white py-3 px-6 rounded-xl hover:from-gray-600 hover:to-slate-600 disabled:from-gray-400 disabled:to-gray-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      은행
                    </label>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-slate-800 font-medium">
                        {loginUser.bank || "등록된 은행이 없습니다."}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      계좌번호
                    </label>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <p className="text-slate-800 font-medium">
                        {loginUser.account || "등록된 계좌가 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
