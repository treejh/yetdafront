"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";
import { useImageManager } from "@/hooks/useImageManager";
import { usePurchaseOptions, PurchaseOption } from "@/hooks/usePurchaseOptions";
import Image from "next/image";

interface ProjectFormData {
  projectType: "PURCHASE";
  title: string;
  introduce: string;
  content: string;
  field: string;
  pricingPlanId: number;
  purchaseDetail: {
    gitAddress: string;
    purchaseCategoryId: number;
    getAverageDeliveryTime: string;
    purchaseOptionList: PurchaseOption[];
  };
}

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLogin, loginUser } = useGlobalLoginUser();
  const [isLoading, setIsLoading] = useState(false);
  const [optionFiles, setOptionFiles] = useState<File[]>([]);

  // 커스텀 훅들
  const {
    contentImages,
    imagePreviews,
    contentImageRef,
    handleContentImageChange,
    removeContentImage,
    triggerContentImageUpload,
  } = useImageManager();

  const { purchaseOptions, addOption, removeOption, updateOption } =
    usePurchaseOptions();

  const [formData, setFormData] = useState<ProjectFormData>({
    projectType: "PURCHASE",
    title: "",
    introduce: "",
    content: "",
    field: "",
    pricingPlanId: 1,
    purchaseDetail: {
      gitAddress: "",
      purchaseCategoryId: 0,
      getAverageDeliveryTime: "",
      purchaseOptionList: [],
    },
  });

  // 로그인 확인
  useEffect(() => {
    if (!isLogin) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLogin, router]);

  // purchaseOptions가 변경될 때 formData 업데이트
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: purchaseOptions,
      },
    }));
  }, [purchaseOptions]);

  // 로그인되지 않은 경우 렌더링하지 않음
  if (!isLogin) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("purchaseDetail.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        purchaseDetail: {
          ...prev.purchaseDetail,
          [field]: field === "purchaseCategoryId" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "pricingPlanId" ? Number(value) : value,
      }));
    }
  };

  const handleOptionChange = (
    index: number,
    field: keyof PurchaseOption,
    value: string | number
  ) => {
    updateOption(index, field, value);
    // formData의 purchaseOptionList도 업데이트
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: prev.purchaseDetail.purchaseOptionList.map(
          (option, i) =>
            i === index
              ? {
                  ...option,
                  [field]: field === "price" ? Number(value) : value,
                }
              : option
        ),
      },
    }));
  };

  const handleAddOption = () => {
    addOption();
    // formData도 업데이트
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: [
          ...prev.purchaseDetail.purchaseOptionList,
          {
            providingMethod: "DOWNLOAD",
            title: "",
            content: "",
            price: 0,
            optionStatus: "AVAILABLE",
          },
        ],
      },
    }));
  };

  const handleRemoveOption = (index: number) => {
    removeOption(index);
    // formData도 업데이트
    setFormData((prev) => ({
      ...prev,
      purchaseDetail: {
        ...prev.purchaseDetail,
        purchaseOptionList: prev.purchaseDetail.purchaseOptionList.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // JSON 데이터 준비 (contentImage 필드 제거)
      const requestDto = {
        projectType: formData.projectType,
        title: formData.title,
        introduce: formData.introduce,
        content: formData.content,
        field: formData.field,
        pricingPlanId: formData.pricingPlanId,
        purchaseDetail: {
          gitAddress: formData.purchaseDetail.gitAddress,
          purchaseCategoryId: formData.purchaseDetail.purchaseCategoryId,
          getAverageDeliveryTime:
            formData.purchaseDetail.getAverageDeliveryTime,
          purchaseOptionList: formData.purchaseDetail.purchaseOptionList,
        },
      };

      console.log("전송할 JSON 데이터:", requestDto);
      formDataToSend.append("requestDto", JSON.stringify(requestDto));

      // 이미지 파일들 추가
      contentImages.forEach((file, index) => {
        console.log(`contentImage ${index}:`, file.name);
        formDataToSend.append("contentImage", file);
      });

      // DOWNLOAD 옵션의 파일들만 추가
      optionFiles.forEach((file, index) => {
        if (file) {
          console.log(`optionFile ${index}:`, file.name);
          formDataToSend.append("optionFiles", file);
        }
      });

      // FormData 내용 확인 (디버깅용)
      console.log("=== FormData 내용 ===");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/purchase`,
        {
          method: "POST",
          credentials: "include", // 쿠키 포함
          headers: {
            // Content-Type을 제거하여 브라우저가 자동으로 multipart/form-data로 설정하도록 함
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: formDataToSend,
        }
      );

      console.log("응답 상태:", response.status);
      console.log("응답 헤더:", response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log("성공 응답:", result);
        alert("프로젝트가 성공적으로 생성되었습니다!");
        router.push("/");
      } else {
        const errorText = await response.text();
        console.error("오류 응답:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "프로젝트 생성에 실패했습니다.");
        } catch {
          throw new Error(`서버 오류 (${response.status}): ${errorText}`);
        }
      }
    } catch (error) {
      console.error("프로젝트 생성 오류:", error);
      alert(
        error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              구매형 프로젝트 생성
            </h1>
            <p className="text-gray-600">
              디지털 콘텐츠나 서비스를 판매할 수 있는 프로젝트를 만들어보세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                기본 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로젝트 제목 *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="프로젝트 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카테고리 *
                  </label>
                  <select
                    name="purchaseDetail.purchaseCategoryId"
                    value={formData.purchaseDetail.purchaseCategoryId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">카테고리를 선택하세요</option>
                    <option value="1">앱/서비스</option>
                    <option value="2">Notion 템플릿</option>
                    <option value="3">슬라이드/제안서</option>
                    <option value="4">자동화 툴</option>
                    <option value="5">디자인 리소스</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    분야 *
                  </label>
                  <input
                    type="text"
                    name="field"
                    value={formData.field}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="분야를 입력하세요 (10글자 이내)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.field.length}/10자
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  프로젝트 소개 *
                </label>
                <textarea
                  name="introduce"
                  value={formData.introduce}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="프로젝트를 간단히 소개해주세요"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상세 내용 *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="프로젝트에 대한 자세한 내용을 작성해주세요"
                />
              </div>
            </div>

            {/* 콘텐츠 이미지 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                콘텐츠 이미지
              </h2>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={triggerContentImageUpload}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  이미지 추가
                </button>
                <input
                  ref={contentImageRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleContentImageChange}
                  className="hidden"
                />
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeContentImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 구매 상세 정보 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                구매 상세 정보
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Git 주소
                  </label>
                  <input
                    type="url"
                    name="purchaseDetail.gitAddress"
                    value={formData.purchaseDetail.gitAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://github.com/username/repository"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가격 플랜 ID *
                  </label>
                  <select
                    name="pricingPlanId"
                    value={formData.pricingPlanId}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={3}>베이직 플랜</option>
                    <option value={4}>프로 플랜</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  평균 배송 시간 *
                </label>
                <input
                  type="text"
                  name="purchaseDetail.getAverageDeliveryTime"
                  value={formData.purchaseDetail.getAverageDeliveryTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="예: 즉시 다운로드 및 24시간 이내 이메일 발송"
                />
              </div>
            </div>

            {/* 구매 옵션 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">구매 옵션</h2>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                >
                  + 옵션 추가
                </button>
              </div>

              {formData.purchaseDetail.purchaseOptionList.map(
                (option, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 mb-4"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        옵션 {index + 1}
                      </h3>
                      {formData.purchaseDetail.purchaseOptionList.length >
                        1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          제공 방식 *
                        </label>
                        <select
                          value={option.providingMethod}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "providingMethod",
                              e.target.value as "DOWNLOAD" | "EMAIL"
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="DOWNLOAD">다운로드</option>
                          <option value="EMAIL">이메일</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          가격 (원) *
                        </label>
                        <input
                          type="number"
                          value={option.price}
                          onChange={(e) =>
                            handleOptionChange(index, "price", e.target.value)
                          }
                          min="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          옵션 제목 *
                        </label>
                        <input
                          type="text"
                          value={option.title}
                          onChange={(e) =>
                            handleOptionChange(index, "title", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="옵션 제목을 입력하세요"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          상태
                        </label>
                        <select
                          value={option.optionStatus}
                          onChange={(e) =>
                            handleOptionChange(
                              index,
                              "optionStatus",
                              e.target.value as "AVAILABLE" | "UNAVAILABLE"
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="AVAILABLE">사용 가능</option>
                          <option value="UNAVAILABLE">사용 불가</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        옵션 설명 *
                      </label>
                      <textarea
                        value={option.content}
                        onChange={(e) =>
                          handleOptionChange(index, "content", e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="이 옵션에 대한 설명을 입력하세요"
                      />
                    </div>

                    {/* DOWNLOAD 방식일 때만 파일 업로드 표시 */}
                    {option.providingMethod === "DOWNLOAD" && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          파일 업로드 *
                        </label>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleOptionChange(
                                index,
                                "fileIdentifier",
                                file.name
                              );
                              // 파일을 optionFiles 배열에 추가
                              setOptionFiles((prev) => {
                                const newFiles = [...prev];
                                newFiles[index] = file;
                                return newFiles;
                              });
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          accept="*/*"
                        />
                        {option.fileIdentifier && (
                          <p className="text-sm text-gray-600 mt-1">
                            선택된 파일: {option.fileIdentifier}
                          </p>
                        )}
                      </div>
                    )}

                    {/* EMAIL 방식 안내 */}
                    {option.providingMethod === "EMAIL" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          📧 이메일 방식: 구매자에게 이메일로 콘텐츠가
                          전달됩니다.
                        </p>
                      </div>
                    )}

                    {option.fileIdentifier &&
                      option.providingMethod === "DOWNLOAD" && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            💾 연결된 파일: {option.fileIdentifier}
                          </p>
                        </div>
                      )}
                  </div>
                )
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "생성 중..." : "프로젝트 생성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
