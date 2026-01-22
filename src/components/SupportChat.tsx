import { useState, useRef, useEffect } from "react";
import { useAIChat } from "../hooks/useAIChat";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface SupportChatProps {
  initialMessage?: string;
  placeholder?: string;
  className?: string;
}

const FAQ_SUGGESTIONS = [
  "크레딧은 어떻게 충전하나요?",
  "계약서를 수정할 수 있나요?",
  "전자서명의 법적 효력은?",
  "환불 정책이 어떻게 되나요?",
];

export default function SupportChat({
  initialMessage = "안녕하세요! 무엇을 도와드릴까요? 아래 자주 묻는 질문을 선택하거나, 직접 질문해주세요.",
  placeholder = "궁금한 점을 입력하세요...",
  className = "",
}: SupportChatProps) {
  const { sendMessage: sendAIMessage, isLoading } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: initialMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // AI 응답 요청
    try {
      await sendAIMessage(content);
      // AI 응답은 useAIChat 내부에서 처리됨
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.isUser
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-foreground rounded-bl-md"
              }`}
            >
              <p className="text-body whitespace-pre-wrap">{msg.content}</p>
              <p
                className={`text-caption mt-1 ${
                  msg.isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* FAQ 제안 (첫 메시지만 있을 때) */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <p className="text-caption text-muted-foreground mb-2">
            자주 묻는 질문
          </p>
          <div className="flex flex-wrap gap-2">
            {FAQ_SUGGESTIONS.map((faq, index) => (
              <button
                key={index}
                onClick={() => handleSend(faq)}
                className="px-3 py-2 bg-secondary rounded-full text-caption text-foreground hover:bg-secondary/80 transition-colors"
              >
                {faq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 입력 영역 */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isLoading}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              input.trim() && !isLoading
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
