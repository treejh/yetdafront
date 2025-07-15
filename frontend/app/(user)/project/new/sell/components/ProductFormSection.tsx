"use client";

import { DollarSign } from "lucide-react";

import type { ProductFormData } from "@/types/productFormData";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  formData: ProductFormData;
  onUpdate: (field: keyof ProductFormData, value: unknown) => void;
}

const categories = [
  { id: "app", name: "앱/서비스" },
  { id: "notion", name: "Notion 템플릿" },
  { id: "slide", name: "슬라이드/제안서" },
  { id: "automation", name: "자동화 툴" },
  { id: "design", name: "디자인 리소스" },
];

export default function ProductFormSection({ formData, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>기본 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">제품명 *</Label>
          <Input
            id="title"
            placeholder="예: AI 양말"
            value={formData.title}
            onChange={e => onUpdate("title", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="subtitle">한 줄 소개 *</Label>
          <Input
            id="subtitle"
            placeholder="간단한 제품 설명을 입력하세요"
            value={formData.subtitle}
            onChange={e => onUpdate("subtitle", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="category">카테고리 *</Label>
          <select
            id="category"
            value={formData.category || ""}
            onChange={e => onUpdate("category", e.target.value)}
            className="mt-2 w-full border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="" disabled>
              카테고리를 선택하세요
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="price">가격 *</Label>
          <div className="relative mt-2">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="price"
              placeholder="15000"
              value={formData.price}
              onChange={e => onUpdate("price", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
