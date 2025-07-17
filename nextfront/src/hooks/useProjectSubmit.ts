import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectFormData } from "./useProjectForm";

export const useProjectSubmit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitProject = async (
    formData: ProjectFormData,
    contentImages: File[],
    optionFiles: File[]
  ) => {
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // JSON 데이터 준비
      const requestDto = {
        ...formData,
        contentImage: contentImages.map((_, index) => `image_${index}`),
        optionFiles: optionFiles.map((file) => file.name),
      };

      formDataToSend.append("requestDto", JSON.stringify(requestDto));

      // 이미지 파일들 추가
      contentImages.forEach((file) => {
        formDataToSend.append("contentImage", file);
      });

      // 옵션 파일들 추가
      optionFiles.forEach((file) => {
        formDataToSend.append("optionFiles", file);
      });

      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/project/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "application/json",
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        alert("프로젝트가 성공적으로 생성되었습니다!");
        router.push("/");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "프로젝트 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("프로젝트 생성 오류:", error);
      alert(
        error instanceof Error ? error.message : "프로젝트 생성에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    submitProject,
  };
};
