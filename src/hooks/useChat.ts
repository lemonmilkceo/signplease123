import { useState, useEffect, useCallback } from "react";
import { supabase, ChatRoom, ChatMessage } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

interface ChatRoomWithDetails extends ChatRoom {
  worker_name?: string;
  employer_name?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

export function useChat() {
  const { user, profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoomWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 채팅방 목록 가져오기
  const fetchChatRooms = useCallback(async () => {
    if (!user) {
      setChatRooms([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("chat_rooms")
        .select("*")
        .or(`employer_id.eq.${user.id},worker_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setChatRooms(data as ChatRoomWithDetails[]);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching chat rooms:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  return {
    chatRooms,
    isLoading,
    error,
    fetchChatRooms,
  };
}

export function useChatMessages(roomId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 메시지 가져오기
  const fetchMessages = useCallback(async () => {
    if (!roomId) {
      setMessages([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setMessages(data as ChatMessage[]);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  // 실시간 구독
  useEffect(() => {
    if (!roomId) return;

    fetchMessages();

    // Supabase Realtime 구독
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, fetchMessages]);

  // 메시지 전송
  const sendMessage = async (content: string, type: "text" | "file" = "text") => {
    if (!roomId || !user || !content.trim()) {
      return { error: new Error("Invalid message") };
    }

    try {
      const { data, error: sendError } = await supabase
        .from("chat_messages")
        .insert({
          room_id: roomId,
          sender_id: user.id,
          content: content.trim(),
          message_type: type,
          is_read: false,
        })
        .select()
        .single();

      if (sendError) {
        throw sendError;
      }

      return { data: data as ChatMessage, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  // 읽음 처리
  const markAsRead = async () => {
    if (!roomId || !user) return;

    try {
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("room_id", roomId)
        .neq("sender_id", user.id)
        .eq("is_read", false);
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    markAsRead,
    fetchMessages,
  };
}
