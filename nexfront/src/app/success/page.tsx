"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 실제 토큰은 환경변수나 인증 시스템에서 가져와야 합니다
  const token =
    process.env.NEXT_PUBLIC_API_TOKEN ||
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqamh5dW44ODc2QGdtYWlsLmNvbSIsInVzZXJJZCI6MSwidXNlcm5hbWUiOiLsp4DtmIQiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MjQyMjU4NCwiZXhwIjoxNzUyNDMzMzg0fQ.Wu1I3QDPaQUNLe00nUuq7HqN6BE-rR7Mhd-SG65NC1U";

  useEffect(() => {
    async function confirmPayment() {
      try {
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");
        const paymentKey = searchParams.get("paymentKey");

        // 디버깅 로그 추가
        console.log("URL 파라미터 확인:");
        console.log("orderId:", orderId);
        console.log("amount:", amount);
        console.log("paymentKey:", paymentKey);
        console.log("전체 URL:", window.location.href);

        // 모든 URL 파라미터 출력
        const allParams: { [key: string]: string } = {};
        searchParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log("모든 URL 파라미터:", allParams);

        if (!orderId || !amount || !paymentKey) {
          console.error("누락된 파라미터:", {
            orderId: !orderId ? "누락" : "있음",
            amount: !amount ? "누락" : "있음",
            paymentKey: !paymentKey ? "누락" : "있음",
          });
          throw new Error("결제 정보가 부족합니다.");
        }

        const requestData = {
          orderId,
          amount,
          paymentKey,
        };

        const response = await fetch(
          "https://yetda.kro.kr/api/v1/toss/confirm",
          {
            method: "POST",
            credentials: "include", // 쿠키를 포함하여 요청
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestData),
          }
        );

        const json = await response.json();

        if (!response.ok) {
          throw { message: json.message, code: json.code };
        }

        setResponseData(json);
      } catch (error: any) {
        console.error("결제 확인 중 오류:", error);
        const errorCode = error?.code || "UNKNOWN";
        const errorMessage =
          error?.message || "알 수 없는 오류가 발생했습니다.";
        router.push(
          `/fail?code=${errorCode}&message=${encodeURIComponent(errorMessage)}`
        );
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [searchParams, router, token]);

  if (loading) {
    return (
      <>
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #e8f3ff;
            font-family: Toss Product Sans, -apple-system, BlinkMacSystemFont,
              sans-serif;
          }
        `}</style>
        <div className="loading-container">
          <div>결제 확인 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        body {
          background-color: #e8f3ff;
          font-family: Toss Product Sans, -apple-system, BlinkMacSystemFont,
            Bazier Square, Noto Sans KR, Segoe UI, Apple SD Gothic Neo, Roboto,
            Helvetica Neue, Arial, sans-serif;
          margin: 0;
          padding: 20px;
        }

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .box_section {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 10px 20px rgb(0 0 0 / 1%), 0 6px 6px rgb(0 0 0 / 6%);
          padding: 50px;
          margin-bottom: 20px;
          text-align: center;
          color: #333d4b;
        }

        .success-image {
          width: 100px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0;
          color: #4e5968;
        }

        .info-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
          padding: 10px 0;
          border-bottom: 1px solid #f2f4f6;
        }

        .info-grid:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #4e5968;
        }

        .info-value {
          color: #333d4b;
          word-break: break-all;
        }

        .button-group {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 30px;
        }

        .button {
          padding: 11px 16px;
          border-radius: 7px;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          cursor: pointer;
          border: none;
          transition: all 0.2s ease;
          min-width: 120px;
        }

        .button-primary {
          background-color: #3182f6;
          color: white;
        }

        .button-primary:hover {
          background-color: #1b64da;
        }

        .button-secondary {
          background-color: #e8f3ff;
          color: #1b64da;
        }

        .button-secondary:hover {
          background-color: #c9e2ff;
        }

        .response-data {
          text-align: left;
          margin-top: 20px;
        }

        .response-pre {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.5;
        }
      `}</style>

      <div className="container">
        <div className="box_section">
          <img
            className="success-image"
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            alt="결제 완료"
          />
          <h2 className="title">결제를 완료했어요</h2>

          <div style={{ marginTop: "50px" }}>
            <div className="info-grid">
              <div className="info-label">결제금액</div>
              <div className="info-value">
                {searchParams.get("amount")
                  ? `${Number(searchParams.get("amount")).toLocaleString()}원`
                  : "정보 없음"}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-label">주문번호</div>
              <div className="info-value">
                {searchParams.get("orderId") || "정보 없음"}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-label">결제키</div>
              <div className="info-value" style={{ fontSize: "12px" }}>
                {searchParams.get("paymentKey") || "정보 없음"}
              </div>
            </div>
          </div>

          <div className="button-group">
            <Link
              href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
              target="_blank"
              className="button button-primary"
            >
              연동 문서
            </Link>
            <Link
              href="https://discord.gg/A4fRFXQhRu"
              target="_blank"
              className="button button-secondary"
            >
              실시간 문의
            </Link>
          </div>
        </div>

        {responseData && (
          <div className="box_section">
            <div className="response-data">
              <div className="info-label" style={{ marginBottom: "10px" }}>
                서버 응답 데이터:
              </div>
              <pre className="response-pre">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
