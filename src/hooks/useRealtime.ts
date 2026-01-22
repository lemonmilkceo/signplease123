import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Notification {
  id: string;
  type: "contract_signed" | "contract_received" | "message" | "system";
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export function useRealtime() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [_channel, setChannel] = useState<RealtimeChannel | null>(null);

  // 알림 추가
  const addNotification = useCallback((notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // 브라우저 알림 (권한이 있는 경우)
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.body,
        icon: "/icons/icon-192x192.png",
      });
    }
  }, []);

  // 알림 읽음 처리
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // 모든 알림 읽음 처리
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // 알림 삭제
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== notificationId);
    });
  }, []);

  // 브라우저 알림 권한 요청
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  }, []);

  // Realtime 구독 설정
  useEffect(() => {
    if (!user) return;

    // 계약서 변경 구독
    const contractChannel = supabase
      .channel(`contracts:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "contracts",
          filter: profile?.role === "employer" 
            ? `employer_id=eq.${user.id}` 
            : `worker_id=eq.${user.id}`,
        },
        (payload) => {
          const newData = payload.new as Record<string, unknown>;
          const oldData = payload.old as Record<string, unknown>;

          // 근로자 서명 완료 알림 (사업주에게)
          if (
            profile?.role === "employer" &&
            !oldData.worker_signature &&
            newData.worker_signature
          ) {
            addNotification({
              type: "contract_signed",
              title: "계약서 서명 완료",
              body: `${newData.worker_name}님이 계약서에 서명했습니다.`,
              data: { contractId: newData.id },
            });
          }

          // 계약서 상태 변경 알림
          if (oldData.status !== newData.status) {
            if (newData.status === "completed") {
              addNotification({
                type: "contract_signed",
                title: "계약 체결 완료",
                body: "계약서가 성공적으로 체결되었습니다.",
                data: { contractId: newData.id },
              });
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "contracts",
          filter: `worker_id=eq.${user.id}`,
        },
        (payload) => {
          // 새 계약서 수신 알림 (근로자에게)
          if (profile?.role === "worker") {
            const newContract = payload.new as Record<string, unknown>;
            addNotification({
              type: "contract_received",
              title: "새 계약서 도착",
              body: "새로운 근로계약서가 도착했습니다. 확인해주세요.",
              data: { contractId: newContract.id },
            });
          }
        }
      )
      .subscribe();

    // 채팅 메시지 구독
    const chatChannel = supabase
      .channel(`chat:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        async (payload) => {
          const newMessage = payload.new as Record<string, unknown>;
          
          // 자신이 보낸 메시지가 아닌 경우에만 알림
          if (newMessage.sender_id !== user.id) {
            // 채팅방 정보 확인
            const { data: room } = await supabase
              .from("chat_rooms")
              .select("*")
              .eq("id", newMessage.room_id)
              .single();

            if (room && (room.employer_id === user.id || room.worker_id === user.id)) {
              addNotification({
                type: "message",
                title: "새 메시지",
                body: newMessage.content as string,
                data: { roomId: newMessage.room_id },
              });
            }
          }
        }
      )
      .subscribe();

    setChannel(contractChannel);

    return () => {
      contractChannel.unsubscribe();
      chatChannel.unsubscribe();
    };
  }, [user, profile?.role, addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    requestNotificationPermission,
  };
}
