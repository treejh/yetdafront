"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function TossFailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  // 디버깅 로그
  console.log("=== 토스 결제 실패 페이지 ===");
  console.log("오류 코드:", errorCode);
  console.log("오류 메시지:", errorMessage);
  console.log("전체 URL 파라미터:", Object.fromEntries(searchParams.entries()));

  const getErrorMessage = (code: string | null) => {
    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "사용자가 결제를 취소했습니다.";
      case "PAY_PROCESS_ABORTED":
        return "결제 진행 중 오류가 발생했습니다.";
      case "REJECT_CARD_COMPANY":
        return "카드사에서 결제를 거절했습니다.";
      default:
        return errorMessage || "알 수 없는 오류가 발생했습니다.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">결제 실패</h1>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{getErrorMessage(errorCode)}</p>
          {errorCode && (
            <p className="text-red-600 text-xs mt-2">오류 코드: {errorCode}</p>
          )}
        </div>

        {/* 디버깅 정보 */}
        <details className="mb-6">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
            🔗 오류 상세 정보 (디버깅용)
          </summary>
          <div className="bg-gray-100 rounded-lg p-3 text-xs text-left">
            <div>code: {errorCode || "N/A"}</div>
            <div>message: {errorMessage || "N/A"}</div>
            <div className="mt-2">전체 파라미터:</div>
            <pre className="text-xs">
              {JSON.stringify(
                Object.fromEntries(searchParams.entries()),
                null,
                2
              )}
            </pre>
          </div>
        </details>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/toss")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            다시 결제하기
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
