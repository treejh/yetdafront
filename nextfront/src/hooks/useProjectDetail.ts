import { useState, useEffect } from "react";

// 타입 정의
interface PurchaseOption {
  title: string;
  content: string;
  price: number;
  fileUrl: string | null;
  optionStatus: "AVAILABLE" | "UNAVAILABLE";
  providingMethod: "DOWNLOAD" | "EMAIL";
  purchaseOptionId: number;
}

interface ProjectDetail {
  purchaseOptions: PurchaseOption[];
  projectCount: number;
  followerCount: number;
  projectId: number;
  title: string;
  introduce: string;
  content: string;
  gitAddress: string | null;
  purchaseCategoryId: number;
  purchaseCategoryName: string;
  averageDeliveryTime: string;
  contentImageUrls: string[];
  userId: number;
  name: string;
  userProfileImage: string | null;
  userIntroduce: string;
  email: string;
}

interface ProjectDetailResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: ProjectDetail;
}

export const useProjectDetail = (projectId: string) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!projectId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/v1/project/${projectId}`, {
          method: "GET",
          credentials: "include", // 쿠키 포함
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("프로젝트를 찾을 수 없습니다.");
          } else if (response.status === 403) {
            throw new Error("접근 권한이 없습니다.");
          } else {
            throw new Error("프로젝트 정보를 불러오는데 실패했습니다.");
          }
        }

        const data: ProjectDetailResponse = await response.json();

        if (data.statusCode === 200) {
          setProject(data.data);
        } else {
          throw new Error(
            data.message || "프로젝트 정보를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        console.error("프로젝트 상세 정보 조회 실패:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [projectId]);

  return { project, loading, error };
};

export type { ProjectDetail, PurchaseOption };
