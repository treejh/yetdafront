import { useState, useRef } from "react";

export const useFileManager = () => {
  const [contentImages, setContentImages] = useState<File[]>([]);
  const [optionFiles, setOptionFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const contentImageRef = useRef<HTMLInputElement>(null);
  const optionFilesRef = useRef<HTMLInputElement>(null);

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

  const handleOptionFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    updateFileIdentifiers: (files: File[]) => void
  ) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...optionFiles, ...files];
    setOptionFiles(newFiles);
    updateFileIdentifiers(newFiles);
  };

  const removeContentImage = (index: number) => {
    setContentImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeOptionFile = (index: number) => {
    setOptionFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerContentImageUpload = () => {
    contentImageRef.current?.click();
  };

  const triggerOptionFileUpload = () => {
    optionFilesRef.current?.click();
  };

  return {
    contentImages,
    optionFiles,
    imagePreviews,
    contentImageRef,
    optionFilesRef,
    handleContentImageChange,
    handleOptionFilesChange,
    removeContentImage,
    removeOptionFile,
    triggerContentImageUpload,
    triggerOptionFileUpload,
  };
};
