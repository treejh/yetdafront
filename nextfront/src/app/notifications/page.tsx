"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSSENotification } from "@/hooks/useSSENotification";
import { useGlobalLoginUser } from "@/stores/auth/loginMember";

interface Notification {
  id: string;
  type: "connect" | "info" | "success" | "warning" | "error" | "alarm";
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { isLogin, loginUser } = useGlobalLoginUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // SSE 알림 훅 사용
  const { isConnected, connectionStatus, lastMessage } = useSSENotification({
    enabled: isLogin,
    onMessage: (data) => {
      console.log("알림 페이지에서 새 알림 수신:", data);

      const newNotification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        type: data.type as Notification["type"],
        message: data.message,
        timestamp: data.timestamp || new Date().toISOString(),
        isRead: false,
        data: data.data,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    },
    onConnect: () => {
      console.log("알림 페이지 SSE 연결됨");
    },
    onError: (error) => {
      console.error("알림 페이지 SSE 오류:", error);
    },
  });

  // 로그인 체크
  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }
  }, [isLogin, router]);

  // 기존 알림 불러오기 (로컬 스토리지에서)
  useEffect(() => {
    if (isLogin && loginUser?.id) {
      const savedNotifications = localStorage.getItem(
        `notifications-${loginUser.id}`
      );
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
        } catch (error) {
          console.error("알림 데이터 파싱 오류:", error);
        }
      }
    }
  }, [isLogin, loginUser?.id]);

  // 알림 저장 (로컬 스토리지에)
  useEffect(() => {
    if (isLogin && loginUser?.id && notifications.length > 0) {
      localStorage.setItem(
        `notifications-${loginUser.id}`,
        JSON.stringify(notifications)
      );
    }
  }, [notifications, isLogin, loginUser?.id]);

  // 알림 읽음 처리
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );

    // 읽음 상태 변경을 다른 탭에 알림
    window.dispatchEvent(new Event("storage"));
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );

    // 읽음 상태 변경을 다른 탭에 알림
    window.dispatchEvent(new Event("storage"));
  };

  // 알림 삭제
  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  // 모든 알림 삭제
  const deleteAllNotifications = () => {
    setNotifications([]);
    if (loginUser?.id) {
      localStorage.removeItem(`notifications-${loginUser.id}`);
    }
  };

  // 필터링된 알림
  const filteredNotifications = notifications
    .filter((notification) => {
      if (filter === "unread") return !notification.isRead;
      if (filter === "read") return notification.isRead;
      return true;
    })
    .sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
    });

  // 읽지 않은 알림 개수
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // 알림 타입별 아이콘
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "alarm":
        return "🔔";
      case "connect":
        return "🔗";
      default:
        return "ℹ️";
    }
  };

  // 알림 타입별 색상
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "alarm":
        return "border-purple-200 bg-purple-50";
      case "connect":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            로그인이 필요합니다
          </h2>
          <p className="text-gray-600">알림을 확인하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🔔 알림센터
              </h1>
              <p className="text-gray-600">
                새로운 알림과 업데이트를 확인하세요
              </p>
            </div>

            {/* 연결 상태 */}
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                실시간 알림 {isConnected ? "연결됨" : "연결 끊김"}
              </div>

              {unreadCount > 0 && (
                <div className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">
                  {unreadCount}개 읽지 않음
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* 필터 */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전체 ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                읽지 않음 ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "read"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                읽음 ({notifications.length - unreadCount})
              </button>
            </div>

            {/* 정렬 및 액션 */}
            <div className="flex gap-2">
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "newest" | "oldest")
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
              </select>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  모두 읽음
                </button>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={deleteAllNotifications}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                >
                  모두 삭제
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {filter === "all"
                ? "알림이 없습니다"
                : filter === "unread"
                ? "읽지 않은 알림이 없습니다"
                : "읽은 알림이 없습니다"}
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "새로운 알림이 오면 여기에 표시됩니다."
                : filter === "unread"
                ? "모든 알림을 확인했습니다!"
                : "아직 읽은 알림이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${getNotificationColor(
                  notification.type
                )} ${
                  !notification.isRead ? "border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium ${
                            notification.type === "success"
                              ? "bg-green-100 text-green-700"
                              : notification.type === "error"
                              ? "bg-red-100 text-red-700"
                              : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-700"
                              : notification.type === "alarm"
                              ? "bg-purple-100 text-purple-700"
                              : notification.type === "connect"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {notification.type.toUpperCase()}
                        </span>

                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>

                      <p
                        className={`text-gray-800 mb-2 ${
                          !notification.isRead ? "font-medium" : ""
                        }`}
                      >
                        {notification.message}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleString(
                          "ko-KR"
                        )}
                      </p>

                      {notification.data && (
                        <details className="mt-2">
                          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                            상세 정보 보기
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-auto">
                            {JSON.stringify(notification.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex gap-2 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        title="읽음 표시"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="삭제"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
