import Image from "next/image";
import { ProjectFormData } from "@/hooks/useProjectForm";

interface ProjectPreviewProps {
  formData: ProjectFormData;
  imagePreviews: string[];
  loginUserName?: string;
}

export default function ProjectPreview({
  formData,
  imagePreviews,
  loginUserName,
}: ProjectPreviewProps) {
  return (
    <div className="lg:sticky lg:top-8 lg:h-fit">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">미리보기</h2>

        {/* 프로젝트 카드 미리보기 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            {/* 썸네일 영역 */}
            <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4 overflow-hidden relative">
              {imagePreviews.length > 0 ? (
                <Image
                  src={imagePreviews[0]}
                  alt="미리보기"
                  width={400}
                  height={200}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-12 h-12 mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">이미지 미리보기</p>
                  </div>
                </div>
              )}
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                  PURCHASE
                </div>
              </div>
            </div>

            {/* 프로젝트 정보 */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-lg line-clamp-2">
                {formData.title || "프로젝트 제목을 입력하세요"}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {formData.introduce || "프로젝트 소개를 입력하세요"}
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
                {loginUserName || "작성자"}
              </div>

              {/* 분야 태그 */}
              {formData.field && (
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs rounded-full">
                    #{formData.field}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 구매 옵션 미리보기 */}
        {formData.purchaseDetail.purchaseOptionList.some(
          (option) => option.title || option.price > 0
        ) && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              구매 옵션
            </h3>
            <div className="space-y-3">
              {formData.purchaseDetail.purchaseOptionList.map(
                (option, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">
                        {option.title || `옵션 ${index + 1}`}
                      </h4>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600">
                          {option.price.toLocaleString()}원
                        </span>
                        <div className="text-xs text-gray-500">
                          {option.providingMethod === "DOWNLOAD"
                            ? "다운로드"
                            : "이메일"}
                        </div>
                      </div>
                    </div>
                    {option.content && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {option.content}
                      </p>
                    )}
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          option.optionStatus === "AVAILABLE"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {option.optionStatus === "AVAILABLE"
                          ? "사용 가능"
                          : "사용 불가"}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* 배송 정보 미리보기 */}
        {formData.purchaseDetail.getAverageDeliveryTime && (
          <div className="bg-yellow-50 rounded-xl p-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              배송 정보
            </h3>
            <p className="text-sm text-gray-600">
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formData.purchaseDetail.getAverageDeliveryTime}
            </p>
          </div>
        )}

        {/* Git 주소 미리보기 */}
        {formData.purchaseDetail.gitAddress && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              소스 코드
            </h3>
            <a
              href={formData.purchaseDetail.gitAddress}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm break-all"
            >
              <svg
                className="w-4 h-4 inline mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {formData.purchaseDetail.gitAddress}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
