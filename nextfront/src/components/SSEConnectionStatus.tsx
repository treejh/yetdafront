"use client";

interface SSEConnectionStatusProps {
  isConnected: boolean;
  connectionStatus: "disconnected" | "connecting" | "connected" | "error";
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  onReconnect: () => void;
}

export function SSEConnectionStatus({
  isConnected,
  connectionStatus,
  reconnectAttempts,
  maxReconnectAttempts,
  onReconnect,
}: SSEConnectionStatusProps) {
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "알림 연결됨";
      case "connecting":
        return "연결 중...";
      case "error":
        return "연결 오류";
      default:
        return "연결 안됨";
    }
  };

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}>
              {connectionStatus === "connecting" && (
                <div
                  className={`absolute inset-0 w-3 h-3 rounded-full ${getStatusColor()} animate-ping opacity-75`}
                ></div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              {getStatusText()}
            </div>

            {connectionStatus === "error" && reconnectAttempts > 0 && (
              <div className="text-xs text-gray-500">
                재연결 시도: {reconnectAttempts}/{maxReconnectAttempts}
              </div>
            )}
          </div>

          {connectionStatus === "error" && (
            <button
              onClick={onReconnect}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
            >
              재연결
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
