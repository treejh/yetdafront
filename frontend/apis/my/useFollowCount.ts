import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useStore";
import { useHasHydrated } from "./useHasHydrated";

export interface FollowCount {
  followerCount: number;
  followingCount: number;
}

export interface FollowResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: FollowCount;
}

export function useFollowCount() {
  const [followCountData, setFollowCountData] = useState<FollowResponse | null>(
    null,
  );
  const hasHydrated = useHasHydrated();
  const isAuthenticated = useUserStore(state => state.isAuthenticated());

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) {
      return;
    }
    const fetchFollow = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/count`,
          {
            withCredentials: true,
          },
        );
        setFollowCountData(res.data);
      } catch (err) {
        console.error("로그인 필요 또는 인증 실패:", err);
      }
    };

    fetchFollow();
  }, [hasHydrated, isAuthenticated]);

  return followCountData;
}
