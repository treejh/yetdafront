"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TossSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false); // 중복 호출 방지
  const [hasStartedProcessing, setHasStartedProcessing] = useState(false); // 처리 시작 여부

  useEffect(() => {
    // 이미 처리 시작했다면 중복 실행 방지
    if (hasStartedProcessing) {
      console.log("⚠️ 이미 처리가 시작되었으므로 중복 실행을 방지합니다.");
      return;
    }

    // 처리 시작 표시 (가장 먼저 설정)
    setHasStartedProcessing(true);

    // localStorage를 사용해서 이미 처리된 결제인지 확인
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");

    if (paymentKey && orderId) {
      const processedKey = `toss_processed_${paymentKey}_${orderId}`;
      const isAlreadyProcessed = localStorage.getItem(processedKey);

      if (isAlreadyProcessed === "completed") {
        console.log("⚠️ 이미 완료된 결제입니다. (localStorage 확인)");
        setError("이미 처리가 완료된 결제입니다.");
        setIsLoading(false);
        setIsConfirmed(true);
        return;
      }

      if (isAlreadyProcessed === "processing") {
        console.log("⚠️ 현재 처리 중인 결제입니다. (localStorage 확인)");
        setError("현재 처리 중인 결제입니다. 잠시 후 다시 시도해주세요.");
        setIsLoading(false);
        setIsConfirmed(true);
        return;
      }

      // 처리 시작 표시
      localStorage.setItem(processedKey, "processing");
      console.log(`📝 결제 처리 시작 표시: ${processedKey} = processing`);
    }

    const confirmPayment = async () => {
      // 승인 처리 시작 표시
      setIsConfirmed(true);

      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      console.log("=== 토스 결제 성공 페이지 (승인 처리 시작) ===");
      console.log("URL 파라미터:", {
        paymentKey,
        orderId,
        amount,
      });
      console.log(
        "전체 search params:",
        Object.fromEntries(searchParams.entries())
      );

      const requestData = {
        orderId: orderId,
        amount: amount,
        paymentKey: paymentKey,
      };

      console.log(
        "백엔드로 보낼 요청 데이터:",
        JSON.stringify(requestData, null, 2)
      );

      if (!paymentKey || !orderId || !amount) {
        console.error("필수 파라미터 누락:", { paymentKey, orderId, amount });
        setError("결제 정보가 누락되었습니다.");
        setIsLoading(false);

        // localStorage에서 처리 중 표시 제거
        if (paymentKey && orderId) {
          const processedKey = `toss_processed_${paymentKey}_${orderId}`;
          localStorage.removeItem(processedKey);
          console.log(`🗑️ localStorage 정리 (파라미터 누락): ${processedKey}`);
        }
        return;
      }

      try {
        console.log("=== 백엔드 결제 승인 API 호출 ===");
        console.log(
          "API URL:",
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/toss/confirm`
        );

        // 여기서 실제로는 백엔드 API를 호출하여 결제를 승인해야 합니다.
        // 현재는 클라이언트에서 직접 토스 API를 호출하는 예시입니다.
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

        console.log("API 응답 상태:", response.status, response.statusText);
        console.log(
          "응답 헤더:",
          Object.fromEntries(response.headers.entries())
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API 오류 응답:", errorText);

          let errorMessage = "결제 승인 실패";
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            errorMessage = `HTTP ${response.status}: ${errorText}`;
          }

          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("=== 백엔드 응답 데이터 ===");
        console.log("전체 응답:", JSON.stringify(result, null, 2));

        setPaymentData(result);
        console.log("✅ 결제 승인 완료!");

        // 성공 시 localStorage에 완료 표시
        if (paymentKey && orderId) {
          const processedKey = `toss_processed_${paymentKey}_${orderId}`;
          localStorage.setItem(processedKey, "completed");
          console.log(`✅ localStorage 완료 표시: ${processedKey} = completed`);

          // 5초 후 localStorage 정리 (다음 결제를 위해)
          setTimeout(() => {
            localStorage.removeItem(processedKey);
            console.log(`🧹 localStorage 정리 완료: ${processedKey}`);
          }, 5000);
        }
      } catch (err) {
        console.error("결제 승인 오류:", err);

        // localStorage에서 처리 중 표시 제거 (재시도 가능하게)
        if (paymentKey && orderId) {
          const processedKey = `toss_processed_${paymentKey}_${orderId}`;
          localStorage.removeItem(processedKey);
          console.log(`🗑️ localStorage 정리 (오류 발생): ${processedKey}`);
        }

        setError(
          `결제 승인 중 오류가 발생했습니다: ${
            err instanceof Error ? err.message : "알 수 없는 오류"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]); // hasStartedProcessing은 의존성에서 제거 (무한루프 방지)

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

        {paymentData && (
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">결제 정보</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">주문번호:</span>{" "}
                {paymentData.orderId}
              </p>
              <p>
                <span className="font-medium">결제금액:</span>{" "}
                {paymentData.totalAmount?.toLocaleString()}원
              </p>
              <p>
                <span className="font-medium">결제방법:</span>{" "}
                {paymentData.method}
              </p>
              <p>
                <span className="font-medium">결제시간:</span>{" "}
                {paymentData.approvedAt
                  ? new Date(paymentData.approvedAt).toLocaleString()
                  : "N/A"}
              </p>
              {paymentData.paymentKey && (
                <p>
                  <span className="font-medium">결제키:</span>{" "}
                  <span className="text-xs break-all">
                    {paymentData.paymentKey}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* 백엔드 응답 데이터 표시 (디버깅용) */}
        {paymentData && (
          <details className="mb-6">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
              📋 백엔드 응답 데이터 (디버깅용)
            </summary>
            <div className="bg-gray-100 rounded-lg p-3 text-xs">
              <pre className="whitespace-pre-wrap overflow-auto">
                {JSON.stringify(paymentData, null, 2)}
              </pre>
            </div>
          </details>
        )}

        {/* URL 파라미터 표시 (디버깅용) */}
        <details className="mb-6">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 mb-2">
            🔗 URL 파라미터 (디버깅용)
          </summary>
          <div className="bg-gray-100 rounded-lg p-3 text-xs">
            <div>paymentKey: {searchParams.get("paymentKey")}</div>
            <div>orderId: {searchParams.get("orderId")}</div>
            <div>amount: {searchParams.get("amount")}</div>
          </div>
        </details>

        <button
          onClick={() => router.push("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
