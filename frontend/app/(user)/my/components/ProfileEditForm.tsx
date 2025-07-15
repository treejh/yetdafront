import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/MyTextarea";
import axios from "axios";

interface ProfileFormProps {
  name: string;
  email?: string;
  portfolioAddress: string | null | "";
  introduce?: string | null;
  image: string;
}

export function ProfileEditForm({
  user,
  onProfileClick,
  onSubmitSuccess,
}: {
  user: ProfileFormProps;
  onProfileClick: (isEditing: boolean) => void;
  onSubmitSuccess: () => void;
}) {
  const [value, setValue] = useState(user || "");
  const [previewImage, setPreviewImage] = useState<string>(user.image);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      const jsonBlob = new Blob(
        [
          JSON.stringify({
            name: value.name,
            email: value.email,
            introduce: value.introduce,
            portfolioAddress: value.portfolioAddress,
          }),
        ],
        { type: "application/json" },
      );

      formData.append("info", jsonBlob);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/mypage`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status !== 200) {
        throw new Error("프로필 수정 실패");
      }

      const result = await response;
      onSubmitSuccess();
      onProfileClick(false);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  return (
    <div className="gap-1">
      <div className="flex flex-row justify-between pt-[20px]">
        <div>
          <div className="flex flex-row gap-8">
            <div className="flex flex-col">
              <Image
                src={previewImage || user.image}
                width={100}
                height={100}
                alt="Profile Picture"
                className="rounded-full object-cover"
              />
              <div className="items-center justify-items-center">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  className="mt-2 w-15 pl-1"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="w-10">
                  <span className="text-md">이름</span>
                </div>
                <Input
                  value={value.name}
                  onChange={e => setValue({ ...value, name: e.target.value })}
                />
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="flex flex-row justify-center items-center">
                  <span className="text-md">포트폴리오 주소</span>
                </div>
                <Input
                  value={value.portfolioAddress ?? ""}
                  onChange={e =>
                    setValue({ ...value, portfolioAddress: e.target.value })
                  }
                  className="ml-2"
                />
              </div>
              <div className="flex flex-row items-center justify-center gap-1">
                <div className="flex flex-row justify-center items-center">
                  <span className="text-md">Email</span>
                </div>
                <Input
                  value={value.email}
                  onChange={e => setValue({ ...value, email: e.target.value })}
                  className="ml-2"
                />
              </div>
            </div>
          </div>
          <div className="m-5 w-full">
            <div className="mb-5">
              <span className="text-md">소개글</span>
            </div>
            <Textarea
              value={value.introduce || ""}
              onChange={e => setValue({ ...value, introduce: e.target.value })}
              placeholder="자신을 소개하는 글을 적어보세요."
            />
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            className="w-20 hover:bg-[#0064ff] bg-[#1f9eff] text-white"
            onClick={handleSubmit}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
