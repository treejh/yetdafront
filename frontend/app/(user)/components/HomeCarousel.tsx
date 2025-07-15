"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomeCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full h-1/3">
      <Carousel opts={{ loop: true }} setApi={setApi}>
        <CarouselContent>
          <CarouselItem className="w-full relative">
            <Image
              src="/images/sample-carousel-1.png"
              width={1280}
              height={400}
              alt="sample"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
              <h2 className="text-2xl font-bold mb-2">
                창작물과 개발물에 투자하세요
              </h2>
              <p className="text-sm">
                노션 템플릿, 웹 서비스 등 다양한 프로젝트를 둘러보세요.
              </p>
            </div>
          </CarouselItem>

          <CarouselItem className="w-full relative">
            <Image
              src="/images/sample-carousel-2.png"
              width={1280}
              height={400}
              alt="sample"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-8">
              <h2 className="text-2xl font-bold mb-2">
                창작물과 개발물에 투자하세요
              </h2>
              <p className="text-sm">
                누구나 창작자나 개발자가 될 수 있습니다. 당신의 아이디어를
                실현하세요.
              </p>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
