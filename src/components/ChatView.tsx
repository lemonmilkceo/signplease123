import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
  type?: "text" | "file" | "contract";
  fileUrl?: string;
  fileName?: string;
}

interface ChatViewProps {
  messages: Message[];
  currentUserId: string;
  partnerName: string;
  partnerAvatar?: string;
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
  onBack: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export default function ChatView({
  messages,
  currentUserId,
  partnerName,
  partnerAvatar,
  isLoading = false,
  onSendMessage,
  onBack,
  onLoadMore,
  hasMore = false,
}: ChatViewProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 새 메시지 시 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 스크롤 맨 위 도달 시 이전 메시지 로드
  const handleScroll = () => {
    if (!messagesContainerRef.current || !hasMore || isLoading) return;

    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0) {
      onLoadMore?.();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  // 날짜별 그룹화
  const groupedMessages = messages.reduce((groups, message) => {
    const dateKey = message.timestamp.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="flex items-center gap-3 max-w-[448px] mx-auto">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
              {partnerAvatar ? (
                <img src={partnerAvatar} alt={partnerName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">👤</span>
              )}
            </div>
            <div>
              <p className="text-body font-semibold text-foreground">{partnerName}</p>
              <p className="text-caption text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                온라인
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 메시지 영역 */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        <div className="max-w-[448px] mx-auto space-y-4">
          {/* 이전 메시지 로딩 */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={onLoadMore}
                disabled={isLoading}
                className="text-caption text-primary hover:underline"
              >
                {isLoading ? "로딩 중..." : "이전 메시지 보기"}
              </button>
            </div>
          )}

          {/* 날짜별 메시지 */}
          {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
            <div key={dateKey}>
              {/* 날짜 구분선 */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-caption text-muted-foreground">
                  {formatDate(new Date(dateKey))}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* 메시지들 */}
              {dateMessages.map((message) => {
                const isOwn = message.senderId === currentUserId;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}
                  >
                    <div className={`flex items-end gap-2 max-w-[80%] ${isOwn ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          isOwn
                            ? "bg-primary text-primary-foreground rounded-tr-md"
                            : "bg-secondary text-foreground rounded-tl-md"
                        }`}
                      >
                        {message.type === "file" && message.fileUrl ? (
                          <a
                            href={message.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="underline">{message.fileName || "파일"}</span>
                          </a>
                        ) : message.type === "contract" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📝</span>
                            <span>{message.content}</span>
                          </div>
                        ) : (
                          <p className="text-body whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-caption text-muted-foreground">
                          {formatTime(message.timestamp)}
                        </span>
                        {isOwn && message.isRead && (
                          <span className="text-caption text-primary">읽음</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* 타이핑 인디케이터 */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 safe-area-pb">
        <div className="max-w-[448px] mx-auto flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-secondary border-0 rounded-xl text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              inputMessage.trim() && !isLoading
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
