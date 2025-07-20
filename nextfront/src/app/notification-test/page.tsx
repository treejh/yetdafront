"use client";

import { useState } from "react";
import { useSSENotification } from "@/hooks/useSSENotification";
import { NotificationToast } from "@/components/NotificationToast";
import { SSEConnectionStatus } from "@/components/SSEConnectionStatus";

export default function NotificationTestPage() {
  const [notifications, setNotifications] = useState<
    Array<{
      id: string;
      type: "connect" | "info" | "success" | "warning" | "error";
      message: string;
      timestamp: string;
    }>
  >([]);

  const {
    isConnected,
    connectionStatus,
    lastMessage,
    reconnect,
    reconnectAttempts,
    maxReconnectAttempts,
  } = useSSENotification({
    enabled: true,
    onMessage: (data) => {
      console.log("알림 수신:", data);
      const newNotification = {
        id: Date.now().toString() + Math.random(), // 고유 ID 생성
        type: data.type as any,
        message: data.message,
        timestamp: data.timestamp,
      };
      setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
    },
    onConnect: () => {
      console.log("SSE 연결 성공!");
    },
    onError: (error) => {
      console.error("SSE 연결 오류:", error);
    },
  });

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const sendTestMessage = () => {
    const testMessage = {
      id: Date.now().toString() + Math.random(),
      type: "info" as const,
      message: `테스트 메시지 - ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
    };
    setNotifications((prev) => [testMessage, ...prev].slice(0, 10));
  };

  const broadcastTestMessage = () => {
    // BroadcastChannel을 통해 다른 탭에 메시지 전송
    const channel = new BroadcastChannel("notification-channel");
    const testMessage = {
      type: "info",
      message: `BroadcastChannel 테스트 - ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
    };

    channel.postMessage({
      type: "NEW_NOTIFICATION",
      data: testMessage,
    });

    channel.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      {/* SSE 연결 상태 */}
      <SSEConnectionStatus
        isConnected={isConnected}
        connectionStatus={connectionStatus}
        reconnectAttempts={reconnectAttempts}
        maxReconnectAttempts={maxReconnectAttempts}
        onReconnect={reconnect}
      />

      {/* 알림 토스트 */}
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
      />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            SSE & BroadcastChannel 테스트
          </h1>
          <p className="text-lg text-gray-600">
            여러 탭을 열어서 알림 동기화를 테스트해보세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 연결 정보 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">연결 정보</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">연결 상태:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isConnected ? "연결됨" : "연결 안됨"}
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">상태:</span>
                <span className="text-gray-800">{connectionStatus}</span>
              </div>

              {reconnectAttempts > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    재연결 시도:
                  </span>
                  <span className="text-gray-800">
                    {reconnectAttempts}/{maxReconnectAttempts}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={sendTestMessage}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                로컬 테스트 메시지 생성
              </button>

              <button
                onClick={broadcastTestMessage}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 transition-colors font-medium"
              >
                BroadcastChannel 테스트 메시지 전송
              </button>

              <button
                onClick={reconnect}
                disabled={connectionStatus === "connecting"}
                className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectionStatus === "connecting"
                  ? "연결 중..."
                  : "SSE 재연결"}
              </button>
            </div>
          </div>

          {/* 최근 메시지 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              최근 메시지
            </h2>

            {lastMessage ? (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      lastMessage.type === "connect"
                        ? "bg-blue-100 text-blue-800"
                        : lastMessage.type === "success"
                        ? "bg-green-100 text-green-800"
                        : lastMessage.type === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : lastMessage.type === "error"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lastMessage.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(lastMessage.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-800 break-words">
                  {lastMessage.message}
                </p>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                아직 수신된 메시지가 없습니다
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                알림 히스토리 ({notifications.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    알림이 없습니다
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-400"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            notification.type === "connect"
                              ? "bg-blue-100 text-blue-800"
                              : notification.type === "success"
                              ? "bg-green-100 text-green-800"
                              : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : notification.type === "error"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            notification.timestamp
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 break-words">
                        {notification.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">사용법 안내</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                SSE 테스트
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 자동으로 백엔드 SSE 서버에 연결됩니다</li>
                <li>• 연결 상태가 실시간으로 표시됩니다</li>
                <li>• 서버에서 보내는 알림을 실시간으로 받습니다</li>
                <li>• 연결이 끊어지면 자동으로 재연결을 시도합니다</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                BroadcastChannel 테스트
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 새 탭에서 이 페이지를 열어보세요</li>
                <li>
                  • "BroadcastChannel 테스트 메시지 전송" 버튼을 클릭하세요
                </li>
                <li>• 모든 탭에서 동일한 알림이 표시됩니다</li>
                <li>• SSE 연결도 탭 간에 동기화됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
