import { useEffect, useState } from "react";
import { Order } from "@/types/user/orderList";
import axios from "axios";
import { useUserStore } from "@/stores/useStore";
import { useHasHydrated } from "./useHasHydrated";
export function useOrderList() {
  const [OrderData, setOrderData] = useState<Order[] | null>(null);
  const hasHydrated = useHasHydrated();
  const isAuthenticated = useUserStore(state => state.isAuthenticated());

  useEffect(() => {
    if (hasHydrated || !isAuthenticated) {
      return;
    }
    if (typeof isAuthenticated !== "boolean") return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order`,
          {
            withCredentials: true,
          },
        );
        setOrderData(res.data.data.content);
      } catch (err) {
        console.error("로그인 필요 또는 인증 실패:", err);
      }
    };

    fetchProject();
  }, [hasHydrated, isAuthenticated]);

  if (!isAuthenticated) return null;
  return OrderData;
}
