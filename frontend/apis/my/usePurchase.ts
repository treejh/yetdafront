import { useEffect, useState } from "react";
import { PurchaseProject } from "@/types/user/purchaseProject";
import axios from "axios";
import { useUserStore } from "@/stores/useStore";
import { useHasHydrated } from "./useHasHydrated";

export function usePurchase() {
  const [projectData, setProjectData] = useState<PurchaseProject | null>(null);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/purchase`,
          {
            withCredentials: true,
          },
        );

        setProjectData(res.data.data);
      } catch (err) {
        console.error("로그인 필요 또는 인증 실패:", err);
      }
    };

    fetchProject();
  }, [hasHydrated, isAuthenticated]);

  return projectData;
}
