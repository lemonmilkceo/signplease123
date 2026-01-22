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
- **React 18** + **TypeScript 5**
- **Vite 7** - 빌드 도구 + 번들 분석 (rollup-plugin-visualizer)
- **Tailwind CSS 3** - 스타일링 + 커스텀 디자인 토큰
- **React Router DOM 6** - 라우팅 (Lazy Loading, Protected Routes)
- **Vitest** - 단위/통합 테스트 (124+ 테스트 케이스)

#### 주요 아키텍처 특징
- **컴포넌트 기반 UI** - 재사용 가능한 디자인 시스템
- **커스텀 훅** - 비즈니스 로직 분리 (15+ 커스텀 훅)
- **Context + useReducer** - 예측 가능한 상태 관리
- **접근성(a11y)** - ARIA, 포커스 트랩, 키보드 네비게이션
- **오프라인 지원** - 캐시 전략, 오프라인 배너
- **에러 핸들링** - Error Boundary, 토스트 알림, 복구 가이드

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
│   ├── ui/             # 기본 UI 컴포넌트
│   │   ├── Button.tsx        # 버튼 (variant, size 지원)
│   │   ├── Input.tsx         # 입력 필드 (유효성 검사 연동)
│   │   ├── Card.tsx          # 카드 레이아웃
│   │   ├── Badge.tsx         # 상태 표시 배지
│   │   ├── Avatar.tsx        # 사용자 아바타
│   │   ├── Tabs.tsx          # 탭 네비게이션
│   │   ├── ProgressBar.tsx   # 진행 상태 표시
│   │   ├── IconButton.tsx    # 접근성 아이콘 버튼
│   │   ├── LoadingSpinner.tsx
│   │   ├── SkeletonLoader.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   ├── LazyImage.tsx     # 이미지 Lazy Loading
│   │   └── index.ts          # Barrel export
│   ├── layouts/        # 레이아웃 컴포넌트
│   │   ├── EmployerLayout.tsx
│   │   ├── WorkerLayout.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ResponsiveContainer.tsx
│   │   └── index.ts
│   ├── icons/          # SVG 아이콘 컴포넌트
│   ├── ErrorBoundary.tsx     # 전역 에러 핸들링
│   ├── Toast.tsx             # 토스트 알림
│   ├── ConfirmDialog.tsx     # 확인 다이얼로그
│   ├── FocusTrap.tsx         # 포커스 트랩 (접근성)
│   ├── OfflineBanner.tsx     # 오프라인 상태 표시
│   ├── PageTransition.tsx    # 페이지 전환 애니메이션
│   ├── ErrorRecoveryGuide.tsx
│   ├── ProtectedRoute.tsx    # 인증 라우트 가드
│   ├── ContractCard.tsx      # 계약서 카드
│   ├── SignatureCanvas.tsx
│   ├── ShareModal.tsx
│   ├── ChatView.tsx
│   ├── NotificationBell.tsx
│   ├── AllowanceCalculator.tsx
│   └── index.ts
├── contexts/           # React Context (useReducer 패턴)
│   ├── AuthContext.tsx       # 인증 상태 관리
│   └── ToastContext.tsx      # 토스트 알림 관리
├── hooks/              # Custom Hooks
│   ├── useAuth.ts            # 인증 관련
│   ├── useContracts.ts       # 계약서 CRUD
│   ├── useCredits.ts         # 크레딧 관리
│   ├── useAIChat.ts          # AI 채팅
│   ├── useRealtime.ts        # Supabase Realtime
│   ├── useSwipe.ts           # 터치 스와이프
│   ├── useResource.ts        # 제네릭 CRUD 훅
│   ├── useOnlineStatus.ts    # 네트워크 상태
│   ├── useOfflineCache.ts    # 오프라인 캐싱
│   ├── useDebounce.ts        # 디바운스
│   ├── useLocalStorage.ts    # 로컬 스토리지
│   ├── useFormValidation.ts  # 폼 유효성 검사
│   ├── useUnsavedChanges.ts  # 미저장 변경 감지
│   ├── useSessionTimeout.ts  # 세션 타임아웃
│   ├── usePrefetch.ts        # 데이터 프리페칭
│   └── index.ts
├── config/             # 설정 및 상수
│   ├── constants.ts          # 전역 상수
│   └── env.ts                # 환경 변수 타입
├── lib/                # 외부 라이브러리 설정
│   └── supabase.ts
├── pages/              # 페이지 컴포넌트
│   ├── employer/       # 사장님 페이지
│   ├── worker/         # 알바생 페이지
│   └── ...
├── styles/             # 스타일 관련
│   └── DESIGN_TOKENS.md      # 디자인 토큰 문서
├── types/              # TypeScript 타입 정의
│   ├── index.ts              # 공통 타입
│   ├── database.ts           # Supabase DB 타입 (자동 생성)
│   └── env.d.ts              # 환경 변수 타입
├── utils/              # 유틸리티 함수 (JSDoc 문서화)
│   ├── index.ts              # 날짜, 통화, 문자열 포맷
│   ├── errorMessages.ts      # 에러 메시지 한글화
│   ├── security.ts           # 보안 유틸 (XSS 방지, 마스킹)
│   └── logger.ts             # 로깅
├── App.tsx             # 라우터 설정 (Lazy Loading)
├── main.tsx            # 앱 진입점
└── index.css           # 전역 스타일 (CSS 변수)

scripts/
├── generate-component.js     # 컴포넌트 생성 스크립트
└── ...

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

# E2E 테스트 (Playwright)
npm run test:e2e

# E2E 테스트 UI 모드 (디버깅)
npm run test:e2e:ui

# 번들 분석
npm run build:analyze
```

### 테스트 현황
- ✅ **유틸리티 함수** - 날짜, 통화, 유효성 검사
- ✅ **보안 유틸** - XSS 방지, 데이터 마스킹
- ✅ **커스텀 훅** - useDebounce, useLocalStorage, useOnlineStatus
- ✅ **UI 컴포넌트** - Button, Input, Card
- ✅ **페이지 컴포넌트** - SelectRole, Splash, Onboarding
- ✅ **E2E 테스트** - 인증, 네비게이션, 사장님/알바생 플로우

## 🛠️ 개발 도구

```bash
# 컴포넌트 생성
npm run generate:component MyComponent

# 페이지 생성
npm run generate:page MyPage

# 훅 생성
npm run generate:hook useMyHook

# Supabase 타입 생성
npm run generate:types
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
