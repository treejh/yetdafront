"use client";

import { useEffect, useState } from "react";

export default function LoginSuccessPage() {
  console.log("FRONT_BASE_URL", process.env.NEXT_PUBLIC_FRONT_BASE_URL);
  console.log("API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 마이페이지 정보 가져오기
  const fetchMyPageInfo = async () => {
    try {
      const response = await fetch(
        "https://yetda.kro.kr/api/v1/user/mypage/account",
        {
          method: "GET",
          credentials: "include", // 쿠키를 포함하여 요청
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("마이페이지 정보:", data);
        setUserInfo(data);
      } else {
        console.error("마이페이지 정보 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("마이페이지 API 에러:", error);
    } finally {
      setLoading(false);
    }
  };

  // 계좌 정보 업데이트
  const updateAccountInfo = async (bank, account) => {
    try {
      const response = await fetch(
        "https://yetda.kro.kr/api/v1/user/mypage/account",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bank: bank,
            account: account,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("계좌 정보 업데이트 성공:", data);
        setUserInfo(data); // 업데이트된 정보로 상태 갱신
        return data;
      } else {
        console.error("계좌 정보 업데이트 실패:", response.status);
      }
    } catch (error) {
      console.error("계좌 정보 업데이트 에러:", error);
    }
  };

  // 테스트용 계좌 정보 업데이트
  const handleTestAccountUpdate = () => {
    const bank = prompt("은행명을 입력하세요:");
    const account = prompt("계좌번호를 입력하세요:");

    if (bank && account) {
      updateAccountInfo(bank, account);
    }
  };

  // 컴포넌트 마운트 시 마이페이지 정보 가져오기
  useEffect(() => {
    // 로그인 완료 후 약간의 지연을 두고 API 호출
    const timer = setTimeout(() => {
      fetchMyPageInfo();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .success-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 500px;
          width: 100%;
        }

        .success-title {
          color: #10b981;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .loading-text {
          color: #6b7280;
          font-size: 1.1rem;
          margin: 20px 0;
        }

        .user-info-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
          margin: 20px 0;
          text-align: left;
        }

        .info-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 12px 0;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 500;
          color: #374151;
        }

        .info-value {
          color: #6b7280;
          font-family: monospace;
        }

        .error-card {
          background: #fef3cd;
          border: 1px solid #fbbf24;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
        }

        .error-text {
          color: #92400e;
          font-weight: 500;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .button {
          flex: 1;
          padding: 12px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .button-primary {
          background: #3b82f6;
          color: white;
        }

        .button-primary:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .button-success {
          background: #10b981;
          color: white;
        }

        .button-success:hover {
          background: #059669;
          transform: translateY(-1px);
        }

        .success-icon {
          font-size: 2rem;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>

      <div className="container">
        <div className="success-card fade-in">
          <h1 className="success-title">
            <span className="success-icon">✅</span>
            로그인 성공!
          </h1>

          {loading ? (
            <div>
              <p className="loading-text">사용자 정보를 불러오는 중...</p>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #e5e7eb",
                  borderTop: "3px solid #3b82f6",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "20px auto",
                }}
              ></div>
            </div>
          ) : (
            <div>
              {userInfo ? (
                <div className="user-info-card">
                  <h2 className="info-title">마이페이지 정보</h2>
                  <div className="info-item">
                    <span className="info-label">은행:</span>
                    <span className="info-value">
                      {userInfo.bank || "미등록"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">계좌번호:</span>
                    <span className="info-value">
                      {userInfo.account || "미등록"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="error-card">
                  <p className="error-text">
                    사용자 정보를 불러올 수 없습니다.
                  </p>
                </div>
              )}

              <div className="button-group">
                <button
                  onClick={fetchMyPageInfo}
                  className="button button-primary"
                >
                  정보 새로고침
                </button>

                <button
                  onClick={handleTestAccountUpdate}
                  className="button button-success"
                >
                  계좌 정보 수정
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
