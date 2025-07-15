// app/project/new/sell/components/DescriptionSection.tsx

"use client";

import type { ProductFormData } from "@/types/productFormData";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  formData: ProductFormData;
  onUpdate: <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K],
  ) => void;
}

export default function DescriptionSection({ formData, onUpdate }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>상세 설명</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="description">
          제품에 대한 자세한 설명을 입력하세요
        </Label>
        <Textarea
          id="description"
          rows={8}
          placeholder="예: 사용 방법, 특징, 유의 사항 등을 작성해주세요"
          value={formData.description}
          onChange={e => onUpdate("description", e.target.value)}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
}
