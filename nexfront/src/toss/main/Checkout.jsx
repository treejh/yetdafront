"use client";

import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

// 토스페이먼츠 설정
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "user_abcdef123456";

// 주문 ID 생성 함수
function generateRandomString() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

export default function CheckoutPage() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 10900,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  const [orderId, setOrderId] = useState("");

  // 컴포넌트 마운트 시 주문 ID 생성
  useEffect(() => {
    setOrderId(`order_${generateRandomString()}`);
  }, []);

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({
          customerKey,
        });
        setWidgets(widgets);
      } catch (error) {
        console.error("결제 위젯 로딩 중 오류:", error);
      }
    }

    fetchPaymentWidgets();
  }, []);

  // 결제 UI 렌더링
  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      try {
        // 결제 금액 설정
        await widgets.setAmount(amount);

        // 결제 방법 UI 렌더링
        await widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        });

        // 이용약관 UI 렌더링
        await widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        });

        setReady(true);
      } catch (error) {
        console.error("결제 UI 렌더링 중 오류:", error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount]);

  // 결제 금액 업데이트 함수
  const updateAmount = async (newAmount) => {
    setAmount(newAmount);
    if (widgets) {
      try {
        await widgets.setAmount(newAmount);
      } catch (error) {
        console.error("금액 업데이트 중 오류:", error);
      }
    }
  };

  // 결제 요청 처리
  const handlePayment = async () => {
    if (!widgets || !ready || !orderId) {
      alert("결제 준비 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("결제 요청 시작:");
    console.log("orderId:", orderId);
    console.log("amount:", amount);
    console.log("successUrl:", `${window.location.origin}/success`);
    console.log("failUrl:", `${window.location.origin}/fail`);

    try {
      const paymentRequest = {
        orderId,
        orderName: "토스 티셔츠 외 2건",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        customerEmail: "customer123@gmail.com",
        customerName: "김토스",
        customerMobilePhone: "01012341234",
      };

      console.log("결제 요청 데이터:", paymentRequest);

      await widgets.requestPayment(paymentRequest);
    } catch (error) {
      console.error("결제 요청 중 오류:", error);
      alert("결제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <style jsx>{`
        body {
          background-color: #e8f3ff;
          font-family: Toss Product Sans, -apple-system, BlinkMacSystemFont,
            Bazier Square, Noto Sans KR, Segoe UI, Apple SD Gothic Neo, Roboto,
            Helvetica Neue, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji,
            Segoe UI Symbol, Noto Color Emoji;
          margin: 0;
          padding: 20px;
        }

        .wrapper {
          max-width: 800px;
          margin: 0 auto;
        }

        .box_section {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 10px 20px rgb(0 0 0 / 1%), 0 6px 6px rgb(0 0 0 / 6%);
          padding: 50px;
          margin-top: 30px;
          color: #333d4b;
          text-align: center;
        }

        .title {
          margin: 0 0 30px;
          font-size: 24px;
          font-weight: 600;
          color: #4e5968;
        }

        .button {
          color: #f9fafb;
          background-color: #3182f6;
          margin: 30px 0;
          font-size: 15px;
          font-weight: 600;
          line-height: 18px;
          text-align: center;
          cursor: pointer;
          border: 0;
          user-select: none;
          transition: background 0.2s ease, color 0.1s ease;
          border-radius: 7px;
          padding: 11px 16px;
          width: 100%;
          max-width: 300px;
        }

        .button:hover:not(:disabled) {
          background-color: #1b64da;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .checkable {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
          padding: 0 24px;
        }

        .checkable__label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 15px;
          color: #4e5968;
        }

        .checkable__input {
          margin-right: 8px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .payment-section {
          margin: 30px 0;
          text-align: left;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
          color: #6b7684;
        }
      `}</style>

      <div className="wrapper">
        <div className="box_section">
          <h1 className="title">토스페이먼츠 결제</h1>

          {!ready && (
            <div className="loading">결제 위젯을 로딩 중입니다...</div>
          )}

          <div className="payment-section">
            {/* 결제 방법 UI */}
            <div id="payment-method" />

            {/* 이용약관 UI */}
            <div id="agreement" />
          </div>

          {/* 쿠폰 체크박스 */}
          <div className="checkable">
            <label className="checkable__label">
              <input
                className="checkable__input"
                type="checkbox"
                disabled={!ready}
                onChange={async (event) => {
                  const newValue = event.target.checked
                    ? amount.value - 5000
                    : amount.value + 5000;

                  await updateAmount({
                    currency: amount.currency,
                    value: newValue,
                  });
                }}
              />
              <span>5,000원 쿠폰 적용</span>
            </label>
          </div>

          {/* 현재 결제 금액 표시 */}
          <div
            style={{ margin: "20px 0", fontSize: "16px", fontWeight: "600" }}
          >
            결제 금액: {amount.value.toLocaleString()}원
          </div>

          {/* 결제하기 버튼 */}
          <button
            className="button"
            disabled={!ready || !orderId}
            onClick={handlePayment}
          >
            {ready ? "결제하기" : "결제 준비 중..."}
          </button>
        </div>
      </div>
    </>
  );
}
