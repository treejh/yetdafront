"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// UI / 카드 컴포넌트
import MyProjectCard from "./components/ui/MyProjectCard";

// 마이페이지 구성 컴포넌트
import { Follower } from "./components/Follower";
import { Introduce } from "./components/Introduce";
import { Profile } from "./components/Profile";
import { TabBar } from "./components/TabBar";
import { ProfileEditForm } from "./components/ProfileEditForm";

// API 호출 관련

import { useFollow } from "@/apis/my/useFollow";
import { useFollowing } from "@/apis/my/useFollowing";
import { usePurchase } from "@/apis/my/usePurchase";
import { useOrderList } from "@/apis/my/useOrderList";
import { useUserStore } from "@/stores/useStore";

// 타입 정의
import { PurchaseProject } from "@/types/user/purchaseProject";
import { Order } from "@/types/user/orderList";
import { useCheckLogin } from "@/apis/my/useCheckLogin";

interface Tab {
  value: string;
  content: React.ReactNode;
}

export default function MyPage() {
  useCheckLogin();

  const router = useRouter();
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const isAuthenticated = useUserStore(state => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      const timeout = setTimeout(() => {
        alert("로그인이 필요합니다.");
        router.push("/login");
      }, 500); // 약간의 딜레이
      return () => clearTimeout(timeout);
    }
    setIsAuthLoading(false);
  }, [isAuthenticated]);

  const following = useFollowing();
  const followers = useFollow();
  const purchaseProjects: PurchaseProject | null | undefined = usePurchase();

  const orderList: Order[] | null | undefined = useOrderList();

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/mypage`,
        {
          withCredentials: true,
        },
      );
      setUserData(res.data.data);
    } catch (err) {
      console.error("로그인 필요 또는 인증 실패:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated]);

  const tabs: Tab[] = userData
    ? [
        {
          value: "소개글",
          content: <Introduce introduce={userData.introduce} />,
        },
        {
          value: "팔로워",
          content: (
            <Follower user={followers?.data} following={following?.data} />
          ),
        },
        {
          value: "팔로잉",
          content: (
            <Follower user={following?.data} following={following?.data} />
          ),
        },
        {
          value: "후원한 예따",
          // 후원한 프로젝트 api는 아직 없으므로 구매한 프로젝트 api를 활용하여 나타냈습니다.
          content: (
            <div className="grid grid-cols-4 justify-items-center">
              {purchaseProjects?.content?.map((project, index) => (
                <MyProjectCard
                  key={`${project.id}-${index}`}
                  project={{
                    id: project.id,
                    title: project.title,
                    purchaseOptions: project.purchaseOptions,
                    contentImageUrls:
                      project.contentImageUrls?.[0] ||
                      "/images/sample-image.jpg",
                    hostName: project.hostName,
                  }}
                />
              ))}
            </div>
          ),
        },

        {
          value: "구매한 예따",
          content: (
            <div className="grid grid-cols-4 justify-items-center">
              {purchaseProjects?.content?.map((project, index) => (
                <MyProjectCard
                  key={`${project.id}-${index}`}
                  project={{
                    id: project.id,
                    title: project.title,
                    purchaseOptions: project.purchaseOptions,
                    contentImageUrls:
                      project.contentImageUrls?.[0] ||
                      "/images/sample-image.jpg",
                    hostName: project.hostName,
                  }}
                />
              ))}
            </div>
          ),
        },
        {
          value: "등록한 프로젝트",
          content: (
            <div className="grid grid-cols-4 justify-items-center"></div>
          ),
        },
      ]
    : [];

  return (
    <main>
      {!userData ? (
        <div>로딩 중...</div>
      ) : isEditing ? (
        <ProfileEditForm
          user={userData}
          onProfileClick={setIsEditing}
          onSubmitSuccess={fetchUser}
        />
      ) : (
        <>
          <Profile
            user={userData}
            purchaseProject={orderList?.length ?? 0}
            onEditClick={setIsEditing}
          />
          <TabBar defaultValue="소개글" tabs={tabs} />
        </>
      )}
    </main>
  );
}
