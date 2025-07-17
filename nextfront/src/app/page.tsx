"use client";

import Image from "next/image";
import Link from "next/link";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";
import { useProjects } from "@/hooks/useProjects";
import { useState } from "react";

export default function Home() {
  const { isLogin, loginUser, logout } = useGlobalLoginUser();
  const [selectedTab, setSelectedTab] = useState<
    "ALL" | "BOOK" | "WEB" | "APP"
  >("ALL");
  const [sortType, setSortType] = useState<
    "LIKE" | "ACHIVEMENT_RATE" | "SELLING_AMOUNT"
  >("LIKE");
  const [currentPage, setCurrentPage] = useState(0);

  const { projects, loading, error, totalElements } = useProjects({
    projectType: selectedTab,
    sortType: sortType,
    page: currentPage,
    size: 8,
  });

  const totalPages = Math.ceil(totalElements / 8);

  // 필터나 정렬이 변경되면 첫 페이지로 이동
  const handleTabChange = (tab: "ALL" | "BOOK" | "WEB" | "APP") => {
    setSelectedTab(tab);
    setCurrentPage(0);
  };

  const handleSortChange = (
    sort: "LIKE" | "ACHIVEMENT_RATE" | "SELLING_AMOUNT"
  ) => {
    setSortType(sort);
    setCurrentPage(0);
  };

  const handleLogout = () => {
    logout(() => {
      // 로그아웃 후 홈페이지에 머물기
    });
  };

  return (
    <div className="font-sans min-h-screen relative">
      {/* 배경 그라데이션 오버레이 */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10"></div>

      {/* 네비게이션 바 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-4 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            📚 YEDDA
          </Link>
          <div className="flex items-center space-x-6">
            {isLogin ? (
              <>
                <div className="flex items-center space-x-3">
                  {loginUser.image && (
                    <img
                      src={loginUser.image}
                      alt="프로필"
                      className="w-8 h-8 rounded-full border-2 border-blue-200"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {loginUser.name}님
                  </span>
                </div>
                <Link
                  href="/project/create"
                  className="text-green-600 hover:text-green-800 font-medium px-4 py-2 rounded-lg hover:bg-green-50 transition-all duration-200"
                >
                  프로젝트 생성
                </Link>
                <Link
                  href="/mypage"
                  className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-medium"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 메인 컨테이너 */}
      <div className="container mx-auto px-4 py-8">
        <main className="flex flex-col gap-[32px] items-center pt-20">
          {/* 히어로 섹션 */}
          <div className="relative text-center mb-20 max-w-6xl mx-auto">
            {/* 배경 장식 요소 */}
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50 mb-8">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  크라우드 펀딩 플랫폼
                </span>
              </div>

              <h1 className="text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  YEDDA
                </span>
              </h1>

              <p className="text-2xl text-gray-700 mb-4 font-light">
                창의적인 프로젝트를 발견하고 지원하는
              </p>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                아이디어를 현실로 만드는 크라우드 펀딩 플랫폼
              </p>

              {!isLogin && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                  <Link
                    href="/login"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                  >
                    지금 시작하기 →
                  </Link>
                  <div className="text-sm text-gray-500">
                    이미 계정이 있으신가요?{" "}
                    <Link
                      href="/login"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      로그인
                    </Link>
                  </div>
                </div>
              )}

              {/* 통계 카드들 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    500+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    성공한 프로젝트
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    1.2M+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    누적 펀딩 금액
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    10K+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    활성 사용자
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isLogin && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-2 border-green-200/50 rounded-3xl p-8 mb-16 shadow-xl w-full max-w-5xl">
              {/* 배경 패턴 */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-300/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-green-300/20 rounded-full translate-y-12 -translate-x-12"></div>

              <div className="relative z-10 flex items-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-green-800">
                      환영합니다! 🎉
                    </h2>
                    <div className="px-3 py-1 bg-green-500/20 text-green-700 text-xs font-medium rounded-full">
                      프리미엄 멤버
                    </div>
                  </div>
                  <p className="text-green-700 text-lg mb-4">
                    {loginUser.name}님, 오늘도 멋진 프로젝트를 만나보세요!
                  </p>
                  <div className="flex items-center gap-6 text-sm text-green-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>새로운 프로젝트 알림</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>맞춤 추천 준비완료</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/project/create"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                  >
                    📝 프로젝트 생성
                  </Link>
                  <Link
                    href="/mypage"
                    className="bg-white/80 backdrop-blur-sm text-green-700 px-6 py-3 rounded-xl hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium border border-green-200"
                  >
                    마이페이지 →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 프로젝트 섹션 */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                인기 프로젝트 모음
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                지금
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HOT
                </span>
                한 프로젝트
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                커뮤니티에서 가장 사랑받는 혁신적인 프로젝트들을 만나보세요
              </p>
            </div>

            {/* 개선된 필터 탭 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-200/50">
                {(["ALL", "BOOK", "WEB", "APP"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedTab === tab
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80"
                    }`}
                  >
                    {tab === "ALL"
                      ? "🌟 전체"
                      : tab === "BOOK"
                      ? "📚 북"
                      : tab === "WEB"
                      ? "💻 웹"
                      : "📱 앱"}
                  </button>
                ))}
              </div>

              <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-gray-200/50">
                {(["LIKE", "ACHIVEMENT_RATE", "SELLING_AMOUNT"] as const).map(
                  (sort) => (
                    <button
                      key={sort}
                      onClick={() => handleSortChange(sort)}
                      className={`px-5 py-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
                        sortType === sort
                          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform scale-105"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50/80"
                      }`}
                    >
                      {sort === "LIKE"
                        ? "❤️ 좋아요순"
                        : sort === "ACHIVEMENT_RATE"
                        ? "🎯 달성률순"
                        : "💰 금액순"}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 프로젝트 목록 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 animate-pulse"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  프로젝트를 불러올 수 없습니다
                </h3>
                <p className="text-gray-600">{error}</p>
              </div>
            ) : !projects || projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  프로젝트가 없습니다
                </h3>
                <p className="text-gray-600">아직 등록된 프로젝트가 없어요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {projects &&
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="group relative bg-white/90 rounded-3xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 will-change-transform hover:translate-y-[-8px] hover:scale-[1.02]"
                      style={{
                        transform: "translateZ(0)",
                        contain: "layout style paint",
                      }}
                    >
                      {/* 프로젝트 이미지 */}
                      <div className="relative w-full h-52 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-2xl mb-6 overflow-hidden">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            style={{ transform: "translateZ(0)" }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                              </svg>
                            </div>
                          </div>
                        )}

                        {/* 오버레이 그라데이션 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                        {/* 프로젝트 ID 뱃지 */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/95 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-md">
                            #{project.id}
                          </div>
                        </div>

                        {/* 프로젝트 타입 뱃지 */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
                            {project.projectType}
                          </div>
                        </div>
                      </div>

                      {/* 프로젝트 정보 */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-xl line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {project.title}
                        </h3>

                        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                          {project.introduce ||
                            "혁신적인 아이디어로 세상을 바꿔나가는 프로젝트입니다."}
                        </p>

                        {/* 작성자 */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="font-medium">
                            {project.hostName}
                          </span>
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">달성률</span>
                            <span className="font-bold text-blue-600">
                              {project.achievementRate}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
                              style={{
                                width: `${Math.min(
                                  project.achievementRate,
                                  100
                                )}%`,
                                transform: "translateZ(0)",
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* 통계 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-red-500">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-sm font-medium">
                                {project.projectLikeCount}
                              </span>
                            </div>

                            {project.sellingAmount > 0 && (
                              <div className="flex items-center gap-1 text-green-500">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="text-sm font-medium">
                                  {project.sellingAmount.toLocaleString()}원
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="text-gray-400 text-xs">
                            {project.projectEndDate
                              ? new Date(
                                  project.projectEndDate
                                ).toLocaleDateString()
                              : "진행중"}
                          </div>
                        </div>

                        {/* 호버 시 나타나는 버튼 */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            href={`/project/${project.id}`}
                            className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-colors duration-200 shadow-md text-center"
                          >
                            자세히 보기 →
                          </Link>
                        </div>
                      </div>

                      {/* 카드 테두리 그라데이션 효과 제거 - 성능 최적화 */}
                    </div>
                  ))}
              </div>
            )}

            {/* 페이지네이션 */}
            {projects && projects.length > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center mt-16 space-y-6">
                <div className="flex items-center space-x-3">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-colors duration-200"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* 페이지 번호들 */}
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const maxVisiblePages = 5;
                      let startPage = Math.max(
                        0,
                        currentPage - Math.floor(maxVisiblePages / 2)
                      );
                      let endPage = Math.min(
                        totalPages - 1,
                        startPage + maxVisiblePages - 1
                      );

                      if (endPage - startPage < maxVisiblePages - 1) {
                        startPage = Math.max(0, endPage - maxVisiblePages + 1);
                      }

                      const pages = [];

                      // 첫 페이지가 표시되지 않으면 추가
                      if (startPage > 0) {
                        pages.push(
                          <button
                            key={0}
                            onClick={() => setCurrentPage(0)}
                            className="w-12 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-colors duration-200 font-semibold"
                          >
                            1
                          </button>
                        );
                        if (startPage > 1) {
                          pages.push(
                            <span
                              key="ellipsis1"
                              className="px-2 text-gray-400 font-bold"
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      // 현재 범위의 페이지들
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`w-12 h-12 rounded-xl border-2 transition-colors duration-200 font-semibold ${
                              currentPage === i
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg"
                                : "border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      }

                      // 마지막 페이지가 표시되지 않으면 추가
                      if (endPage < totalPages - 1) {
                        if (endPage < totalPages - 2) {
                          pages.push(
                            <span
                              key="ellipsis2"
                              className="px-2 text-gray-400 font-bold"
                            >
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages - 1}
                            onClick={() => setCurrentPage(totalPages - 1)}
                            className="w-12 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent transition-colors duration-200 font-semibold"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white hover:border-transparent disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-colors duration-200"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* 페이지 정보 */}
                <div className="bg-white/80 rounded-2xl px-6 py-3 shadow-md border border-gray-200/50">
                  <span className="text-sm font-medium text-gray-700">
                    {currentPage * 8 + 1}-
                    {Math.min((currentPage + 1) * 8, totalElements)} /{" "}
                    {totalElements}개 프로젝트
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <footer className="mt-20 text-center py-12 border-t border-gray-200/50">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Link
                  href="/"
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                >
                  📚 YEDDA
                </Link>
                <p className="text-gray-600 mt-2">
                  혁신적인 아이디어를 현실로 만드는 크라우드 펀딩 플랫폼
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">서비스</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>프로젝트 탐색</div>
                    <div>펀딩 참여</div>
                    <div>프로젝트 생성</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">지원</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>고객센터</div>
                    <div>이용가이드</div>
                    <div>FAQ</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">회사</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>회사소개</div>
                    <div>이용약관</div>
                    <div>개인정보처리방침</div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 border-t border-gray-200/50 pt-6">
                © 2024 YEDDA. All rights reserved.
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
