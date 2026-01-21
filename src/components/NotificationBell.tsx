import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRealtime } from "../hooks/useRealtime";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    requestNotificationPermission 
  } = useRealtime();

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    setShowDropdown(false);

    // 알림 타입에 따라 네비게이션
    switch (notification.type) {
      case "contract_signed":
      case "contract_received":
        if (notification.data?.contractId) {
          navigate(`/employer/contract/${notification.data.contractId}`);
        }
        break;
      case "message":
        if (notification.data?.roomId) {
          navigate("/employer/chat");
        }
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "contract_signed":
        return "✍️";
      case "contract_received":
        return "📝";
      case "message":
        return "💬";
      default:
        return "🔔";
    }
  };

  return (
    <div className="relative">
      {/* 벨 버튼 */}
      <button
        onClick={() => {
          setShowDropdown(!showDropdown);
          if (!showDropdown) {
            requestNotificationPermission();
          }
        }}
        className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
      >
        <svg className="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* 뱃지 */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* 드롭다운 */}
      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-body font-semibold text-foreground">알림</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-caption text-primary hover:underline"
                >
                  모두 읽음
                </button>
              )}
            </div>

            {/* 알림 목록 */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <p className="text-caption text-muted-foreground">새로운 알림이 없습니다</p>
                </div>
              ) : (
                notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-secondary/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-caption font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-caption text-muted-foreground truncate">{notification.body}</p>
                      <p className="text-caption text-muted-foreground mt-1">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 시간 포맷 헬퍼
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}
