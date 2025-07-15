"use client";

import { Upload, User, ShoppingCart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { ProductFormData } from "@/types/productFormData";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const categoryLabels: Record<string, string> = {
  app: "앱/서비스",
  notion: "Notion 템플릿",
  slide: "슬라이드/제안서",
  automation: "자동화 툴",
  design: "디자인 리소스",
};

interface Props {
  formData: ProductFormData;
}

export default function ProductPreviewPanel({ formData }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainImage, setMainImage] = useState<string | null>(null);

  const basePrice = Number(formData.price || 0);
  const selectedOption = formData.options[selectedIndex];
  const optionPrice = Number(selectedOption?.price || 0);
  const totalPrice = basePrice + optionPrice;

  const getImageUrl = (index: number) =>
    formData.images[index]?.previewUrl ?? null;

  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24 h-fit">
      <div className="text-center mb-6">
        <h2 className="text-sky-500 font-bold text-lg mb-4">Preview</h2>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            {formData.category && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                {categoryLabels[formData.category] ?? "카테고리"}
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold mb-2">
            {formData.title || "제품명을 입력하세요"}
          </h1>
          <p className="text-gray-600 mb-4">
            {formData.subtitle || "한 줄 소개를 입력하세요"}
          </p>
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-8 h-8">
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">
                {formData.creatorName || "유저 정보 받아올거"}
              </div>
              <div className="text-xs text-gray-500">팔로워 ???명</div>
            </div>
          </div>
        </div>

        <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
          {mainImage || getImageUrl(0) ? (
            <Image
              src={mainImage || getImageUrl(0)!}
              alt="대표 이미지"
              className="w-full h-full object-cover"
              fill
            />
          ) : (
            <div className="text-center text-gray-500">
              <Upload className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">대표 이미지</p>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {formData.images.map((img, i) => (
            <div
              key={i}
              className="w-16 h-16 bg-gray-100 rounded border overflow-hidden relative cursor-pointer"
              onClick={() => setMainImage(img.previewUrl)}
            >
              <Image
                src={img.previewUrl}
                alt={`썸네일 이미지 ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <Card>
          <CardContent>
            <div className="text-sm text-gray-600 whitespace-pre-line min-h-[100px]">
              {formData.description || "상세 설명을 입력하세요..."}
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          {formData.options.length > 0 && (
            <>
              <div className="flex justify-between border-b text-sm font-medium text-gray-600 mb-3">
                {formData.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`flex-1 py-2 ${
                      selectedIndex === idx
                        ? "text-black border-b-2 border-black"
                        : "text-gray-400"
                    }`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    {opt.name || `옵션 ${idx + 1}`}
                  </button>
                ))}
              </div>
              <div className="space-y-2 mb-4 text-gray-800">
                <div className="text-xl font-bold">
                  ₩{totalPrice.toLocaleString()}
                </div>
                {selectedOption?.description && (
                  <div className="text-sm leading-relaxed whitespace-pre-line font-medium">
                    {selectedOption.description}
                  </div>
                )}
              </div>
            </>
          )}

          <Button className="w-full bg-sky-500" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            구매하기
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">창작자 정보</h3>
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">
                {formData.creatorName || "유저정보 받아올거"}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {formData.creatorBio || "유저정보 받아올거"}
              </div>
              <div className="flex space-x-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                >
                  팔로우
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
