"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";

import "../App.css";
import { TossPurchaseApi } from "@/apis/project";
import Image from "next/image";

type ConfirmResponse = Record<string, unknown>;

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState<ConfirmResponse | null>(
    null,
  );

  useEffect(() => {
    async function confirm(): Promise<ConfirmResponse> {
      const paymentKey = searchParams.get("paymentKey");
      const orderId = searchParams.get("orderId");
      const amount = searchParams.get("amount");

      if (!paymentKey || !orderId || !amount) {
        throw new Error("query parameter가 없습니다.");
      }

      return await TossPurchaseApi(paymentKey, orderId, Number(amount));
    }

    confirm()
      .then(data => setResponseData(data))
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("알 수 없는 에러:", error);
        }
      });
  }, [searchParams, router]);

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <Image
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          width={100}
          alt="결제 완료"
        />
        <h2>결제를 완료했어요</h2>

        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")!).toLocaleString()}원`}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {searchParams.get("orderId")}
          </div>
        </div>

        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div
            className="p-grid-col text--right"
            id="paymentKey"
            style={{ whiteSpace: "initial", width: "250px" }}
          >
            {searchParams.get("paymentKey")}
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

      <div
        className="box_section"
        style={{ width: "600px", textAlign: "left", marginTop: "30px" }}
      >
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial", marginTop: "10px" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}

export default function SuccessPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={<p className="p-8 text-gray-400">결제 정보를 불러오는 중...</p>}
    >
      <SuccessContent />
    </Suspense>
  );
}
