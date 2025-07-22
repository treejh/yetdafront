"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TossSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function confirm() {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      console.log("=== 결제 승인 시작 ===");
      console.log("파라미터:", { paymentKey, orderId, amount });

      if (!paymentKey || !orderId || !amount) {
        throw new Error("결제 정보가 누락되었습니다.");
      }

      // localStorage 중복 체크 (참고 코드 방식)
      const processedKey = `toss_processed_${paymentKey}_${orderId}`;
      const isAlreadyProcessed = localStorage.getItem(processedKey);

      if (isAlreadyProcessed) {
        console.log("⚠️ 이미 처리된 결제입니다. (localStorage 확인)");
        throw new Error("이미 처리된 결제입니다.");
      }

      // 처리 시작 표시
      localStorage.setItem(processedKey, "processing");
      console.log(`📝 결제 처리 시작: ${processedKey}`);

      const requestData = {
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/toss/confirm`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        // 실패 시 localStorage 정리
        localStorage.removeItem(processedKey);
        throw new Error(`${json.message} (code: ${json.code})`);
      }

      // 성공 시 완료 표시
      localStorage.setItem(processedKey, "completed");
      console.log(`✅ 결제 처리 완료: ${processedKey}`);

      return json;
    }

    confirm()
      .then((data) => {
        setResponseData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("결제 승인 오류:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">결제를 처리중입니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">결제 실패</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/toss")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">결제 성공!</h1>

        {/* 결제 정보 */}
        <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">결제 정보</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">결제금액:</span>
              <span>
                {Number(searchParams.get("amount")).toLocaleString()}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">주문번호:</span>
              <span>{searchParams.get("orderId")}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">결제키:</span>
              <span className="text-xs break-all">
                {searchParams.get("paymentKey")}
              </span>
            </div>
          </div>
        </div>

        {/* 백엔드 응답 데이터 (디버깅용) */}
        {responseData && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
              📋 응답 데이터 (디버깅용)
            </summary>
            <div className="bg-gray-100 rounded-lg p-3 text-xs">
              <pre className="whitespace-pre-wrap overflow-auto text-left">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          </details>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            홈으로
          </button>
          <button
            onClick={() => router.push("/mypage")}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            마이페이지
          </button>
        </div>
      </div>
    </div>
  );
}
