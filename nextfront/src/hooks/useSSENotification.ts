"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

interface NotificationData {
  type: string;
  message: string;
  timestamp: string;
  data?: any; // 원본 데이터 보존을 위한 선택적 속성
}

interface UseSSENotificationProps {
  enabled?: boolean;
  onMessage?: (data: NotificationData) => void;
  onConnect?: () => void;
  onError?: (error: Error) => void;
}

export function useSSENotification({
  enabled = true,
  onMessage,
  onConnect,
  onError,
}: UseSSENotificationProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "error"
  >("disconnected");
  const [lastMessage, setLastMessage] = useState<NotificationData | null>(null);
  const eventSourceRef = useRef<EventSourcePolyfill | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isInitializedRef = useRef(false);

  const disconnect = useCallback(() => {
    console.log("disconnect 함수 호출됨");
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.close();
      broadcastChannelRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus("disconnected");
    isInitializedRef.current = false;
  }, []);

  const connect = useCallback(() => {
    console.log("connect 함수 호출됨", {
      enabled,
      hasEventSource: !!eventSourceRef.current,
      connectionStatus,
      isInitialized: isInitializedRef.current,
    });

    if (!enabled || eventSourceRef.current || isInitializedRef.current) {
      console.log("연결 중단 조건:", {
        enabled,
        hasEventSource: !!eventSourceRef.current,
        isInitialized: isInitializedRef.current,
      });
      return;
    }

    try {
      console.log("SSE 연결 시도 시작");
      isInitializedRef.current = true;
      setConnectionStatus("connecting");

      // BroadcastChannel 초기화
      if (!broadcastChannelRef.current) {
        const channel = new BroadcastChannel("notification-channel");

        // 다른 탭에서 오는 알림 동기화
        channel.onmessage = (event) => {
          console.log("=== BroadcastChannel 메시지 수신 ===");
          console.log("BroadcastChannel 원본 데이터:", event.data);
          console.log("메시지 타입:", event.data.type);

          if (event.data.type === "NEW_NOTIFICATION") {
            console.log("=== BroadcastChannel 알림 동기화 ===");
            console.log("동기화할 알림 데이터:", event.data.data);

            const notificationData: NotificationData = {
              type: event.data.data.type || "info",
              message: event.data.data.message || event.data.data,
              timestamp: event.data.data.timestamp || new Date().toISOString(),
            };

            console.log(
              "BroadcastChannel로 동기화된 최종 알림:",
              notificationData
            );

            setLastMessage(notificationData);
            onMessage?.(notificationData);
          } else if (event.data.type === "NEW_ALARM") {
            console.log("=== BroadcastChannel 알람 동기화 ===");
            console.log("동기화할 알람 데이터:", event.data.data);

            const alarmData: NotificationData = {
              type: event.data.data.type || "alarm",
              message: event.data.data.message || "새로운 알람",
              timestamp: event.data.data.timestamp || new Date().toISOString(),
              data: event.data.data.data, // 원본 알람 데이터 보존
            };

            console.log("BroadcastChannel로 동기화된 최종 알람:", alarmData);

            setLastMessage(alarmData);
            onMessage?.(alarmData);
          } else if (event.data.type === "CONNECTION_STATUS") {
            console.log("=== BroadcastChannel 연결 상태 동기화 ===");
            console.log("연결 상태:", event.data.status);
            setIsConnected(event.data.status === "connected");
            setConnectionStatus(event.data.status);
          }
        };

        broadcastChannelRef.current = channel;
      }

      const eventSource = new EventSourcePolyfill(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/alarm/stream`,
        {
          withCredentials: true, // 쿠키 포함
        }
      );

      eventSource.onopen = () => {
        console.log("=== SSE 연결 성공 ===");
        console.log("SSE URL:", `http://localhost:8080/api/v1/alarm/stream`);
        console.log("연결 시각:", new Date().toISOString());
        console.log("EventSource readyState:", eventSource.readyState);

        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttemptsRef.current = 0;

        // BroadcastChannel로 연결 상태 전파
        if (broadcastChannelRef.current) {
          console.log("BroadcastChannel로 연결 상태 전파 중...");
          broadcastChannelRef.current.postMessage({
            type: "CONNECTION_STATUS",
            status: "connected",
          });
        }

        console.log("onConnect 콜백 호출 중...");
        onConnect?.();
        console.log("=== SSE 연결 성공 완료 ===");
      };

      // 백엔드 알람 이벤트 전용 리스너 추가 (addEventListener 방식)
      eventSource.addEventListener("alarm", (event) => {
        console.log("📥 실시간 알림 수신:", event);
        const data = JSON.parse((event as MessageEvent).data);
        console.log("📥 실시간 알림 수신:", data);

        console.log("=== 백엔드 알람 이벤트 수신 ===");
        console.log("알람 이벤트 데이터:", (event as MessageEvent).data);
        console.log("알람 이벤트 타입:", event.type);
        console.log("알람 이벤트 시각:", new Date().toISOString());

        try {
          const alarmData = data;
          console.log("=== 알람 데이터 파싱 결과 ===");
          console.log("알람 데이터:", alarmData);
          console.log("알람 구조:", JSON.stringify(alarmData, null, 2));

          const notificationData: NotificationData = {
            type: "alarm", // 알람 전용 타입
            message:
              alarmData.message || `새로운 알람: ${JSON.stringify(alarmData)}`,
            timestamp: new Date().toISOString(),
            data: alarmData, // 원본 알람 데이터 보존
          };

          console.log("=== 알람 알림 데이터 생성 ===");
          console.log("알람 알림 데이터:", notificationData);

          setLastMessage(notificationData);
          onMessage?.(notificationData);

          // BroadcastChannel로 다른 탭에 알람 전파
          if (broadcastChannelRef.current) {
            console.log("BroadcastChannel로 알람 전파 중...");
            broadcastChannelRef.current.postMessage({
              type: "NEW_ALARM",
              data: notificationData,
            });
          }
        } catch (error) {
          console.error("=== 알람 데이터 파싱 오류 ===");
          console.error("알람 파싱 오류:", error);
          console.log(
            "원본 알람 데이터 (파싱 실패):",
            (event as MessageEvent).data
          );

          const notificationData: NotificationData = {
            type: "alarm",
            message: `알람 수신: ${(event as MessageEvent).data}`,
            timestamp: new Date().toISOString(),
          };

          setLastMessage(notificationData);
          onMessage?.(notificationData);
        }
      });

      eventSource.onmessage = (event) => {
        console.log("=== SSE 원본 데이터 수신 ===");
        console.log("event.data:", event.data);
        console.log("event.type:", event.type);
        console.log("event.lastEventId:", event.lastEventId);

        try {
          const data = JSON.parse(event.data);
          console.log("=== SSE 파싱된 데이터 ===");
          console.log("파싱된 데이터:", data);
          console.log("데이터 타입:", typeof data);
          console.log("데이터 구조:", JSON.stringify(data, null, 2));

          const notificationData: NotificationData = {
            type: data.type || "info",
            message: data.message || data,
            timestamp: new Date().toISOString(),
          };

          console.log("=== 최종 알림 데이터 ===");
          console.log("최종 알림 데이터:", notificationData);

          setLastMessage(notificationData);
          onMessage?.(notificationData);

          // BroadcastChannel로 다른 탭에 알림 전파
          if (broadcastChannelRef.current) {
            console.log("BroadcastChannel로 알림 전파 중...");
            broadcastChannelRef.current.postMessage({
              type: "NEW_NOTIFICATION",
              data: notificationData,
            });
          }
        } catch (error) {
          console.error("=== SSE 메시지 파싱 오류 ===");
          console.error("파싱 오류:", error);
          console.log("원본 데이터 (파싱 실패):", event.data);

          const notificationData: NotificationData = {
            type: "info",
            message: event.data,
            timestamp: new Date().toISOString(),
          };

          console.log("=== 파싱 실패 시 대체 데이터 ===");
          console.log("대체 알림 데이터:", notificationData);

          setLastMessage(notificationData);
          onMessage?.(notificationData);

          // BroadcastChannel로 다른 탭에 알림 전파
          if (broadcastChannelRef.current) {
            console.log("BroadcastChannel로 알림 전파 중 (파싱 실패)...");
            broadcastChannelRef.current.postMessage({
              type: "NEW_NOTIFICATION",
              data: notificationData,
            });
          }
        }
      };

      // connect 이벤트 리스너 추가 (백엔드에서 name("connect")로 보내는 이벤트 처리)
      eventSource.addEventListener("connect", (event) => {
        console.log("=== Connect 이벤트 수신 ===");
        console.log("connect event.data:", (event as MessageEvent).data);
        console.log("connect event.type:", event.type);
        console.log(
          "connect event.lastEventId:",
          (event as MessageEvent).lastEventId
        );

        const notificationData: NotificationData = {
          type: "connect",
          message: (event as MessageEvent).data,
          timestamp: new Date().toISOString(),
        };

        console.log("=== Connect 최종 알림 데이터 ===");
        console.log("Connect 알림 데이터:", notificationData);

        setLastMessage(notificationData);
        onMessage?.(notificationData);

        // BroadcastChannel로 다른 탭에 연결 이벤트 전파
        if (broadcastChannelRef.current) {
          console.log("BroadcastChannel로 Connect 이벤트 전파 중...");
          broadcastChannelRef.current.postMessage({
            type: "NEW_NOTIFICATION",
            data: notificationData,
          });
        }
      });

      // 특별한 이벤트 타입 처리는 제거 (onopen에서 이미 처리됨)

      eventSource.onerror = (error) => {
        console.error("SSE 연결 오류:", error);
        setIsConnected(false);
        setConnectionStatus("error");

        // BroadcastChannel로 오류 상태 전파
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: "CONNECTION_STATUS",
            status: "error",
          });
        }

        const errorObj = new Error("SSE 연결 오류");
        onError?.(errorObj);

        // 자동 재연결 로직
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          ); // 지수 백오프
          console.log(
            `${delay}ms 후 재연결 시도... (${
              reconnectAttemptsRef.current + 1
            }/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            if (eventSourceRef.current) {
              eventSourceRef.current.close();
              eventSourceRef.current = null;
            }
            isInitializedRef.current = false;
            connect();
          }, delay);
        } else {
          console.log("최대 재연결 시도 횟수에 도달했습니다.");
          setConnectionStatus("error");
        }
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error("SSE 연결 초기화 오류:", error);
      setConnectionStatus("error");
      isInitializedRef.current = false;
      onError?.(error as Error);
    }
  }, [enabled, onMessage, onConnect, onError]);

  const reconnect = useCallback(() => {
    console.log("reconnect 함수 호출됨");
    disconnect();
    reconnectAttemptsRef.current = 0;
    setTimeout(() => {
      isInitializedRef.current = false;
      connect();
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("메인 useEffect 실행됨", {
      enabled,
      hasEventSource: !!eventSourceRef.current,
      isInitialized: isInitializedRef.current,
    });

    if (enabled && !isInitializedRef.current) {
      connect();
    } else if (
      !enabled &&
      (eventSourceRef.current || isInitializedRef.current)
    ) {
      disconnect();
    }
  }, [enabled]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      console.log("컴포넌트 언마운트 - 모든 연결 정리");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, []);

  // 페이지가 숨겨지거나 보일 때 처리
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 페이지가 숨겨질 때는 연결을 유지
        console.log("페이지가 숨겨짐 - SSE 연결 유지");
      } else {
        // 페이지가 다시 보일 때 연결 상태 확인
        console.log("페이지가 다시 보임 - SSE 연결 상태 확인");
        if (enabled && !isConnected) {
          reconnect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, isConnected, reconnect]);

  return {
    isConnected,
    connectionStatus,
    lastMessage,
    reconnect,
    disconnect,
    reconnectAttempts: reconnectAttemptsRef.current,
    maxReconnectAttempts,
  };
}
