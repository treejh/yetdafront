import type { Project } from "@/types/project/project";

export async function getSellProjectById(id: string): Promise<Project | null> {
  try {
    // 서버에서 쿠키 읽기
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Next.js 서버에서 쿠키 읽기
    if (typeof window === "undefined") {
      // 서버 사이드
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const accessToken = cookieStore.get("accessToken")?.value;

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers,
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("프로젝트 조회 성공:", data);

      const project: Project = {
        ...data.data,
        images: data.data.contentImageUrls || [],
      };

      return project;
    } else {
      console.error("프로젝트 조회 실패:", response.status);
      if (response.status === 401) {
        console.warn("로그인이 필요합니다.");
      }
      return null;
    }
  } catch (error) {
    console.error("프로젝트 조회 에러:", error);
    return null;
  }
}

export async function createPurchaseProject(formData: FormData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/purchase`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("프로젝트 등록 성공:", data);
      return { data };
    } else {
      console.error("프로젝트 등록 실패:", response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("프로젝트 등록 에러:", error);
    throw error;
  }
}

export async function getSellProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("프로젝트 조회 성공:", data);

      const project: Project = {
        ...data.data,
        images: data.data.contentImageUrls || [],
      };

      return project;
    } else {
      console.error("프로젝트 조회 실패:", response.status);
      if (response.status === 401) {
        console.warn("로그인이 필요합니다.");
      }
      return null;
    }
  } catch (error) {
    console.error("프로젝트 조회 에러:", error);
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/purchase`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          projectType: "PURCHASE",
          customerEmail: email,
          purchaseOptions: optionIds,
        }),
      },
    );

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/toss/confirm`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export const GetPurchasedFileUrl = async (optionId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/order/purchase/${optionId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

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
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project/purchase/${projectId}`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      },
    );

    if (response.ok) {
      console.log("프로젝트 업데이트 성공");
    } else {
      console.error("프로젝트 업데이트 실패:", response.status);
    }

    return response;
  } catch (error) {
    console.error("프로젝트 업데이트 에러:", error);
    throw error;
  }
}
