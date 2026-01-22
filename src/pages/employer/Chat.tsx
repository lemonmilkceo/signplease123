import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChat, useChatMessages } from "../../hooks/useChat";
import { useAuth } from "../../hooks";

export default function EmployerChat() {
  const { user } = useAuth();
  const { chatRooms, isLoading: isRoomsLoading } = useChat();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const { messages, isLoading: isMessagesLoading, sendMessage, markAsRead } = useChatMessages(selectedRoomId);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedRoomId) {
      markAsRead();
    }
  }, [selectedRoomId, markAsRead]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await sendMessage(newMessage, "text");
    setNewMessage("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: 실제 파일 업로드 구현
    await sendMessage(`📎 ${file.name}`, "file");
    alert(`파일 "${file.name}" 업로드 완료`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  };

  const selectedRoom = chatRooms.find(r => r.id === selectedRoomId);

  // 채팅방 목록 뷰
  if (!selectedRoomId) {
    return (
      <div className="min-h-screen bg-background flex flex-col pb-20">
        {/* 헤더 */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
          <div className="max-w-[448px] mx-auto">
            <h1 className="text-title text-foreground">채팅</h1>
          </div>
        </header>

        {/* 채팅방 목록 */}
        <main className="flex-1 mobile-container py-4">
          {isRoomsLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mb-4" />
              <p className="text-body text-muted-foreground">불러오는 중...</p>
            </div>
          ) : chatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-body text-muted-foreground">채팅방이 없습니다.</p>
              <p className="text-caption text-muted-foreground mt-1">계약을 체결하면 자동으로 채팅방이 생성됩니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    👷
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-body font-semibold text-foreground">
                        {room.worker_name || "근로자"}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {room.last_message_time || formatTime(room.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-caption text-muted-foreground truncate max-w-[200px]">
                        {room.last_message || "새 채팅방"}
                      </span>
                      {(room.unread_count || 0) > 0 && (
                        <span className="bg-destructive text-white text-caption px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {room.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </main>

        {/* 하단 네비게이션 */}
        <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border safe-area-pb">
          <div className="flex justify-around max-w-[448px] mx-auto py-3">
            <Link to="/employer" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xl">📋</span>
              <span className="text-caption">계약</span>
            </Link>
            <Link to="/employer/chat" className="flex flex-col items-center gap-1 text-primary">
              <span className="text-xl">💬</span>
              <span className="text-caption font-medium">채팅</span>
            </Link>
            <Link to="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xl">👤</span>
              <span className="text-caption">설정</span>
            </Link>
          </div>
        </nav>
      </div>
    );
  }

  // 채팅 뷰
  return (
    <div className="flex flex-col h-screen max-w-[448px] mx-auto bg-background">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10 p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSelectedRoomId(null)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
            👷
          </div>
          <div className="flex-1">
            <p className="text-body font-semibold text-foreground">
              {selectedRoom?.worker_name || "근로자"}
            </p>
            <p className="text-caption text-success">온라인</p>
          </div>
        </div>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 p-4 overflow-y-auto bg-secondary/30">
        {isMessagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <span className="text-4xl mb-4">💬</span>
            <p className="text-muted-foreground">메시지가 없습니다.</p>
            <p className="text-caption text-muted-foreground">첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                    msg.sender_id === user?.id
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card text-foreground border border-border rounded-bl-md"
                  }`}
                >
                  {msg.message_type === "file" ? (
                    <div className="flex items-center gap-2">
                      <span>📎</span>
                      <span className="text-body">{msg.file_name || msg.content}</span>
                    </div>
                  ) : (
                    <p className="text-body">{msg.content}</p>
                  )}
                  <p className={`text-caption mt-1 text-right ${
                    msg.sender_id === user?.id ? "opacity-70" : "text-muted-foreground"
                  }`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t border-border bg-background safe-area-pb">
        <div className="flex gap-2 items-center">
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-11 h-11 flex-shrink-0 rounded-full border border-border bg-card flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <span className="text-lg">📎</span>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="메시지를 입력하세요"
            className="flex-1 px-4 py-3 rounded-full border border-input bg-background text-foreground text-body focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={`w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center transition-all ${
              newMessage.trim()
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
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
