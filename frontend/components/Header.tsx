"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Heart } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full flex justify-between items-center p-4">
      <Link href="/">
        <Image
          src="/images/sample-logo.png"
          width={30}
          height={30}
          alt="logo"
        />
      </Link>
      {/* <div className="text-xs cursor-pointer">
        <div className="flex justify-center items-center gap-4">
          <div>프로젝트 등록</div>
          <Bell width={20} height={20} />
          <Heart width={20} height={20} />
          <div className="flex justify-center itmes-center gap-2">
            <Image
              src="/images/sample-profile.png"
              width={16}
              height={16}
              alt="profile"
              className="rounded-full"
            />
            <div className="text-xs">현우</div>
          </div>
        </div>
      </div> */}
      <Link href="/login">
        <div className="text-xs cursor-pointer">로그인/회원가입</div>
      </Link>
    </div>
  );
}
