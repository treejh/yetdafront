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

  const { projects, loading, error } = useProjects({
    projectType: selectedTab,
    sortType: sortType,
    size: 8,
  });

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
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              YEDDA
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              창의적인 프로젝트를 발견하고 공유하는 플랫폼
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                <svg
                  className="w-5 h-5 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  인기 프로젝트
                </span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200/50">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  검증된 품질
                </span>
              </div>
            </div>
          </div>

          {isLogin && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 shadow-lg w-full max-w-4xl">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-green-800 mb-1">
                    환영합니다! 🎉
                  </h2>
                  <p className="text-green-700">
                    {loginUser.name}님이 성공적으로 로그인하셨습니다.
                  </p>
                </div>
                <Link
                  href="/mypage"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
                >
                  마이페이지 →
                </Link>
              </div>
            </div>
          )}

          {/* 프로젝트 섹션 */}
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                인기 프로젝트
              </h2>
              <p className="text-gray-600">
                커뮤니티에서 가장 사랑받는 프로젝트들을 만나보세요
              </p>
            </div>

            {/* 필터 탭 */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex bg-white rounded-xl p-2 shadow-lg border border-gray-200/50">
                {(["ALL"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedTab === tab
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "ALL"
                      ? "전체"
                      : tab === "BOOK"
                      ? "북"
                      : tab === "WEB"
                      ? "웹"
                      : "앱"}
                  </button>
                ))}
              </div>

              <div className="flex bg-white rounded-xl p-2 shadow-lg border border-gray-200/50">
                {(["LIKE", "ACHIVEMENT_RATE", "SELLING_AMOUNT"] as const).map(
                  (sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortType(sort)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                        sortType === sort
                          ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {sort === "LIKE"
                        ? "좋아요순"
                        : sort === "ACHIVEMENT_RATE"
                        ? "달성률순"
                        : "금액순"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects &&
                  projects.map((project) => (
                    <div
                      key={project.id}
                      className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      {/* 프로젝트 이미지 */}
                      <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 overflow-hidden relative">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-12 h-12 text-gray-400"
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
                        )}
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                            #{project.id}
                          </div>
                        </div>
                      </div>

                      {/* 프로젝트 정보 */}
                      <div className="space-y-3">
                        <h3 className="font-bold text-gray-800 text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {project.introduce || "프로젝트 설명이 없습니다."}
                        </p>

                        {/* 작성자 */}
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {project.hostName}
                        </div>

                        {/* 통계 */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center text-red-500">
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {project.projectLikeCount}
                            </div>
                            <div className="flex items-center text-green-500">
                              <svg
                                className="w-4 h-4 mr-1"
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
                              {project.achievementRate}%
                            </div>
                            {project.sellingAmount > 0 && (
                              <div className="flex items-center text-blue-500">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                {project.sellingAmount.toLocaleString()}원
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

                        {/* 프로젝트 타입 태그 */}
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full">
                            #{project.projectType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* 더보기 버튼 */}
            {projects && projects.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium">
                  더 많은 프로젝트 보기
                </button>
              </div>
            )}
          </div>

          <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
            <li className="mb-2 tracking-[-.01em]">
              Get started by editing{" "}
              <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
                src/app/page.tsx
              </code>
              .
            </li>
            <li className="tracking-[-.01em]">
              Save and see your changes instantly.
            </li>
          </ol>

          {/* 푸터 */}
          <footer className="flex gap-[24px] flex-wrap items-center justify-center py-8">
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/file.svg"
                alt="File icon"
                width={16}
                height={16}
              />
              Learn
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/window.svg"
                alt="Window icon"
                width={16}
                height={16}
              />
              Examples
            </a>
            <a
              className="flex items-center gap-2 hover:underline hover:underline-offset-4"
              href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                aria-hidden
                src="/globe.svg"
                alt="Globe icon"
                width={16}
                height={16}
              />
              Go to nextjs.org →
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
