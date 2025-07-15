"use client";

import { Palette, Target } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ProjectTypeSelectorProps {
  onSelect: (type: "sell" | "donation") => void;
}

export default function ProjectTypeSelector({
  onSelect,
}: ProjectTypeSelectorProps) {
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">
            어떤 프로젝트를 만드시나요?
          </h1>
          <p className="text-gray-600 text-lg">프로젝트 유형을 선택해주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="cursor-pointer border-gray-200 hover:shadow-lg transition-all duration-200 border-2 hover:border-sky-400"
            onClick={() => onSelect("sell")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">창작물 판매</h2>
              <p className="text-gray-600 mb-6">
                템플릿, 디자인 리소스, 코드 등<br />
                완성된 창작물을 판매하세요
              </p>
              <div className="space-y-2 space-x-1">
                <Badge variant="secondary" className="bg-gray-100">
                  즉시 구매
                </Badge>
                <Badge variant="secondary" className="bg-gray-100">
                  디지털 다운로드
                </Badge>
                <Badge variant="secondary" className="bg-gray-100">
                  고정 가격
                </Badge>
              </div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer  border-gray-200 hover:shadow-lg transition-all duration-200 border-2 hover:border-sky-400"
            onClick={() => onSelect("donation")}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">개발 프로젝트 후원</h2>
              <p className="text-gray-600 mb-6">
                앱, 서비스, 오픈소스 등<br />
                개발 프로젝트 후원을 받으세요
              </p>
              <div className="space-y-2 space-x-1">
                <Badge variant="secondary" className="bg-gray-100">
                  목표 금액
                </Badge>
                <Badge variant="secondary" className="bg-gray-100">
                  리워드 제공
                </Badge>
                <Badge variant="secondary" className="bg-gray-100">
                  단계별 개발
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
