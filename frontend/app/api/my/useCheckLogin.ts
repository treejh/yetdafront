"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore, UserInfo } from "@/stores/useStore";
import { useRouter } from "next/navigation";

export function useCheckLogin() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/mypage`,
          {
            withCredentials: true,
          },
        );

        const user = res.data.data;

        useUserStore.getState().setUser({
          name: user.name,
          email: user.email,
          image: user.image,
          portfolioAddress: user.portfolioAddress,
          introduce: user.introduce,
          userId: String(user.user_id),
          isAuthenticated: true,
        });
        useUserStore.getState().setPersistMode("post-login");
        setUserData(user);
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("유저 상태 초기화");
          useUserStore.getState().clearUser();
        } else {
          console.error("예상 외의 에러", err);
          router.push("/login");
          console.warn("인증되지 않은 사용자이거나 토큰 없음:", err);
        }
      }
    };

    fetchUser();
  }, []);
}
