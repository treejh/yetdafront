"use client";

import Image from "next/image";

export default function LoginPage() {
  const redirectUri = encodeURIComponent(process.env.NEXT_PUBLIC_API_URL || "");

  const handleKakaoLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?state=${redirectUri}`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`;
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-10">
      <div className="flex flex-col h-fit items-center justify-center gap-3">
        <div className="text-md-navItem">필요한 작품에 예따</div>
        <Image
          src="/images/sample-logo.png"
          width={125}
          height={64}
          alt="logo"
        />
      </div>

      <div className="flex flex-col gap-5">
        <div onClick={handleKakaoLogin}>
          <Image
            src="/images/kakao-login.png"
            width={300}
            height={50}
            alt="카카오 로그인"
          />
        </div>

        <div onClick={handleGithubLogin}>
          <Image
            src="/images/github-login.png"
            width={300}
            height={50}
            alt="깃허브 로그인"
          />
        </div>
      </div>
    </div>
  );
}
