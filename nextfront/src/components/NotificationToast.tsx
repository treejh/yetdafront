"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "connect" | "info" | "success" | "warning" | "error" | "alarm";
  message: string;
  timestamp: string;
}

interface NotificationToastProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export function NotificationToast({
  notifications,
  onRemove,
}: NotificationToastProps) {
  const getNotificationStyle = (type: Notification["type"]) => {
    switch (type) {
      case "connect":
        return "bg-blue-500 text-white border-blue-600";
      case "success":
        return "bg-green-500 text-white border-green-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "alarm":
        return "bg-orange-500 text-white border-orange-600";
      case "error":
        return "bg-red-500 text-white border-red-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "connect":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className="w-5 h-5"
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
        );
      case "warning":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "alarm":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          style={getNotificationStyle(notification.type)}
          icon={getIcon(notification.type)}
        />
      ))}
    </div>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  style: string;
  icon: React.ReactNode;
}

function NotificationItem({
  notification,
  onRemove,
  style,
  icon,
}: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 애니메이션을 위해 약간의 지연
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 자동 제거 (5초 후)
    const timer = setTimeout(() => {
      handleRemove();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        ${style}
        rounded-lg shadow-lg border-l-4 p-4 min-w-[300px]
        hover:shadow-xl cursor-pointer
      `}
      onClick={handleRemove}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium break-words">
            {notification.message}
          </div>
          <div className="text-xs opacity-75 mt-1">
            {formatTime(notification.timestamp)}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
