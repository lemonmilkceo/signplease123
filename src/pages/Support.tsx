import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAIChat } from "../hooks/useAIChat";
import { Button } from "../components/ui";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "계약서는 어떻게 작성하나요?",
    answer: "사장님으로 로그인 후 '새 계약서 작성' 버튼을 누르면 AI가 안내하는 질문에 답하면서 간편하게 작성할 수 있습니다. 총 10개의 질문에 답하면 자동으로 표준근로계약서가 생성됩니다.",
    category: "계약서",
  },
  {
    id: "2",
    question: "전자서명은 법적 효력이 있나요?",
    answer: "네, 전자서명법에 따라 법적 효력이 인정됩니다. 싸인해주세요에서 작성된 계약서는 전자문서 및 전자거래 기본법에 따라 서면 계약서와 동일한 효력을 가집니다.",
    category: "서명",
  },
  {
    id: "3",
    question: "크레딧은 어떻게 충전하나요?",
    answer: "설정 > 크레딧 구매 메뉴에서 충전할 수 있습니다. 스타터(5개), 베이직(15개), 프로(30개), 비즈니스(100개) 패키지 중 선택하실 수 있습니다.",
    category: "결제",
  },
  {
    id: "4",
    question: "계약서를 수정할 수 있나요?",
    answer: "서명 전까지는 언제든 수정이 가능합니다. 단, 양측이 모두 서명한 계약서는 수정이 불가능하며, 새로운 계약서를 작성해야 합니다.",
    category: "계약서",
  },
  {
    id: "5",
    question: "AI 법률 검토는 무엇인가요?",
    answer: "AI가 작성된 계약서의 법적 유효성을 검토하고, 근로기준법 위반 여부를 확인해줍니다. 불리한 조항이 있으면 경고하고 수정 제안을 해드립니다.",
    category: "AI 기능",
  },
];

export default function Support() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 새 메시지 시 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // AI 채팅 화면
  if (showChat) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* 채팅 헤더 */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
          <div className="flex items-center justify-between p-4 max-w-[448px] mx-auto">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowChat(false)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
              >
                <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h1 className="text-body font-semibold text-foreground">AI 상담원</h1>
                  <p className="text-caption text-success flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                    온라인
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={clearMessages}
              className="text-caption text-muted-foreground hover:text-foreground transition-colors"
            >
              대화 초기화
            </button>
          </div>
        </header>

        {/* 채팅 메시지 영역 */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-[448px] mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-secondary text-foreground rounded-tl-md"
                  }`}
                >
                  <p className="text-body whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-caption mt-1 ${
                    message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* 로딩 인디케이터 */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>
        </main>

        {/* 빠른 질문 버튼 */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <div className="max-w-[448px] mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
              {["계약서 작성 방법", "크레딧 충전", "법적 효력", "환불 정책"].map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question + "에 대해 알려주세요")}
                  className="px-3 py-1.5 bg-secondary text-caption text-foreground rounded-full whitespace-nowrap hover:bg-secondary/80 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

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
              onClick={handleSendMessage}
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

  // 기본 고객지원 화면
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* 헤더 */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 p-4 max-w-[448px] mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
          >
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-heading text-foreground">고객지원</h1>
        </div>
      </header>

      {/* 컨텐츠 */}
      <main className="flex-1 mobile-container py-6">
        {/* 문의 카드 */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 mb-6 text-white">
          <h2 className="text-body-lg font-semibold mb-2">도움이 필요하신가요?</h2>
          <p className="text-caption opacity-90 mb-4">
            궁금한 점이 있으시면 언제든 문의해주세요.
          </p>
          <div className="flex gap-3">
            <a 
              href="mailto:support@signplease.kr"
              className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-xl mb-1 block">✉️</span>
              <span className="text-caption">이메일 문의</span>
            </a>
            <button 
              onClick={() => setShowChat(true)}
              className="flex-1 bg-white/20 hover:bg-white/30 rounded-xl p-3 text-center transition-colors"
            >
              <span className="text-xl mb-1 block">🤖</span>
              <span className="text-caption">AI 채팅</span>
            </button>
          </div>
        </div>

        {/* 운영시간 */}
        <div className="bg-secondary rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-lg">🕐</span>
          </div>
          <div>
            <p className="text-caption font-medium text-foreground">운영시간</p>
            <p className="text-caption text-muted-foreground">평일 09:00 ~ 18:00 (주말/공휴일 휴무)</p>
          </div>
        </div>

        {/* FAQ */}
        <section>
          <h2 className="text-body font-semibold text-foreground mb-4">자주 묻는 질문</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <span className="text-caption text-primary font-medium">{faq.category}</span>
                    <p className="text-body text-foreground mt-1">{faq.question}</p>
                  </div>
                  <svg 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === faq.id ? "rotate-180" : ""}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === faq.id && (
                  <div className="px-4 pb-4 animate-fade-in">
                    <p className="text-caption text-muted-foreground leading-relaxed bg-secondary rounded-lg p-3">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 추가 도움 */}
        <div className="mt-8 text-center">
          <p className="text-caption text-muted-foreground mb-3">
            원하는 답을 찾지 못하셨나요?
          </p>
          <Button
            variant="outline"
            onClick={() => setShowChat(true)}
          >
            🤖 AI 상담원과 대화하기
          </Button>
        </div>
      </main>
    </div>
  );
}
