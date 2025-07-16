"use client";

export default function LoginPage() {
  console.log("FRONT_BASE_URL", process.env.NEXT_PUBLIC_FRONT_BASE_URL);
  console.log("API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);

  // 카카오 로그인 URL
  const socialLoginForKakaoUrl = `https://yetda.kro.kr/oauth2/authorization/kakao`;
  // const socialLoginForKakaoUrl = `http://localhost:8080/oauth2/authorization/kakao`;

  // 깃허브 로그인 URL
  //   const socialLoginForGithubUrl = `http://3.39.9.55:8081/oauth2/authorization/github`;
  const socialLoginForGithubUrl = `https://yetda.kro.kr/oauth2/authorization/github`;

  // const redirectAfterLogin = "https://www.yetda.booktri.site/loginsuccess";

  const redirectAfterLogin = "http://localhost:3000/loginsuccess";

  // 카카오 로그인 핸들러
  const handleKakaoLogin = () => {
    // OAuth 로그인은 직접 리다이렉트해야 함
    const loginUrl = `${socialLoginForKakaoUrl}?state=${encodeURIComponent(
      redirectAfterLogin
    )}`;
    console.log("카카오 로그인 URL로 이동:", loginUrl);
    window.location.href = loginUrl;
  };

  // 깃허브 로그인 핸들러
  const handleGithubLogin = () => {
    // OAuth 로그인은 직접 리다이렉트해야 함
    console.log("깃허브 로그인 URL로 이동:", socialLoginForGithubUrl);
    window.location.href = socialLoginForGithubUrl;
  };

  // 마이페이지 정보 가져오기
  const fetchMyPageInfo = async () => {
    try {
      const response = await fetch("https://yetda.kro.kr/api/v1/user/mypage", {
        method: "GET",
        credentials: "include", // 쿠키를 포함하여 요청
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("마이페이지 정보:", data);
        // 응답 구조에 맞게 데이터 처리
        if (data.data) {
          console.log("사용자 정보:", {
            이름: data.data.name,
            이메일: data.data.email,
            소개: data.data.introduce || "없음",
            포트폴리오: data.data.portfolioAddress || "없음",
            프로필이미지: data.data.image,
          });
        }
        return data;
      } else {
        console.error("마이페이지 정보 조회 실패:", response.status);
      }
    } catch (error) {
      console.error("마이페이지 API 에러:", error);
    }
  };

  // 계좌 정보 업데이트
  const updateAccountInfo = async (bank, account) => {
    try {
      const response = await fetch(
        "https://yetda.kro.kr/api/v1/user/mypage/account",
        {
          method: "PUT", // 또는 PUT/PATCH (서버 API에 따라)
          credentials: "include", // 쿠키를 포함하여 요청
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
        return data;
      } else {
        console.error("계좌 정보 업데이트 실패:", response.status);
      }
    } catch (error) {
      console.error("계좌 정보 업데이트 에러:", error);
    }
  };

  // 카카오 로그인 (직접 리다이렉트)
  const handleKakaoLoginWithMyPage = () => {
    handleKakaoLogin();
    // OAuth 로그인은 페이지 리다이렉트가 발생하므로
    // 로그인 성공 후 리다이렉트된 페이지에서 마이페이지 정보를 가져와야 함
  };

  // 깃허브 로그인 (직접 리다이렉트)
  const handleGithubLoginWithMyPage = () => {
    handleGithubLogin();
    // OAuth 로그인은 페이지 리다이렉트가 발생하므로
    // 로그인 성공 후 리다이렉트된 페이지에서 마이페이지 정보를 가져와야 함
  };

  // 테스트용 계좌 정보 업데이트
  const handleTestAccountUpdate = () => {
    const bank = prompt("은행명을 입력하세요:");
    const account = prompt("계좌번호를 입력하세요:");

    if (bank && account) {
      updateAccountInfo(bank, account);
    }
  };

  return (
    <>
      <style jsx>{`
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          margin: 0;
          font-family: "Segoe UI", Tossface, system-ui, sans-serif;
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
          width: 100%;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          color: #333;
          margin-bottom: 10px;
        }

        .login-subtitle {
          color: #666;
          margin-bottom: 40px;
          font-size: 16px;
        }

        .social-login-section {
          margin-bottom: 30px;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 20px;
          margin: 10px 0;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .kakao-button {
          background-color: #fee500;
          color: #000;
        }

        .kakao-button:hover {
          background-color: #fdd835;
          transform: translateY(-2px);
        }

        .github-button {
          background-color: #24292e;
          color: white;
        }

        .github-button:hover {
          background-color: #1a1e22;
          transform: translateY(-2px);
        }

        .divider {
          margin: 30px 0;
          position: relative;
        }

        .divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e0e0e0;
        }

        .divider-text {
          background: white;
          padding: 0 20px;
          color: #999;
          font-size: 14px;
        }

        .api-test-section {
          border-top: 1px solid #f0f0f0;
          padding-top: 20px;
        }

        .api-test-title {
          font-size: 16px;
          font-weight: 600;
          color: #666;
          margin-bottom: 15px;
        }

        .api-button {
          padding: 8px 16px;
          margin: 5px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          color: #666;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .api-button:hover {
          background: #f5f5f5;
          border-color: #999;
        }

        .mypage-button {
          border-color: #3182f6;
          color: #3182f6;
        }

        .mypage-button:hover {
          background: #3182f6;
          color: white;
        }

        .account-button {
          border-color: #10b981;
          color: #10b981;
        }

        .account-button:hover {
          background: #10b981;
          color: white;
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">로그인</h1>
          <p className="login-subtitle">소셜 계정으로 간편하게 로그인하세요</p>

          <div className="social-login-section">
            {/* 카카오 로그인 */}
            <button
              onClick={handleKakaoLoginWithMyPage}
              className="social-button kakao-button"
            >
              <span>🟡</span>
              <span style={{ marginLeft: "10px" }}>카카오 로그인</span>
            </button>

            {/* GitHub 로그인 */}
            <button
              onClick={handleGithubLoginWithMyPage}
              className="social-button github-button"
            >
              <span>🐙</span>
              <span style={{ marginLeft: "10px" }}>GitHub 로그인</span>
            </button>
          </div>

          <div className="divider">
            <span className="divider-text">개발자 테스트</span>
          </div>

          {/* API 테스트 섹션 */}
          <div className="api-test-section">
            <div className="api-test-title">API 테스트</div>
            <div>
              <button
                onClick={fetchMyPageInfo}
                className="api-button mypage-button"
              >
                마이페이지 조회
              </button>

              <button
                onClick={handleTestAccountUpdate}
                className="api-button account-button"
              >
                계좌 정보 업데이트
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
