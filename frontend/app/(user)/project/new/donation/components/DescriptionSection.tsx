"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { DonationFormData } from "../../../../../../types/donationFormData";

interface Props {
  formData: DonationFormData;
  onUpdate: <K extends keyof DonationFormData>(
    field: K,
    value: DonationFormData[K],
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
          프로젝트에 대한 자세한 설명을 입력하세요
        </Label>
        <Textarea
          id="description"
          rows={8}
          placeholder="예: 목적, 기대 효과, 진행 방식 등을 작성해주세요"
          value={formData.description}
          onChange={e => onUpdate("description", e.target.value)}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
}
