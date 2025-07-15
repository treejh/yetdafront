import axios from "axios";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useStore";
import { useHasHydrated } from "./useHasHydrated";

export interface FollowingCount {
  userId: number;
  name: string;
  image: string;
}

export interface FollowingResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: FollowingCount[];
}

export function useFollowing() {
  const [followData, setFollowData] = useState<FollowingResponse | null>(null);
  const hasHydrated = useHasHydrated();
  const isAuthenticated = useUserStore(state => state.isAuthenticated());

  useEffect(() => {
    if (hasHydrated || !isAuthenticated) {
      return;
    }
    if (typeof isAuthenticated !== "boolean") return;

    const fetchFollow = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/follow/following`,
          {
            withCredentials: true,
          },
        );

        setFollowData(res.data);
      } catch (err) {
        console.error("로그인 필요 또는 인증 실패:", err);
      }
    };

    fetchFollow();
  }, [hasHydrated, isAuthenticated]);

  return followData;
}
