import { useState, useRef } from "react";

export const useImageManager = () => {
  const [contentImages, setContentImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const contentImageRef = useRef<HTMLInputElement>(null);

  const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setContentImages((prev) => [...prev, ...files]);

    // 이미지 미리보기 생성
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeContentImage = (index: number) => {
    setContentImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerContentImageUpload = () => {
    contentImageRef.current?.click();
  };

  const resetImages = () => {
    setContentImages([]);
    setImagePreviews([]);
  };

  return {
    contentImages,
    imagePreviews,
    contentImageRef,
    handleContentImageChange,
    removeContentImage,
    triggerContentImageUpload,
    resetImages,
  };
};
