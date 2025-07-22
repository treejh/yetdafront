"use client";

import { useParams, useRouter } from "next/navigation";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";
import Link from "next/link";
import { useState, useEffect } from "react";

// 타입 정의
interface PurchaseOption {
  title: string;
  content: string;
  price: number;
  fileUrl: string | null;
  optionStatus: "AVAILABLE" | "UNAVAILABLE";
  providingMethod: "DOWNLOAD" | "EMAIL";
  purchaseOptionId: number;
}

interface ProjectDetail {
  purchaseOptions: PurchaseOption[];
  projectCount: number;
  followerCount: number;
  projectId: number;
  title: string;
  introduce: string;
  content: string;
  gitAddress: string | null;
  purchaseCategoryId: number;
  purchaseCategoryName: string;
  averageDeliveryTime: string;
  contentImageUrls: string[];
  userId: number;
  name: string;
  userProfileImage: string | null;
  userIntroduce: string;
  email: string;
}

// 커스텀 훅
const useProjectDetail = (projectId: string) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/${projectId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("프로젝트를 찾을 수 없습니다.");
          } else if (response.status === 403) {
            throw new Error("접근 권한이 없습니다.");
          } else {
            throw new Error("프로젝트 정보를 불러오는데 실패했습니다.");
          }
        }

        const data = await response.json();

        if (data.statusCode === 200) {
          setProject(data.data);
        } else {
          throw new Error(
            data.message || "프로젝트 정보를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("프로젝트 상세 정보 조회 실패:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [projectId]);

  return { project, loading, error };
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { isLogin } = useGlobalLoginUser();
  const { project, loading, error } = useProjectDetail(projectId);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 키보드 네비게이션 추가
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!project?.contentImageUrls || project.contentImageUrls.length <= 1)
        return;

      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) =>
          prev === 0 ? project.contentImageUrls.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) =>
          prev === project.contentImageUrls.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [project?.contentImageUrls]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="h-80 bg-gray-200 rounded-2xl"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
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
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            프로젝트를 찾을 수 없습니다
          </h3>
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handlePurchase = (optionId: number) => {
    if (!isLogin) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    setSelectedOption(optionId);
    // TODO: 구매 로직 구현
    alert("구매 기능은 추후 구현될 예정입니다.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 네비게이션 */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 px-4 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            📚 YEDDA
          </Link>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            ← 돌아가기
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 브레드크럼 */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600">
              홈
            </Link>
            <span>›</span>
            <span className="text-gray-800">{project.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* 왼쪽: 프로젝트 정보 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 프로젝트 이미지 캐러셀 */}
              <div className="relative">
                {project.contentImageUrls &&
                project.contentImageUrls.length > 0 ? (
                  <div className="relative">
                    {/* 메인 이미지 */}
                    <div className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={project.contentImageUrls[currentImageIndex]}
                        alt={`${project.title} 이미지 ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* 이미지 개수가 2개 이상일 때만 네비게이션 버튼 표시 */}
                      {project.contentImageUrls.length > 1 && (
                        <>
                          {/* 이전 버튼 */}
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === 0
                                  ? project.contentImageUrls.length - 1
                                  : currentImageIndex - 1
                              )
                            }
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            <svg
                              className="w-6 h-6"
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

                          {/* 다음 버튼 */}
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex ===
                                  project.contentImageUrls.length - 1
                                  ? 0
                                  : currentImageIndex + 1
                              )
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                          >
                            <svg
                              className="w-6 h-6"
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

                          {/* 이미지 인디케이터 */}
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                            {project.contentImageUrls.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  index === currentImageIndex
                                    ? "bg-white shadow-lg scale-125"
                                    : "bg-white/50 hover:bg-white/80"
                                }`}
                              />
                            ))}
                          </div>

                          {/* 이미지 카운터 */}
                          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {currentImageIndex + 1} /{" "}
                            {project.contentImageUrls.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* 썸네일 갤러리 (이미지가 2개 이상일 때) */}
                    {project.contentImageUrls.length > 1 && (
                      <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                        {project.contentImageUrls.map(
                          (imageUrl: string, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                index === currentImageIndex
                                  ? "border-blue-500 shadow-lg scale-105"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <img
                                src={imageUrl}
                                alt={`썸네일 ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">
                        이미지가 없습니다
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 프로젝트 제목 및 기본 정보 */}
              <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-gray-200/50">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                      {project.title}
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {project.introduce}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {project.purchaseCategoryName}
                  </div>
                </div>

                {/* 통계 */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {project.projectCount}
                    </div>
                    <div className="text-sm text-gray-600">총 프로젝트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {project.followerCount}
                    </div>
                    <div className="text-sm text-gray-600">팔로워</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {project.averageDeliveryTime}
                    </div>
                    <div className="text-sm text-gray-600">배송 시간</div>
                  </div>
                </div>
              </div>

              {/* 프로젝트 상세 내용 */}
              <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  프로젝트 소개
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.content}
                  </p>
                </div>

                {project.gitAddress && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-800 mb-2">
                      GitHub 저장소
                    </h3>
                    <a
                      href={project.gitAddress}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {project.gitAddress}
                    </a>
                  </div>
                )}
              </div>

              {/* 작성자 정보 */}
              <div className="bg-white/80 rounded-3xl p-8 shadow-lg border border-gray-200/50">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  작성자 정보
                </h2>
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    {project.userProfileImage ? (
                      <img
                        src={project.userProfileImage}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {project.userIntroduce}
                    </p>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">이메일:</span>{" "}
                      {project.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 구매 옵션 */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white/80 rounded-3xl p-6 shadow-lg border border-gray-200/50">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    구매 옵션
                  </h2>

                  {project.purchaseOptions &&
                  project.purchaseOptions.length > 0 ? (
                    <div className="space-y-4">
                      {project.purchaseOptions.map((option: PurchaseOption) => (
                        <div
                          key={option.purchaseOptionId}
                          className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                            selectedOption === option.purchaseOptionId
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() =>
                            setSelectedOption(option.purchaseOptionId)
                          }
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-bold text-gray-800">
                              {option.title}
                            </h3>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">
                                {option.price.toLocaleString()}원
                              </div>
                              <div
                                className={`text-xs px-2 py-1 rounded-full ${
                                  option.optionStatus === "AVAILABLE"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                              >
                                {option.optionStatus === "AVAILABLE"
                                  ? "구매가능"
                                  : "품절"}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3">
                            {option.content}
                          </p>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span
                              className={`px-2 py-1 rounded-full ${
                                option.providingMethod === "DOWNLOAD"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {option.providingMethod === "DOWNLOAD"
                                ? "📥 다운로드"
                                : "📧 이메일"}
                            </span>
                            {option.fileUrl && (
                              <span className="text-green-600">파일 제공</span>
                            )}
                          </div>
                        </div>
                      ))}

                      {selectedOption && (
                        <button
                          onClick={() => handlePurchase(selectedOption)}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          구매하기
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500">구매 옵션이 없습니다</p>
                    </div>
                  )}
                </div>

                {/* 문의하기 */}
                <div className="bg-white/80 rounded-3xl p-6 shadow-lg border border-gray-200/50">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    문의하기
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    프로젝트에 대한 궁금한 점이 있으시면 언제든 문의해주세요.
                  </p>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                    작성자에게 문의
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
