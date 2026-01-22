import { ChatRoom } from "../lib/supabase";

interface ChatRoomWithDetails extends ChatRoom {
  worker_name?: string;
  employer_name?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count?: number;
}

interface ChatRoomListProps {
  rooms: ChatRoomWithDetails[];
  isLoading?: boolean;
  userType?: "employer" | "worker";
  onSelectRoom: (roomId: string) => void;
  emptyMessage?: string;
  formatTime?: (dateString: string) => string;
}

export default function ChatRoomList({
  rooms,
  isLoading = false,
  userType = "employer",
  onSelectRoom,
  emptyMessage = "채팅방이 없습니다.",
  formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  },
}: ChatRoomListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-body text-muted-foreground">불러오는 중...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <p className="text-body text-muted-foreground">{emptyMessage}</p>
        <p className="text-caption text-muted-foreground mt-1">
          계약을 체결하면 자동으로 채팅방이 생성됩니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {rooms.map((room) => {
        const displayName =
          userType === "employer"
            ? room.worker_name || "근로자"
            : room.employer_name || "사장님";
        const icon = userType === "employer" ? "👷" : "👔";
        const iconBg = userType === "employer" ? "bg-primary/10" : "bg-warning/10";

        return (
          <button
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className="w-full flex items-center gap-4 p-4 bg-card border border-border rounded-2xl hover:bg-secondary/50 transition-colors text-left"
          >
            <div
              className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center text-xl`}
            >
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-body font-semibold text-foreground">
                  {displayName}
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
        );
      })}
    </div>
  );
}
