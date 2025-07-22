"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSSENotification } from "@/hooks/useSSENotification";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";

export function NotificationBadge() {
  const { isLogin, loginUser } = useGlobalLoginUser();
  const [unreadCount, setUnreadCount] = useState(0);

  // SSE 알림 훅 사용
  const { lastMessage } = useSSENotification({
    enabled: isLogin,
    onMessage: (data) => {
      // 새 알림이 오면 읽지 않은 개수 증가
      setUnreadCount((prev) => prev + 1);
    },
  });

  // 컴포넌트 마운트 시 로컬 스토리지에서 읽지 않은 알림 개수 계산
  useEffect(() => {
    if (isLogin && loginUser?.id) {
      const savedNotifications = localStorage.getItem(
        `notifications-${loginUser.id}`
      );
      if (savedNotifications) {
        try {
          const notifications = JSON.parse(savedNotifications);
          const unread = notifications.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        } catch (error) {
          console.error("알림 데이터 파싱 오류:", error);
        }
      }
    }
  }, [isLogin, loginUser?.id]);

  // 알림 페이지를 방문했을 때 개수 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      if (isLogin && loginUser?.id) {
        const savedNotifications = localStorage.getItem(
          `notifications-${loginUser.id}`
        );
        if (savedNotifications) {
          try {
            const notifications = JSON.parse(savedNotifications);
            const unread = notifications.filter((n: any) => !n.isRead).length;
            setUnreadCount(unread);
          } catch (error) {
            console.error("알림 데이터 파싱 오류:", error);
          }
        } else {
          setUnreadCount(0);
        }
      }
    };

    // storage 이벤트와 focus 이벤트로 실시간 업데이트
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, [isLogin, loginUser?.id]);

  if (!isLogin) {
    return null;
  }

  return (
    <Link
      href="/notifications"
      className="relative text-purple-600 hover:text-purple-800 font-medium px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200"
    >
      🔔 알림센터
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
