# 싸인해주세요 (signplease) 개발 체크리스트 (Epic → Story → Task)

## Epic 1. 공통/퍼블릭 영역 구축
- Story 1.1 스플래시/온보딩
  - [x] Task 스플래시 UI 구성 및 라우팅 `/`
  - [x] Task 온보딩 화면(슬로건/CTA) 구성 `/onboarding`
  - [ ] Task 애니메이션( fade-in/slide-up/scale-in ) 적용
- Story 1.2 인증/둘러보기 모드
  - [x] Task 구글 소셜 로그인(Supabase Auth) UI/연동 `/login` (UI만 완료, 연동 미완)
  - [x] Task 이메일 로그인/회원가입 UI/연동 `/login`, `/signup` (UI만 완료, 연동 미완)
  - [ ] Task 둘러보기 모드 플로우(저장/발송 시 가입 유도)
  - [x] Task 역할 선택 UI 및 상태 저장 `/select-role` (UI만 완료)
  - [x] Task 비밀번호 찾기/재설정 `/forgot-password`, `/reset-password`
- Story 1.3 정책/지원
  - [x] Task 이용약관/개인정보처리방침 페이지 `/terms`, `/privacy`
  - [x] Task 고객지원/FAQ 페이지 `/support`

## Epic 2. 사업자(Employer) 대시보드/계약 흐름
- Story 2.1 대시보드/네비게이션
  - [x] Task 대시보드 레이아웃 및 탭 구성 `/employer`
  - [x] Task 대기/완료/폴더/휴지통 목록 UI
- Story 2.2 계약서 작성 플로우 (토스형 Step-by-Step)
  - [x] Task 질문 단위 화면 설계(한 화면/한 질문)
  - [x] Task 근로자 이름 입력
  - [x] Task 시급 입력(숫자 키패드)
  - [x] Task 시작일 선택
  - [x] Task 근무 요일/시간/휴게시간 선택
  - [x] Task 근무 장소/업무 내용/급여 지급일 입력
  - [x] Task 유효성 검사 및 단계 이동 로직
- Story 2.3 AI 계약서 생성/미리보기
  - [ ] Task Edge Function `generate-contract` 호출 (UI 준비 완료, 실제 연동 미완)
  - [x] Task 생성 중 로딩/애니메이션 처리
  - [x] Task 계약서 미리보기 화면 `/employer/preview/:id`
  - [x] Task 전자서명 캔버스 연동
- Story 2.4 공유/보관/상세
  - [x] Task 카카오톡/링크 공유 기능 (UI 완료, 실제 연동 미완)
  - [x] Task PDF 다운로드 기능 (UI 완료, 실제 연동 미완)
  - [x] Task 계약서 상세 페이지 `/employer/contract/:id`
- Story 2.5 채팅
  - [x] Task 채팅방 목록/뷰 구성 `/employer/chat`
  - [x] Task 파일 첨부/메시지 송수신 (UI 완료, 실제 연동 미완)

## Epic 3. 근로자(Worker) 대시보드/계약 흐름
- Story 3.1 대시보드/네비게이션
  - [x] Task 대시보드 레이아웃 및 탭 구성 `/worker`
  - [x] Task 대기/완료/폴더/휴지통 목록 UI
- Story 3.2 계약서 확인/서명
  - [x] Task 계약서 카드 슬라이드 뷰 `/worker/contract/:id`
  - [x] Task 어려운 용어 설명 Edge Function `explain-term` (UI 완료, 실제 연동 미완)
  - [x] Task 서명 캔버스 및 완료 처리
  - [x] Task PDF 보관/다운로드 (UI 완료, 실제 연동 미완)
- Story 3.3 온보딩/경력
  - [x] Task 근로자 온보딩 페이지 `/worker/onboarding`
  - [x] Task 경력 관리/증명서 다운로드 `/worker/career`
- Story 3.4 채팅
  - [x] Task 채팅방 목록/뷰 구성 `/worker/chat`
  - [x] Task 파일 첨부/메시지 송수신 (UI 완료, 실제 연동 미완)

## Epic 4. 결제/설정
- Story 4.1 크레딧 구매
  - [x] Task 가격표 페이지 `/pricing`
  - [x] Task 법률검토 크레딧 페이지 `/legal-review-pricing`
  - [x] Task 묶음 상품 페이지 `/bundle-pricing`
- Story 4.2 프로필/결제 내역
  - [x] Task 프로필 설정 `/profile`
  - [x] Task 결제 내역 조회 `/payment-history`

## Epic 5. 디자인 시스템/UX 원칙
- Story 5.1 토스 스타일 UI 컴포넌트
  - [x] Task 버튼/입력/프로그레스 바 컴포넌트
  - [x] Task 큰 글씨(최소 18px), 명확한 CTA
  - [x] Task 부드러운 트랜지션/애니메이션
- Story 5.2 Tailwind 테마 적용
  - [x] Task 폰트/컬러/쉐도우 토큰 반영
  - [x] Task 모바일 퍼스트 레이아웃(최대 448px)
  - [x] Task 터치 영역 최소 44px 확보

## Epic 6. 데이터 모델/권한/보안
- Story 6.1 Supabase 스키마
  - [x] Task 핵심 엔티티(프로필/계약/채팅) 설계
  - [x] Task 크레딧/리뷰/초대/환경설정 테이블
- Story 6.2 RLS 정책
  - [x] Task 계약서: 작성자/참여자만 접근
  - [x] Task 채팅: 참여자만 접근
  - [x] Task 프로필/크레딧: 본인만 접근

## Epic 7. Edge Functions/AI 연동
- Story 7.1 계약서 생성/검토
  - [x] Task `generate-contract` 연동 및 에러 처리
  - [x] Task `contract-legal-advice` 연동 및 크레딧 차감
- Story 7.2 설명/지원/문의
  - [x] Task `explain-term` 연동 및 결과 UI
  - [x] Task `support-chat` 연동
  - [x] Task `submit-inquiry` 문의 접수 연동

## Epic 8. 빌드/배포 준비 (PWA)
- Story 8.1 PWA 기본 구성
  - Task 매니페스트/아이콘/스플래시 자산 구성
  - Task 서비스 워커 기본 설정
  - Task 오프라인 기본 UX 처리(최소 안내)
- Story 8.2 Vercel 배포
  - Task Vercel 프로젝트 생성 및 Git 연결
  - Task 환경변수(Supabase/OpenAI) 설정
  - Task 빌드/프리뷰/프로덕션 배포 파이프라인 확인
