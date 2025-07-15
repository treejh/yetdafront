"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
}

export default function ProjectImageGallery({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
        <Image
          src={images[activeIndex] || "/placeholder.svg"}
          alt="프로젝트 대표 이미지"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex space-x-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "w-20 h-20 relative rounded-lg overflow-hidden border-2",
              activeIndex === i ? "border-sky-500" : "border-gray-300",
            )}
          >
            <Image
              src={img}
              alt={`썸네일 ${i + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
