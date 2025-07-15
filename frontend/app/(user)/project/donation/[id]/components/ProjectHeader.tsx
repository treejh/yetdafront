"use client";

import { Share2, User, Heart, Star } from "lucide-react";
import Link from "next/link";

import type { Project } from "@/types/project/project";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  project: Project;
}

export default function ProjectHeader({ project }: Props) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <Badge variant="outline">{project.purchaseCategoryName}</Badge>
        <Link href={`/project/new/sell/edit/${project.projectId}`}>
          <Button variant="outline" size="sm">
            수정하기
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      <p className="text-xl text-gray-600 mb-6">{project.introduce}</p>

      <div className="flex justify-between items-end mb-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-12 h-12 border-2 border-gray-200 shadow-sm">
            <AvatarImage
              src={project.userProfileImage || "/placeholder.svg"}
              className="object-cover"
            />
            <AvatarFallback>
              <User className="w-6 h-6 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{project.name ?? "없어요"}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>프로젝트 {project.projectCount ?? 0}개</span>
              <span>
                팔로워 {(project.followerCount ?? 0).toLocaleString()}명
              </span>
            </div>
          </div>
        </div>

        {project.stats && (
          <div className="flex gap-6 text-gray-700 text-sm font-medium relative -top-1.5">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1 text-red-500" />
              <span>{project.stats.likes}</span>
            </div>
            <div className="flex items-center">
              <Share2 className="w-4 h-4 mr-1 text-blue-500" />
              <span>{project.stats.shares}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
