import { useState, useEffect } from "react";

// 프로젝트 타입 정의
export interface Project {
  id: number;
  title: string;
  introduce: string; // description 대신 introduce 사용
  thumbnail?: string; // imageUrl 대신 thumbnail 사용
  projectType: string;
  projectLikeCount: number; // likeCount 대신 projectLikeCount 사용
  achievementRate: number;
  sellingAmount: number;
  projectEndDate?: string;
  hostId: number;
  hostName: string; // authorName 대신 hostName 사용
  hostProfileImageUrl?: string;
}

// API 응답 타입 정의
interface ApiResponse {
  timestamp: string;
  statusCode: number;
  message: string;
  data: {
    content: Project[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: any;
      offset: number;
      paged: boolean;
      unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
  };
}

// 프로젝트 조회 파라미터
interface ProjectParams {
  projectType?: "ALL" | "BOOK" | "WEB" | "APP";
  sortType?: "LIKE" | "ACHIVEMENT_RATE" | "SELLING_AMOUNT";
  page?: number;
  size?: number;
}

export const useProjects = (params: ProjectParams = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);

  const {
    projectType = "ALL",
    sortType = "LIKE",
    page = 0,
    size = 10,
  } = params;

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://yetda.kro.kr";
      const queryParams = new URLSearchParams({
        projectType,
        sortType,
        page: page.toString(),
        size: size.toString(),
        sort: "createdAt,desc",
      });

      const response = await fetch(
        `${baseUrl}/api/v1/project/popular?${queryParams.toString()}`,
        {
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse: ApiResponse = await response.json();
      setProjects(apiResponse.data.content);
      setTotalElements(apiResponse.data.totalElements);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "프로젝트를 불러오는데 실패했습니다."
      );
      console.error("프로젝트 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [projectType, sortType, page, size]);

  return {
    projects,
    loading,
    error,
    totalElements,
    refetch: fetchProjects,
  };
};
