"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FailPage() {
  const searchParams = useSearchParams();

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
          text-align: center;
          color: #333d4b;
        }

        .error-image {
          width: 100px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 24px;
          font-weight: 600;
          margin: 20px 0;
          color: #ff6b6b;
        }

        .info-grid {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin: 10px 0;
          padding: 10px 0;
          border-bottom: 1px solid #f2f4f6;
        }

        .info-grid:last-of-type {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #4e5968;
          flex: 0 0 120px;
        }

        .info-value {
          color: #333d4b;
          word-break: break-all;
          text-align: right;
          flex: 1;
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
          display: inline-block;
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

        .retry-button {
          background-color: #ff6b6b;
          color: white;
          margin-top: 20px;
        }

        .retry-button:hover {
          background-color: #ff5252;
        }
      `}</style>

      <div className="container">
        <div className="box_section">
          <img
            className="error-image"
            src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
            alt="결제 실패"
          />
          <h2 className="title">결제를 실패했어요</h2>

          <div style={{ marginTop: "50px" }}>
            <div className="info-grid">
              <div className="info-label">에러 메시지</div>
              <div className="info-value">
                {searchParams.get("message") ||
                  "알 수 없는 오류가 발생했습니다."}
              </div>
            </div>

            <div className="info-grid">
              <div className="info-label">에러 코드</div>
              <div className="info-value">
                {searchParams.get("code") || "UNKNOWN"}
              </div>
            </div>
          </div>

          <Link href="/checkout" className="button retry-button">
            다시 결제하기
          </Link>

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
      </div>
    </>
  );
}
