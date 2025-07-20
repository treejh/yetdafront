"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSSENotification } from "@/hooks/useSSENotification";
import { NotificationToast } from "@/components/NotificationToast";
import { SSEConnectionStatus } from "@/components/SSEConnectionStatus";

interface ProjectRequest {
  id: number;
  hostId: number;
  hostName: string;
  title: string;
  type: string;
  status: string;
  category: string;
  createdDate: string;
  introduce: string;
  content: string;
}

interface NotificationTestData {
  targetUserId?: number;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
}

interface Notification {
  id: string;
  type: "connect" | "info" | "success" | "warning" | "error" | "alarm";
  message: string;
  timestamp: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // SSE 알림 훅 사용
  const { isConnected, connectionStatus, lastMessage, reconnect, disconnect } =
    useSSENotification({
      enabled: isAuthenticated,
      onMessage: (data) => {
        console.log("관리자 페이지에서 알림 수신:", data);

        // 알람 이벤트 전용 처리
        if (data.type === "alarm") {
          console.log("=== 백엔드 알람 이벤트 관리자 페이지 처리 ===");
          console.log("알람 데이터:", data.data);
          console.log("알람 메시지:", data.message);
          console.log("수신 시각:", data.timestamp);

          // 관리자 페이지에 알람 알림 추가
          const notification: Notification = {
            id: `alarm-${Date.now()}`,
            type: "warning", // 알람은 경고 타입으로 표시
            message: `🚨 시스템 알람: ${data.message}`,
            timestamp: data.timestamp,
          };

          setNotifications((prev) => [notification, ...prev]);
          console.log("관리자 알람 알림 추가됨:", notification);
        } else {
          // 기존 일반 알림 처리
          const notification: Notification = {
            id: `notification-${Date.now()}`,
            type: data.type as any,
            message: data.message,
            timestamp: data.timestamp,
          };

          setNotifications((prev) => [notification, ...prev]);
        }
      },
    });

  // 새 메시지가 오면 알림 목록에 추가
  useEffect(() => {
    if (lastMessage) {
      const getNotificationType = (
        type: string
      ): "connect" | "info" | "success" | "warning" | "error" | "alarm" => {
        switch (type.toLowerCase()) {
          case "연결":
          case "connect":
            return "connect";
          case "성공":
          case "success":
            return "success";
          case "경고":
          case "warning":
            return "warning";
          case "알람":
          case "alarm":
            return "alarm";
          case "오류":
          case "error":
            return "error";
          default:
            return "info";
        }
      };

      const newNotification: Notification = {
        id: Date.now().toString(),
        type: getNotificationType(lastMessage.type),
        message: lastMessage.message,
        timestamp: lastMessage.timestamp || new Date().toISOString(),
      };
      setNotifications((prev) => [...prev, newNotification]);
    }
  }, [lastMessage]);

  // 알림 해제 함수
  const dismissNotification = (id: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id.toString())
    );
  };

  // 모든 알림 클리어
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 알림 테스트 관련 상태
  const [notificationData, setNotificationData] =
    useState<NotificationTestData>({
      message: "",
      type: "INFO",
    });

  // 관리자 인증 확인
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/token/admin`,
        {
          method: "POST",
          credentials: "include", // 쿠키 포함
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsAuthenticated(true);
        console.log("관리자 인증 성공");
        // 인증 성공 시 프로젝트 요청 리스트 조회
        fetchProjectRequests();
      } else {
        setIsAuthenticated(false);
        alert("관리자 권한이 필요합니다.");
        router.push("/");
      }
    } catch (error) {
      console.error("관리자 인증 확인 실패:", error);
      setIsAuthenticated(false);
      alert("관리자 인증 확인 중 오류가 발생했습니다.");
      router.push("/");
    } finally {
      setAuthLoading(false);
    }
  };

  // 프로젝트 요청 리스트 조회
  const fetchProjectRequests = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        type: "PURCHASE",
        statuses: "UNDER_AUDIT,REJECTED,RECRUITING,COMPLETED",
        page: "0",
        size: "20",
        sort: "createdAt,desc",
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/project?${queryParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("API 응답:", result);
        // 응답 구조: { data: { content: [...] } }
        setProjectRequests(result.data?.content || []);
      } else {
        console.error("프로젝트 요청 리스트 조회 실패", response.status);
      }
    } catch (error) {
      console.error("프로젝트 요청 리스트 조회 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 알림 테스트 전송
  const sendTestNotification = async () => {
    if (!notificationData.message.trim()) {
      alert("알림 메시지를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/notification/test`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        }
      );

      if (response.ok) {
        alert("테스트 알림이 전송되었습니다.");
        setNotificationData({ message: "", type: "INFO" });
      } else {
        alert("알림 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("알림 전송 오류:", error);
      alert("알림 전송 중 오류가 발생했습니다.");
    }
  };

  // 프로젝트 요청 상태 업데이트
  const updateProjectStatus = async (requestId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/project-requests/${requestId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        alert("상태가 업데이트되었습니다.");
        fetchProjectRequests(); // 리스트 새로고침
      } else {
        alert("상태 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("상태 업데이트 오류:", error);
      alert("상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중이거나 인증되지 않은 경우
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">관리자 권한 확인 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 리다이렉트 처리됨
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* 알림 토스트 */}
      <NotificationToast
        notifications={notifications}
        onRemove={(id) => dismissNotification(parseInt(id))}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  관리자 페이지
                </h1>
                <p className="text-gray-600">
                  시스템 관리 및 프로젝트 요청 관리를 수행할 수 있습니다
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {/* SSE 연결 상태 */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      connectionStatus === "connected"
                        ? "bg-green-500"
                        : connectionStatus === "connecting"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm text-gray-600">
                    SSE: {connectionStatus}
                  </span>
                  {!isConnected && (
                    <button
                      onClick={reconnect}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      재연결
                    </button>
                  )}
                </div>
                {/* 알림 클리어 버튼 */}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all duration-300 text-sm"
                  >
                    알림 모두 지우기 ({notifications.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 알림 테스트 섹션 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                📢 알림 테스트
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대상 사용자 ID (선택사항)
                  </label>
                  <input
                    type="number"
                    value={notificationData.targetUserId || ""}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        targetUserId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="비워두면 전체 사용자에게 전송"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    알림 타입
                  </label>
                  <select
                    value={notificationData.type}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        type: e.target.value as NotificationTestData["type"],
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="INFO">정보</option>
                    <option value="SUCCESS">성공</option>
                    <option value="WARNING">경고</option>
                    <option value="ERROR">오류</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메시지 내용
                  </label>
                  <textarea
                    value={notificationData.message}
                    onChange={(e) =>
                      setNotificationData({
                        ...notificationData,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="테스트 알림 메시지를 입력하세요"
                  />
                </div>

                <button
                  onClick={sendTestNotification}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-medium"
                >
                  테스트 알림 전송
                </button>
              </div>
            </div>

            {/* 알림 히스토리 섹션 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  🔔 알림 히스토리
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    총 {notifications.length}개
                  </span>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-300 text-xs"
                    >
                      전체 삭제
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📭</div>
                    <p>받은 알림이 없습니다</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        notification.type === "alarm" ||
                        notification.type === "warning"
                          ? "bg-yellow-50 border-yellow-400"
                          : notification.type === "error"
                          ? "bg-red-50 border-red-400"
                          : notification.type === "success"
                          ? "bg-green-50 border-green-400"
                          : notification.type === "connect"
                          ? "bg-blue-50 border-blue-400"
                          : "bg-gray-50 border-gray-400"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
                              {notification.type === "alarm" ||
                              notification.type === "warning"
                                ? "🚨 알람"
                                : notification.type === "error"
                                ? "❌ 오류"
                                : notification.type === "success"
                                ? "✅ 성공"
                                : notification.type === "connect"
                                ? "🔗 연결"
                                : "ℹ️ 정보"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString(
                                "ko-KR"
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-800 break-words">
                            {notification.message}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            dismissNotification(parseInt(notification.id))
                          }
                          className="ml-2 text-gray-400 hover:text-gray-600 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mt-8">
            {/* 통계 카드 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                📊 프로젝트 요청 현황
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {
                      projectRequests.filter(
                        (req) => req.status === "UNDER_AUDIT"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-800">심사중</div>
                </div>

                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      projectRequests.filter((req) => req.status === "REJECTED")
                        .length
                    }
                  </div>
                  <div className="text-sm text-red-800">거부됨</div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      projectRequests.filter(
                        (req) => req.status === "RECRUITING"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-blue-800">모집중</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      projectRequests.filter(
                        (req) => req.status === "COMPLETED"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-800">완료</div>
                </div>
              </div>

              <button
                onClick={fetchProjectRequests}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium"
              >
                새로고침
              </button>
            </div>
          </div>

          {/* 프로젝트 요청 리스트 */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              📋 프로젝트 생성 요청 리스트
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">로딩 중...</div>
              </div>
            ) : projectRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">
                  프로젝트 요청이 없습니다.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        호스트
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        카테고리
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        프로젝트 제목
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        타입
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        상태
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        생성일
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projectRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {request.hostName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {request.category}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                          {request.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {request.type}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === "UNDER_AUDIT"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : request.status === "RECRUITING"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {request.status === "UNDER_AUDIT"
                              ? "심사중"
                              : request.status === "REJECTED"
                              ? "거부됨"
                              : request.status === "RECRUITING"
                              ? "모집중"
                              : "완료"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(request.createdDate).toLocaleDateString(
                            "ko-KR"
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {request.status === "UNDER_AUDIT" && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  updateProjectStatus(request.id, "RECRUITING")
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                승인
                              </button>
                              <button
                                onClick={() =>
                                  updateProjectStatus(request.id, "REJECTED")
                                }
                                className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                              >
                                거부
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
