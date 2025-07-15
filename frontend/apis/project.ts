import type { Project } from "@/types/project/project";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://yetda.kro.kr"
).replace(/\/+$/, "");

export async function createPurchaseProject(formData: FormData) {
  try {
    const res = await fetch(`${API_URL}/api/v1/project/purchase`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    console.error("프로젝트 등록 실패:", err);
    throw err;
  }
}

export async function getSellProjectById(id: string): Promise<Project | null> {
  try {
    console.log(`🔍 프로젝트 ID ${id} 조회 시작`);
    const url = `${API_URL}/api/v1/project/${id}`;
    console.log(`🔗 요청 URL: ${url}`);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 클라이언트에서 토큰 읽기
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");
      console.log(`🔑 Access Token 존재 여부: ${!!accessToken}`);
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
        console.log(`🔐 Authorization 헤더 추가됨`);
      }
    }

    const res = await fetch(url, {
      method: "GET",
      credentials: "include", // 쿠키를 포함하여 요청
      headers,
    });

    console.log(`📊 응답 상태: ${res.status} ${res.statusText}`);
    console.log(`✅ 응답 성공 여부: ${res.ok}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ 에러 응답 내용:`, errorText);

      if (res.status === 404) {
        console.warn(`🚫 프로젝트 ID ${id}를 찾을 수 없습니다 (404)`);
        return null;
      }
      if (res.status === 401) {
        console.warn(
          `🔐 인증이 필요합니다 (401) - 로그인하거나 권한이 필요한 프로젝트입니다`,
        );
        return null;
      }
      if (res.status === 403) {
        console.warn(`🚨 접근 권한이 없습니다 (403)`);
        return null;
      }

      throw new Error(
        `HTTP error! status: ${res.status}, message: ${errorText}`,
      );
    }

    const data = await res.json();
    console.log(`✅ 프로젝트 데이터 수신:`, data);

    const project: Project = {
      ...data.data,
      images: data.data.contentImageUrls || [],
    };

    console.log(`🎯 최종 프로젝트 객체:`, project);
    return project;
  } catch (err) {
    console.error(`💥 프로젝트 ID ${id} 조회 실패:`, err);
    return null;
  }
}

export const CreatePurchaseInfo = async ({
  projectId,
  optionIds,
  email,
}: {
  projectId: number;
  optionIds: number[];
  email: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/order/purchase`, {
      method: "POST",
      credentials: "include", // 쿠키를 포함하여 요청
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        projectType: "PURCHASE",
        customerEmail: email,
        purchaseOptions: optionIds,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error creating purchase info:", error);
    throw error;
  }
};

export const TossPurchaseApi = async (
  paymentKey: string,
  orderId: string,
  amount: number,
) => {
  const response = await fetch(`${API_URL}/api/v1/toss/confirm`, {
    method: "POST",
    credentials: "include", // 쿠키를 포함하여 요청
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey,
      orderId,
      amount,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const GetPurchasedFileUrl = async (optionId: number) => {
  const response = await fetch(`${API_URL}/api/v1/order/purchase/${optionId}`, {
    method: "GET",
    credentials: "include", // 쿠키를 포함하여 요청
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data.fileUrl as string | null;
};
export async function updatePurchaseProject(
  projectId: string,
  formData: FormData,
): Promise<Response> {
  const res = await fetch(`${API_URL}/api/v1/project/purchase/${projectId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return res; // ✅ fetch의 Response 그대로 넘김
}
