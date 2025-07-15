"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";

import type { ProductFormData } from "@/types/productFormData";
import { getSellProjectById, updatePurchaseProject } from "@/apis/project";

import SellProjectEditor from "../../components/SellProjectEditor";

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [initialFormData, setInitialFormData] =
    useState<ProductFormData | null>(null);

  useEffect(() => {
    (async () => {
      const project = await getSellProjectById(id);

      if (!project) {
        alert("프로젝트 정보를 불러오지 못했습니다.");
        return;
      }

      const converted: ProductFormData = {
        title: project.title,
        subtitle: project.introduce,
        description: project.content,
        category: project.purchaseCategoryName ?? "",
        price: project.purchaseOptions?.[0]?.price?.toString() ?? "",
        images: project.contentImageUrls.map(url => ({
          file: undefined,
          previewUrl: url,
        })),
        options: project.purchaseOptions.map(opt => ({
          name: opt.title,
          price: opt.price.toString(),
          description: opt.content,
          file: undefined,
          deliveryMethod: "FILE_UPLOAD",
        })),
        creatorName: project.name ?? "",
        creatorBio: project.userIntroduce ?? "",
        creatorAvatar: project.userProfileImage ?? "",
      };

      setInitialFormData(converted);
    })();
  }, [id]);

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      const form = new FormData();

      const requestDto = {
        title: formData.title,
        introduce: formData.subtitle,
        content: formData.description,
        field: formData.category,
        purchaseDetail: {
          purchaseOptionList: formData.options.map(option => ({
            providingMethod: "DOWNLOAD",
            title: option.name,
            content: option.description,
            price: Number(option.price),
            optionStatus: "AVAILABLE",
            fileIdentifier: option.file?.name ?? "",
            originalFileName: option.file?.name ?? "",
            fileType: option.file?.type ?? "application/octet-stream",
            fileSize: option.file?.size ?? 0,
            fileUrl: "string",
          })),
        },
      };

      form.append("requestDto", JSON.stringify(requestDto));

      formData.images.forEach(image => {
        if (image.file) {
          form.append("contentImage", image.file, image.file.name);
        }
      });

      formData.options.forEach(opt => {
        if (opt.file) {
          form.append("optionFiles", opt.file, opt.file.name);
        }
      });

      const res = await updatePurchaseProject(id, form);
      if (!res.ok) {
        throw new Error("수정 실패");
      }

      alert("수정 완료");
      router.push(`/project/sell/${id}`);
    } catch (err) {
      console.error(err);
      alert("프로젝트 수정 중 오류 발생");
    }
  };

  if (!initialFormData) {
    return <p className="p-8 text-gray-500">불러오는 중...</p>;
  }

  return (
    <SellProjectEditor
      initialFormData={initialFormData}
      onSubmit={handleSubmit}
      submitButtonLabel="수정하기"
    />
  );
}
