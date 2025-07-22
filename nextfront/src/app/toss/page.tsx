"use client";

import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";
import { useRouter } from "next/navigation";

// TODO: clientKey는 개발자센터의 결제위젯 연동 키 > 클라이언트 키로 바꾸세요.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15);
};

interface OrderData {
  totalAmount: number;
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
  createDate: string;
  purchaseOptions: Array<{
    id: number;
    title: string;
    price: number;
  }>;
}

interface CreateOrderRequest {
  projectId: number;
  projectType: "PURCHASE";
  customerEmail: string;
  purchaseOptions: number[];
}

const customerKey = generateRandomString(); // ✅ 동적 사용자 ID

export default function CheckoutPage() {
  const router = useRouter();
  const { isLogin, loginUser } = useGlobalLoginUser();
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 10900,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState<any>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // 로그인 체크
  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }
  }, [isLogin, router]);

  // 주문 생성 함수
  const createOrder = async (): Promise<OrderData | null> => {
    if (!loginUser?.email) {
      alert("로그인 정보가 없습니다.");
      return null;
    }

    setIsCreatingOrder(true);

    try {
      const orderRequest: CreateOrderRequest = {
        projectId: 1, // 임시로 1번 프로젝트 사용
        projectType: "PURCHASE",
        customerEmail: loginUser.email,
        purchaseOptions: [1, 2], // 임시로 1, 2번 옵션 사용
      };

      console.log("=== 주문 생성 요청 시작 ===");
      console.log(
        "요청 URL:",
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/order/purchase`
      );
      console.log("요청 데이터:", JSON.stringify(orderRequest, null, 2));
      console.log("로그인 사용자:", loginUser);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/order/purchase`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            // 인증 토큰이 필요한 경우 추가
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(orderRequest),
        }
      );

      console.log("=== 주문 생성 API 응답 ===");
      console.log("응답 상태:", response.status, response.statusText);
      console.log("응답 헤더:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API 오류 응답:", errorText);
        throw new Error(`주문 생성 실패: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("=== 백엔드 응답 데이터 ===");
      console.log("전체 응답:", JSON.stringify(result, null, 2));
      console.log("상태 코드:", result.statusCode);
      console.log("메시지:", result.message);
      console.log("데이터:", result.data);

      if (result.statusCode === 201 && result.data) {
        const orderData = result.data as OrderData;
        console.log("=== 주문 데이터 파싱 결과 ===");
        console.log("주문 ID:", orderData.orderId);
        console.log("총 금액:", orderData.totalAmount);
        console.log("주문명:", orderData.orderName);
        console.log("고객 이메일:", orderData.customerEmail);
        console.log("고객명:", orderData.customerName);
        console.log("구매 옵션:", orderData.purchaseOptions);

        setOrderData(orderData);

        // 주문 금액으로 위젯 금액 업데이트
        const newAmount = {
          currency: "KRW",
          value: orderData.totalAmount,
        };
        console.log("=== 결제 위젯 금액 업데이트 ===");
        console.log("새로운 금액:", newAmount);

        setAmount(newAmount);

        if (widgets) {
          await widgets.setAmount(newAmount);
          console.log("토스 위젯 금액 업데이트 완료");
        }

        return orderData;
      } else {
        throw new Error(result.message || "주문 생성 실패");
      }
    } catch (error) {
      console.error("주문 생성 오류:", error);
      alert(
        `주문 생성 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`
      );
      return null;
    } finally {
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        // ------  SDK 초기화 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, []); // clientKey와 customerKey는 상수이므로 의존성 배열에서 제거

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      // ------  주문서의 결제 금액 설정 ------
      // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
      // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
      await widgets.setAmount(amount);

      // ------  결제 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
      await widgets.renderPaymentMethods({
        selector: "#payment-method",
        // 렌더링하고 싶은 결제 UI의 variantKey
        // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
        // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
        variantKey: "DEFAULT",
      });

      // ------  이용약관 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
      await widgets.renderAgreement({
        selector: "#agreement",
        variantKey: "AGREEMENT",
      });

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, amount]); // amount 의존성 추가

  const updateAmount = async (amount: any) => {
    setAmount(amount);
    if (widgets) {
      await widgets.setAmount(amount);
    }
  };

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600 mb-6">
            결제를 진행하려면 먼저 로그인해주세요.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 mt-8 mb-12">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
            토스페이먼츠 결제
          </h1>

          {/* 결제 UI */}
          <div id="payment-method" className="mb-6" />

          {/* 이용약관 UI */}
          <div id="agreement" className="mb-6" />

          {/* 쿠폰 체크박스 */}
          <div className="pl-6 mb-6">
            <div className="flex items-center">
              <input
                id="coupon-box"
                type="checkbox"
                defaultChecked
                disabled={!ready}
                className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
                onChange={async (event) => {
                  const baseAmount = orderData?.totalAmount || amount.value;
                  await updateAmount({
                    currency: amount.currency,
                    value: event.target.checked
                      ? baseAmount - 5000
                      : baseAmount,
                  });
                }}
              />
              <label
                htmlFor="coupon-box"
                className="text-sm font-medium text-gray-700"
              >
                5,000원 쿠폰 적용
              </label>
            </div>
          </div>

          {/* 주문 생성 상태 표시 */}
          {!orderData && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">
                📋 주문 준비
              </h3>
              <p className="text-sm text-yellow-700">
                결제하기 전에 주문 정보를 생성해야 합니다. 아래 버튼으로 주문을
                먼저 생성하거나, 결제하기 버튼을 클릭하면 자동으로 주문이
                생성됩니다.
              </p>
            </div>
          )}

          {/* 주문 정보 표시 */}
          {orderData && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">✅ 주문 정보</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <span className="font-medium">주문번호:</span>{" "}
                  {orderData.orderId}
                </p>
                <p>
                  <span className="font-medium">상품명:</span>{" "}
                  {orderData.orderName}
                </p>
                <p>
                  <span className="font-medium">총 금액:</span>{" "}
                  {orderData.totalAmount.toLocaleString()}원
                </p>
                <p>
                  <span className="font-medium">고객명:</span>{" "}
                  {orderData.customerName}
                </p>
                <div className="mt-2">
                  <p className="font-medium">구매 옵션:</p>
                  <ul className="list-disc list-inside ml-2">
                    {orderData.purchaseOptions.map((option) => (
                      <li key={option.id}>
                        {option.title} - {option.price.toLocaleString()}원
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 결제하기 버튼 */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg transition duration-200 text-lg"
            disabled={!ready || isCreatingOrder}
            onClick={async () => {
              try {
                if (!widgets) return;

                console.log("=== 결제 시작 ===");
                console.log("현재 주문 데이터:", orderData);

                // 주문이 아직 생성되지 않았으면 먼저 주문 생성
                let currentOrderData = orderData;
                if (!currentOrderData) {
                  console.log("주문이 없어서 새로 생성합니다...");
                  currentOrderData = await createOrder();
                  if (!currentOrderData) {
                    console.error("주문 생성 실패로 결제 중단");
                    return; // 주문 생성 실패
                  }
                }

                console.log("=== 토스 결제 요청 ===");
                console.log("결제 데이터:", {
                  orderId: currentOrderData.orderId,
                  orderName: currentOrderData.orderName,
                  customerEmail: currentOrderData.customerEmail,
                  customerName: currentOrderData.customerName,
                });

                // 결제 요청
                await widgets.requestPayment({
                  orderId: currentOrderData.orderId,
                  orderName: currentOrderData.orderName,
                  successUrl: window.location.origin + "/toss/success",
                  failUrl: window.location.origin + "/toss/fail",
                  customerEmail: currentOrderData.customerEmail,
                  customerName: currentOrderData.customerName,
                  customerMobilePhone: "01012341234", // 기본값 또는 사용자 입력값
                });
              } catch (error) {
                console.error("결제 요청 오류:", error);
                alert("결제 요청 중 오류가 발생했습니다.");
              }
            }}
          >
            {isCreatingOrder ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                주문 생성 중...
              </div>
            ) : orderData ? (
              "💳 결제하기"
            ) : (
              "📋 주문 생성 후 결제하기"
            )}
          </button>

          {/* 주문 미리 생성하기 버튼 (선택사항) */}
          {!orderData && !isCreatingOrder && (
            <button
              onClick={() => {
                console.log("=== 주문 미리 생성 시작 ===");
                createOrder();
              }}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
            >
              🔄 주문 정보 미리 생성하기 (선택사항)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
