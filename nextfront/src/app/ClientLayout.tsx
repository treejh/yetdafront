"use client";

import { useEffect, useState } from "react";
import { LoginUserContext, useLoginUser } from "@/stores/auth/loginMember";
import { useSSENotification } from "@/hooks/useSSENotification";
import { NotificationToast } from "@/components/NotificationToast";
import { SSEConnectionStatus } from "@/components/SSEConnectionStatus";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const {
    loginUser,
    setLoginUser,
    isLoginUserPending,
    setNoLoginUser,
    isLogin,
    logout,
    logoutAndHome,
  } = useLoginUser();

  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "connect" | "info" | "success" | "warning" | "error";
      message: string;
      timestamp: string;
    }>
  >([]);

  // 로그인된 사용자에게만 SSE 연결
  const {
    isConnected,
    connectionStatus,
    lastMessage,
    reconnect,
    reconnectAttempts,
    maxReconnectAttempts,
  } = useSSENotification({
    enabled: isLogin, // 로그인된 사용자에게만 SSE 연결
    onMessage: (data) => {
      console.log("전역 알림 수신:", data);
      const newNotification = {
        id: Date.now().toString(),
        type: data.type as any,
        message: data.message,
        timestamp: data.timestamp,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 5));
    },
    onConnect: () => {
      console.log("전역 SSE 연결 성공!");
    },
    onError: (error) => {
      console.error("전역 SSE 연결 오류:", error);
    },
  });

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const LoginUserContextValue = {
    loginUser,
    setLoginUser,
    isLoginUserPending,
    setNoLoginUser,
    isLogin,
    logout,
    logoutAndHome,
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/user/me`, {
      credentials: "include", // 쿠키를 포함하도록 설정
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Not authenticated");
      })
      .then((result) => {
        // 서버로부터 받은 데이터 처리
        if (result.data) {
          setLoginUser(result.data);
        } else {
          setNoLoginUser();
        }
      })
      .catch((error) => {
        setNoLoginUser();
      });
  }, []);

  if (isLoginUserPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>로딩중</div>
      </div>
    );
  }

  return (
    <LoginUserContext.Provider value={LoginUserContextValue}>
      {/* 로그인된 사용자에게만 SSE 상태와 알림 표시 */}
      {isLogin && (
        <>
          <SSEConnectionStatus
            isConnected={isConnected}
            connectionStatus={connectionStatus}
            reconnectAttempts={reconnectAttempts}
            maxReconnectAttempts={maxReconnectAttempts}
            onReconnect={reconnect}
          />
          <NotificationToast
            notifications={notifications}
            onRemove={removeNotification}
          />
        </>
      )}
      <main className="bg-[#F4F4F4] min-h-screen">{children}</main>
    </LoginUserContext.Provider>
  );
}
