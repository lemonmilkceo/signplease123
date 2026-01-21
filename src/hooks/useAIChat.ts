import { useState, useCallback } from "react";
import { callEdgeFunction } from "../lib/supabase";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface SupportChatResponse {
  reply: string;
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "안녕하세요! 싸인해주세요 AI 상담원입니다. 무엇을 도와드릴까요? 😊",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 메시지 전송
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 대화 히스토리 구성 (최근 10개)
      const conversationHistory = messages
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await callEdgeFunction<SupportChatResponse>("support-chat", {
        message: content.trim(),
        conversationHistory,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      
      // 에러 시 안내 메시지 추가
      const errorAssistantMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요. 문제가 계속되면 support@signplease.kr로 문의해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  // 대화 초기화
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "안녕하세요! 싸인해주세요 AI 상담원입니다. 무엇을 도와드릴까요? 😊",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
