"use client";

import { User, MessageCircle } from "lucide-react";

import type { Creator } from "@/types/project/creator";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Props {
  creator: Creator;
  stats: {
    likes: number;
    shares: number;
    views: number;
  };
}

export default function ProjectSidebarPanel({ creator }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>창작자 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="w-12 h-12 border-2 border-gray-200 shadow-sm">
            <AvatarImage src={creator.userProfileImage} />
            <AvatarFallback>
              <User className="w-6 h-6" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{creator.name}</h3>
            <div className="text-sm text-gray-600">
              팔로워 {(creator.followerCount ?? 0).toLocaleString()}명
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{creator.userIntroduce}</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            팔로우
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
