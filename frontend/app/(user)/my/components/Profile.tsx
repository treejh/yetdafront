import { Mail } from "lucide-react";
import Image from "next/image";

import { useFollowCount } from "@/apis/my/useFollowCount";
import { Button } from "@/components/ui/button";

import { GithubBadge } from "./GithubBadge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/MyTooltip";

export interface User {
  name: string;
  email?: string;
  portfolioAddress?: string;
  image?: string;
  introduce?: string;
  followers?: number;
  following?: number;
}

interface ProfileProps {
  user: User;
  onEditClick: (isEditing: boolean) => void;
  purchaseProject: number;
}
export function Profile({ user, onEditClick, purchaseProject }: ProfileProps) {
  const followData = useFollowCount();

  return (
    <div className="flex flex-row items-center justify-between pt-[20px] pd-[20px]">
      <div className="flex flex-row items-center gap-8">
        <div className="items-center justify-center">
          <Image
            src={user.image || "/images/sample-image.jpg"}
            width={100}
            height={100}
            alt="Profile Picture"
            className="rounded-full"
          />
        </div>

        <div className="grid grid-rows-2 gap-y-0">
          <div className="flex flex-row items-center gap-1">
            <h3 className="text-lg font-bold">{user.name}</h3>
            {user.portfolioAddress ? (
              <GithubBadge githubUrl={user.portfolioAddress} />
            ) : null}
          </div>
          <div className="flex flex-row items-center gap-2 pb-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Mail className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>해당 이메일은 다른 사용자에게 보이지 않습니다.</p>
              </TooltipContent>
            </Tooltip>
            <p className="text-sm">{user.email}</p>
          </div>

          <div className="grid grid-cols-4 gap-10 text-center">
            <div className="grid grid-rows-2">
              <p className="text-[#868e96] text-sm">팔로잉</p>
              <p className="font-bold">
                {followData?.data?.followerCount ?? "0"}
              </p>
            </div>

            <div className="grid grid-rows-2">
              <p className="text-[#868e96] text-sm">팔로워</p>
              <p className="font-bold">
                {followData?.data?.followingCount ?? "0"}
              </p>
            </div>

            <div className="grid grid-rows-2">
              <p className="text-[#868e96] text-sm">구매수</p>
              <p className="font-bold">{purchaseProject}</p>
            </div>

            <div className="grid grid-rows-2">
              <p className="text-[#868e96] text-sm">후원수</p>
              <p className="font-bold">0</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <Button
          variant="outline"
          className="hover:bg-[#0064ff] bg-[#1f9eff] text-white"
          onClick={() => {
            onEditClick(true);
          }}
        >
          내 정보 수정
        </Button>
      </div>
    </div>
  );
}
