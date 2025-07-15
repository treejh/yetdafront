"use client";

import { ShoppingCart, Download } from "lucide-react";
import { useEffect, useState } from "react";

import type { Project } from "@/types/project/project";

import { GetPurchasedFileUrl, CreatePurchaseInfo } from "@/apis/project";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  project: Project;
}

export default function ProjectSidebarSell({ project }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedOption = project.purchaseOptions?.[selectedIndex];
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const totalPrice = selectedOption?.price.toLocaleString() ?? "0";

  useEffect(() => {
    const fetchFileUrl = async () => {
      if (selectedOption?.purchaseOptionId) {
        try {
          const fileUrl = await GetPurchasedFileUrl(
            selectedOption.purchaseOptionId,
          );
          setDownloadUrl(fileUrl);
        } catch {
          setDownloadUrl(null);
        }
      }
    };

    fetchFileUrl();
  }, [selectedOption?.purchaseOptionId]);

  const handlePurchase = async () => {
    try {
      if (!project.projectId || !selectedOption?.purchaseOptionId) {
        throw new Error("프로젝트 또는 옵션 ID가 없습니다.");
      }

      const customerEmail = "test@naver.com";

      const { orderId, totalAmount } = await CreatePurchaseInfo({
        projectId: Number(project.projectId),
        optionIds: [selectedOption.purchaseOptionId],
        email: customerEmail,
      });

      const url = `/toss?orderId=${encodeURIComponent(orderId)}&amount=${encodeURIComponent(totalAmount)}`;
      window.open(url, "TossPayment", "width=600,height=700,left=200,top=100");
    } catch (err) {
      console.error(err);
      setError("결제 실패");
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardContent className="space-y-6">
        {project.purchaseOptions && project.purchaseOptions.length > 0 && (
          <div className="flex justify-between border-b">
            {project.purchaseOptions.map((opt, idx) => (
              <button
                key={opt.purchaseOptionId}
                className={`flex-1 text-center py-2 font-medium ${
                  selectedIndex === idx
                    ? "text-black border-b-2 border-black"
                    : "text-gray-400"
                }`}
                onClick={() => setSelectedIndex(idx)}
              >
                {opt.title}
              </button>
            ))}
          </div>
        )}

        {selectedOption && (
          <div className="space-y-3 text-gray-800">
            <div className="text-2xl font-bold">₩{totalPrice}</div>
            {selectedOption.content && (
              <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                {selectedOption.content}
              </div>
            )}
          </div>
        )}

        {downloadUrl ? (
          <a
            href={downloadUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Download className="w-4 h-4 mr-2" />
              다운로드
            </Button>
          </a>
        ) : (
          <Button
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            size="lg"
            onClick={handlePurchase}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            구매하기
          </Button>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </CardContent>
    </Card>
  );
}
