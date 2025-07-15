"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import "../App.css";

function FailContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const message = searchParams.get("message") ?? "";
  const code = searchParams.get("code") ?? "";

  return (
    <div id="info" className="box_section" style={{ width: "600px" }}>
      <img
        width="100px"
        src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
        alt="에러 이미지"
      />
      <h2>결제를 실패했어요</h2>

      <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
        <div className="p-grid-col text--left">
          <b>에러메시지</b>
        </div>
        <div className="p-grid-col text--right" id="message">
          {message}
        </div>
      </div>

      <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
        <div className="p-grid-col text--left">
          <b>에러코드</b>
        </div>
        <div className="p-grid-col text--right" id="code">
          {code}
        </div>
      </div>

      <div className="p-grid-col" style={{ marginTop: "20px" }}>
        <a
          href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="button p-grid-col5">연동 문서</button>
        </a>
        <a
          href="https://discord.gg/A4fRFXQhRu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className="button p-grid-col5"
            style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}
          >
            실시간 문의
          </button>
        </a>
      </div>
    </div>
  );
}

export default function FailPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={
        <p className="p-8 text-gray-400">결제 실패 정보 불러오는 중...</p>
      }
    >
      <FailContent />
    </Suspense>
  );
}
