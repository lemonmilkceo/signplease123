# ✍️ 싸인해주세요

> AI 기반 표준근로계약서 작성 및 전자서명 서비스

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2-3FCF8E?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)

## 📱 주요 기능

### 사장님 (Employer)
- 📝 **AI 계약서 작성** - 10개 질문에 답하면 자동 생성
- ✍️ **전자서명** - 모바일에서 손가락으로 서명
- 📤 **카카오톡/SMS 공유** - 알바생에게 계약서 전송
- 📊 **계약 관리** - 대기 중/완료/폴더/휴지통
- 💬 **실시간 채팅** - 알바생과 소통

### 알바생 (Worker)
- 📋 **카드형 계약서 확인** - 한 조항씩 스와이프
- 🤖 **AI 용어 설명** - 어려운 용어 쉽게 이해
- ✍️ **전자서명** - 간편하게 서명
- 📁 **경력 관리** - 근무 이력 자동 저장
- 📄 **경력증명서** - PDF 다운로드

### 공통
- 🔐 **Google OAuth / 이메일 로그인**
- 💰 **수당 계산기** - 주휴수당, 연장수당 자동 계산
- 🔔 **실시간 알림** - 서명 완료, 새 메시지
- 🤖 **AI 고객지원** - 24시간 챗봇 상담

## 🛠️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **React Router DOM** - 라우팅

### Backend
- **Supabase**
  - PostgreSQL 데이터베이스
  - Row Level Security (RLS)
  - Realtime Subscriptions
  - Edge Functions (Deno)
  - Authentication

### AI
- **OpenAI GPT-4o** - 계약서 생성, 법률 검토
- **GPT-4o-mini** - 용어 설명, 고객 지원

### Deployment
- **Vercel** - 프론트엔드 호스팅
- **PWA** - 모바일 앱 경험

## 📁 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트
│   ├── ui/             # 기본 UI (Button, Input, Card...)
│   ├── SignatureCanvas.tsx
│   ├── ShareModal.tsx
│   ├── ChatView.tsx
│   ├── NotificationBell.tsx
│   └── AllowanceCalculator.tsx
├── contexts/           # React Context
│   └── AuthContext.tsx
├── hooks/              # Custom Hooks
│   ├── useContracts.ts
│   ├── useCredits.ts
│   ├── useAIChat.ts
│   ├── useContractGeneration.ts
│   ├── useRealtime.ts
│   └── useSwipe.ts
├── lib/                # 외부 라이브러리 설정
│   └── supabase.ts
├── pages/              # 페이지 컴포넌트
│   ├── employer/       # 사장님 페이지
│   ├── worker/         # 알바생 페이지
│   └── ...
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── App.tsx             # 라우터 설정
├── main.tsx            # 앱 진입점
└── index.css           # 전역 스타일

supabase/
├── migrations/         # DB 스키마
│   ├── 001_initial_schema.sql
│   └── 002_rls_policies.sql
└── functions/          # Edge Functions
    ├── generate-contract/
    ├── contract-legal-advice/
    ├── explain-term/
    ├── support-chat/
    └── submit-inquiry/
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/signplease.git
cd signplease
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

```bash
cp env.template .env
# .env 파일을 열어 Supabase 정보 입력
```

### 4. 개발 서버 실행

```bash
npm run dev
```

### 5. 브라우저에서 확인

```
http://localhost:5173
```

## 📦 배포

자세한 배포 가이드는 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 빠른 배포

```bash
# 빌드
npm run build

# Vercel 배포
vercel --prod
```

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# 테스트 커버리지
npm run test:coverage
```

## 📄 라이선스

MIT License

## 🤝 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

Made with ❤️ by SignPlease Team
