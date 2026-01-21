import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface ChatRoom {
  id: string;
  workerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "file";
  fileName?: string;
}

// Mock 데이터
const mockChatRooms: ChatRoom[] = [
  { id: "1", workerName: "김알바", lastMessage: "네, 알겠습니다!", lastMessageTime: "오후 2:30", unreadCount: 0 },
  { id: "2", workerName: "이직원", lastMessage: "내일 출근 가능할까요?", lastMessageTime: "오전 11:15", unreadCount: 2 },
  { id: "3", workerName: "박아르바이트", lastMessage: "계약서 확인했습니다", lastMessageTime: "어제", unreadCount: 0 },
];

const mockMessages: Message[] = [
  { id: "1", senderId: "worker", content: "안녕하세요, 사장님!", timestamp: "오후 2:00", type: "text" },
  { id: "2", senderId: "employer", content: "네, 안녕하세요. 계약서 확인하셨나요?", timestamp: "오후 2:05", type: "text" },
  { id: "3", senderId: "worker", content: "네, 방금 확인하고 서명했습니다!", timestamp: "오후 2:10", type: "text" },
  { id: "4", senderId: "employer", content: "좋습니다. 내일부터 출근 부탁드려요.", timestamp: "오후 2:15", type: "text" },
  { id: "5", senderId: "worker", content: "네, 알겠습니다!", timestamp: "오후 2:30", type: "text" },
];

export default function EmployerChat() {
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "employer",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "employer",
      content: file.name,
      timestamp: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      type: "file",
      fileName: file.name,
    };

    setMessages([...messages, message]);
    alert(`파일 "${file.name}" 업로드 완료 (실제 업로드는 추후 연동 예정)`);
  };

  // 채팅방 목록 뷰
  if (!selectedRoom) {
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
          {mockChatRooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">💬</span>
              </div>
              <p className="text-body text-muted-foreground">채팅방이 없습니다.</p>
              <p className="text-caption text-muted-foreground mt-1">계약을 체결하면 자동으로 채팅방이 생성됩니다.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mockChatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    👷
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-body font-semibold text-foreground">{room.workerName}</span>
                      <span className="text-caption text-muted-foreground">{room.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-caption text-muted-foreground truncate max-w-[200px]">
                        {room.lastMessage}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="bg-destructive text-white text-caption px-2 py-0.5 rounded-full min-w-[20px] text-center">
                          {room.unreadCount}
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
            onClick={() => setSelectedRoom(null)}
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
            <p className="text-body font-semibold text-foreground">{selectedRoom.workerName}</p>
            <p className="text-caption text-success">온라인</p>
          </div>
        </div>
      </header>

      {/* 메시지 목록 */}
      <div className="flex-1 p-4 overflow-y-auto bg-secondary/30">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === "employer" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  msg.senderId === "employer"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-foreground border border-border rounded-bl-md"
                }`}
              >
                {msg.type === "file" ? (
                  <div className="flex items-center gap-2">
                    <span>📎</span>
                    <span className="text-body">{msg.fileName}</span>
                  </div>
                ) : (
                  <p className="text-body">{msg.content}</p>
                )}
                <p className={`text-caption mt-1 text-right ${
                  msg.senderId === "employer" ? "opacity-70" : "text-muted-foreground"
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
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
