"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  loadTossPayments,
  TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";
import "./App.css";

export default function TossPage() {
  return (
    <Suspense fallback={<p>로딩 중...</p>}>
      <InnerTossPage />
    </Suspense>
  );
}

function generateRandomString() {
  return typeof window !== "undefined"
    ? window.btoa(Math.random().toString()).slice(0, 20)
    : "";
}

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

interface Amount {
  currency: string;
  value: number;
}

function InnerTossPage() {
  const params = useSearchParams();
  const orderId = params.get("orderId")!;
  const initialAmount = Number(params.get("amount")!);

  const [amount, setAmount] = useState<Amount>({
    currency: "KRW",
    value: initialAmount,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const widgets = tossPayments.widgets({ customerKey });
        setWidgets(widgets);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!widgets) return;
      await widgets.setAmount(amount);
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        variantKey: "DEFAULT",
      });
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });
      setReady(true);
    })();
  }, [widgets]);

  const updateAmount = async (amount: Amount) => {
    setAmount(amount);
    await widgets!.setAmount(amount);
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-method" />
        <div id="agreement" />
        <div style={{ paddingLeft: "24px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                disabled={!ready}
                onChange={async event => {
                  await updateAmount({
                    currency: amount.currency,
                    value: event.target.checked
                      ? amount.value - 5000
                      : amount.value + 5000,
                  });
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets!.requestPayment({
                orderId,
                orderName: "토스 티셔츠 외 2건",
                successUrl: window.location.origin + "/toss/success",
                failUrl: window.location.origin + "/toss/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
