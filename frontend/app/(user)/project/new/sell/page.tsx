"use client";

import { useRouter } from "next/navigation";

import type { ProductFormData } from "@/types/productFormData";

import { createPurchaseProject } from "@/apis/project";

import SellProjectEditor from "./components/SellProjectEditor";

export default function SellProjectPage() {
  const router = useRouter();

  const initialFormData: ProductFormData = {
    title: "",
    subtitle: "",
    description: "",
    category: "",
    price: "",
    images: [],
    options: [
      {
        name: "STANDARD",
        price: "0",
        description: "",
        deliveryMethod: "FILE_UPLOAD",
      },
    ],
    creatorName: "",
    creatorBio: "",
    creatorAvatar: "",
  };

  const handleSubmit = async (formData: ProductFormData) => {
    const form = new FormData();

    const requestDto = {
      projectType: "PURCHASE",
      title: formData.title,
      introduce: formData.subtitle,
      content: formData.description,
      field: formData.category,
      pricingPlanId: 3,
      purchaseDetail: {
        gitAddress: "",
        purchaseCategoryId: 1,
        getAverageDeliveryTime: "즉시 다운로드 및 24시간 이내 이메일 발송",
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
      if (image?.file) {
        form.append("contentImage", image.file, image.file.name);
      }
    });

    formData.options.forEach(opt => {
      if (opt.file) {
        form.append("optionFiles", opt.file, opt.file.name);
      }
    });

    const res = await createPurchaseProject(form);
    const result = res.data;

    // if (!res.ok) throw new Error(result?.message || "업로드 실패");

    const projectId = result?.data?.projectId;
    alert("등록 완료");

    // 개발 환경에서는 localhost로 리다이렉트
    if (process.env.NODE_ENV === "development") {
      window.location.href = `http://localhost:3000/project/sell/${projectId}`;
    } else {
      router.push(`/project/sell/${projectId}`);
    }
  };

  return (
    <SellProjectEditor
      initialFormData={initialFormData}
      onSubmit={handleSubmit}
      submitButtonLabel="등록하기"
    />
  );
}
