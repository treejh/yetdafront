"use client";
import type { ChangeEvent } from "react";

import { Upload, Plus } from "lucide-react";
import Image from "next/image";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import type { DonationFormData } from "../../../../../../types/donationFormData";

interface Props {
  formData: DonationFormData;
  onUpdate: <K extends keyof DonationFormData>(
    field: K,
    value: DonationFormData[K],
  ) => void;
}

export default function ImageUploadSection({ formData, onUpdate }: Props) {
  const handleImageUpload = (
    e: ChangeEvent<HTMLInputElement>,
    isMain: boolean,
    index?: number,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    const updated = [...formData.images];

    if (isMain) {
      updated[0] = imageUrl;
    } else if (index !== undefined && index >= 0 && index < 3) {
      updated[index + 1] = imageUrl;
    }

    onUpdate("images", updated.slice(0, 4));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>이미지</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>대표 이미지 *</Label>
          <label className="mt-2 block aspect-video border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors cursor-pointer relative">
            {formData.images[0] ? (
              <Image
                src={formData.images[0]}
                alt="대표 이미지"
                width={800}
                height={450}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-gray-600">클릭하여 이미지를 업로드하세요</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => handleImageUpload(e, true)}
            />
          </label>
        </div>

        <div>
          <Label>추가 이미지</Label>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {[0, 1, 2].map(i => {
              const imgSrc = formData.images[i + 1];
              return (
                <label
                  key={i}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors relative"
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={`추가 이미지 ${i + 1}`}
                      width={300}
                      height={300}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Plus className="w-6 h-6 text-gray-400" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleImageUpload(e, false, i)}
                  />
                </label>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
