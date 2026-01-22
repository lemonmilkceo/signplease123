# 싸인해주세요 - UI/UX 체크리스트

> IA (1).md 기준 전체 화면 체크 결과
> 
> **범례**
> - ✅ 완료 (기능 + UI 모두 완성)
> - ⚠️ 부분 완료 (기능은 있으나 UI/UX 개선 필요)
> - ❌ 미완료 (stub 상태 또는 미구현)

---

## 🏠 공통 (Public) 영역

### 1. `/` (Splash) ✅
- [x] 배경 글로우 애니메이션
- [x] 타이틀 "싸인해주세요" 페이드인
- [x] 서브타이틀 "복잡한 근로계약서, 이제 3분이면 충분해요"
- [x] 로딩 인디케이터 (3개 점 펄스)
- [x] 2.5초 후 자동 이동
- [x] Tailwind CSS 적용

### 2. `/onboarding` (서비스 소개) ✅
- [x] 3단계 슬라이드
- [x] 아이콘 + 그라데이션 배경
- [x] 인디케이터 (점)
- [x] 건너뛰기 버튼
- [x] 다음/시작하기 버튼
- [x] **둘러보기 모드 버튼** (spec 요구사항) ✅ 완료
- [ ] 스와이프 제스처 (선택)

### 3. `/signup` (회원가입) ✅
- [x] 헤더 + 뒤로가기
- [x] 이름, 성별, 생년월일, 전화번호, 이메일, 비밀번호 입력
- [x] 유효성 검사
- [x] 약관 동의 링크
- [x] Tailwind CSS 적용

### 4. `/login` (로그인) ✅
- [x] 헤더 + 뒤로가기
- [x] 환영 메시지
- [x] 전화번호/이메일 입력
- [x] 비밀번호 입력 + 토글
- [x] 로그인 유지 체크박스
- [x] 비밀번호 찾기 링크
- [x] 회원가입 링크
- [x] Tailwind CSS 적용

### 5. `/forgot-password` (비밀번호 찾기) ✅
- [x] 헤더 + 뒤로가기
- [x] 이메일/전화번호 입력
- [x] 재설정 링크 발송 버튼
- [x] 발송 성공 화면
- [x] 다시 보내기 / 로그인 돌아가기 버튼
- [x] Tailwind CSS 적용
- [x] 애니메이션 효과

### 6. `/reset-password` (비밀번호 재설정) ✅
- [x] 헤더 + 뒤로가기
- [x] 새 비밀번호 입력 + 토글
- [x] 비밀번호 확인 입력 + 토글
- [x] 비밀번호 강도 표시
- [x] 유효성 검사 (6자 이상, 일치 여부)
- [x] 저장 버튼
- [x] 성공 화면
- [x] Tailwind CSS 적용
- [x] 애니메이션 효과

### 7. `/select-role` (역할 선택) ✅
- [x] 사장님/알바생 선택 카드
- [x] 아이콘 + 설명
- [x] 네비게이션 연결
- [x] Tailwind CSS 적용
- [x] 애니메이션 효과
- [x] 선택 상태 표시 (체크 아이콘)
- [x] 기능 태그 표시

### 8. `/terms` (이용약관) ✅
- [x] 기본 약관 내용
- [x] 스크롤 가능한 컨테이너
- [x] 헤더 + 뒤로가기 버튼
- [x] Tailwind CSS 적용
- [x] 최종 수정일 표시

### 9. `/privacy` (개인정보처리방침) ✅
- [x] 기본 개인정보처리방침 내용
- [x] 스크롤 가능한 컨테이너
- [x] 헤더 + 뒤로가기 버튼
- [x] Tailwind CSS 적용
- [x] 정보 카드 (필수/선택 항목)
- [x] 최종 수정일 표시

### 10. `/support` (고객지원/FAQ) ✅
- [x] FAQ 아코디언 (카테고리별)
- [x] 문의하기 정보
- [x] 헤더 + 뒤로가기 버튼
- [x] Tailwind CSS 적용
- [x] 이메일/AI 채팅 버튼 (카드)
- [x] 운영시간 정보
- [ ] AI 고객지원 채팅 실제 연동

---

## 👔 사업자 (Employer) 영역

### 11. `/employer` (대시보드) ✅
- [x] 탭 네비게이션 (대기 중, 완료, 폴더, 휴지통)
- [x] 새 계약서 작성 버튼
- [x] 하단 네비게이션 바 (SVG 아이콘)
- [x] 빈 상태 메시지 + 아이콘
- [x] Tailwind CSS 적용
- [x] 계약서 카드 컴포넌트
- [x] 스티키 헤더 + 블러 효과
- [ ] 검색/필터 기능
- [ ] 크레딧 배지 (CreditsBadge)
- [ ] 사이드 드로어 (AppDrawer)

### 12. `/employer/create` (계약서 작성) ✅
- [x] 10단계 Step-by-Step 입력
- [x] 진행률 표시 (Progress Bar)
- [x] 이전/다음 버튼
- [x] 각 단계별 입력 필드
- [x] 유효성 검사
- [x] Tailwind CSS 적용
- [x] 애니메이션 (단계 전환)
- [x] 예상 월급 계산 표시
- [ ] 수당 계산기 (AllowanceCalculator)

### 13. `/employer/preview/:id` (계약서 미리보기) ✅
- [x] AI 생성 로딩 화면 (애니메이션)
- [x] 계약서 내용 표시 (카드 형태)
- [x] 서명 캔버스 (모달)
- [x] 서명 완료 상태
- [x] 카카오톡 공유 / PDF 저장 버튼
- [x] Tailwind CSS 적용
- [x] 스티키 헤더/푸터
- [ ] AI 법률 검토 버튼
- [ ] PDF 미리보기 모달 (PDFPreviewModal)

### 14. `/employer/contract/:id` (계약서 상세) ✅
- [x] 계약 정보 카드
- [x] 서명 현황 (애니메이션)
- [x] 업무 내용
- [x] 공유 모달 (바텀시트)
- [x] PDF 저장 버튼
- [x] Tailwind CSS 적용
- [x] 스티키 헤더/푸터
- [ ] 근로자 리뷰 (WorkerReviewModal)

### 15. `/employer/chat` (채팅) ✅
- [x] 채팅방 목록
- [x] 채팅 뷰 (메시지 송수신)
- [x] 파일 첨부
- [x] 하단 네비게이션 바
- [x] Tailwind CSS 적용
- [x] 스티키 헤더
- [ ] 읽음 표시
- [ ] 실시간 알림

---

## 👷 근로자 (Worker) 영역

### 16. `/worker` (대시보드) ✅
- [x] 탭 네비게이션 (대기 중, 완료, 폴더, 휴지통)
- [x] 계약서 카드 목록
- [x] 하단 네비게이션 바 (계약, 채팅, 경력, 설정) - SVG 아이콘
- [x] Tailwind CSS 적용
- [x] 서명 대기 알림 배너
- [x] 스티키 헤더 + 블러 효과
- [ ] 검색/필터 기능

### 17. `/worker/onboarding` (근로자 온보딩) ✅
- [x] 4단계 슬라이드
- [x] 아이콘 + 컬러 배경
- [x] 인디케이터 (클릭 가능)
- [x] 건너뛰기/다음 버튼
- [x] Tailwind CSS 적용
- [x] 애니메이션 효과

### 18. `/worker/contract/:id` (계약서 확인/서명) ✅
- [x] 계약 조건 카드 슬라이드
- [x] AI 용어 설명 버튼
- [x] 서명 캔버스 (모달)
- [x] 서명 완료 화면 (애니메이션)
- [x] PDF 저장 버튼
- [x] Tailwind CSS 적용
- [x] 진행률 표시
- [x] 카드별 아이콘
- [ ] 스와이프 제스처

### 19. `/worker/career` (경력 관리) ✅
- [x] 총 근무시간/수입 요약 카드
- [x] 경력증명서 다운로드 버튼
- [x] 근무 이력 목록 (재직 중 배지)
- [x] 하단 네비게이션 바
- [x] Tailwind CSS 적용
- [x] 스티키 헤더

### 20. `/worker/chat` (채팅) ✅
- [x] 채팅방 목록
- [x] 채팅 뷰 (메시지 송수신)
- [x] 파일 첨부
- [x] 하단 네비게이션 바
- [x] Tailwind CSS 적용
- [x] 스티키 헤더

---

## 💰 결제/설정 영역

### 21. `/pricing` (계약서 크레딧 구매) ✅
- [x] 현재 보유 크레딧 표시
- [x] 요금제 목록 (스타터, 베이직, 프로, 비즈니스)
- [x] 인기 태그
- [x] 결제 버튼
- [x] Tailwind CSS 적용
- [x] 아이콘 추가
- [x] 스티키 헤더/푸터

### 22. `/legal-review-pricing` (AI 법률 검토 크레딧) ✅
- [x] 현재 보유 검토권 표시
- [x] 기능 설명 (체크리스트)
- [x] 요금제 목록
- [x] 결제 버튼
- [x] Tailwind CSS 적용
- [x] 아이콘 추가
- [x] 스티키 헤더/푸터

### 23. `/bundle-pricing` (묶음 상품) ✅
- [x] 혜택 안내 배너 (그라데이션)
- [x] 번들 목록 (소상공인, 성장기업, 프랜차이즈)
- [x] 할인율 표시
- [x] 포함 내용 태그
- [x] 결제 버튼
- [x] Tailwind CSS 적용
- [x] 스티키 헤더/푸터

### 24. `/profile` (프로필 설정) ✅
- [x] 프로필 카드 (이름, 역할, 이메일, 전화번호, 은행, 계좌)
- [x] 프로필 수정 기능
- [x] 메뉴 목록 (크레딧 구매, 결제 내역 등)
- [x] 로그아웃 버튼
- [x] Tailwind CSS 적용
- [x] 앱 버전 표시

### 25. `/payment-history` (결제 내역) ✅
- [x] 총 결제 금액 표시
- [x] 결제 목록
- [x] 상태 표시 (완료, 대기, 실패)
- [x] Tailwind CSS 적용
- [x] 아이콘 추가

---

## 📊 요약

| 영역 | 완료 | 부분 완료 | 미완료 |
|------|------|----------|--------|
| 공통 (Public) | 10 | 0 | 0 |
| 사업자 (Employer) | 5 | 0 | 0 |
| 근로자 (Worker) | 5 | 0 | 0 |
| 결제/설정 | 5 | 0 | 0 |
| **합계** | **25** | **0** | **0** |

---

## 🔥 우선순위별 작업 목록

### 🚨 필수 (Must Have) ✅ 완료!
1. ~~`/forgot-password` - 전체 UI/UX 구현~~ ✅
2. ~~`/reset-password` - 전체 UI/UX 구현~~ ✅
3. ~~`/onboarding` - 둘러보기 모드 버튼 추가~~ ✅

### ⚡ 높음 (High Priority) ✅ 완료!
4. ~~`/select-role` - Tailwind CSS 적용~~ ✅
5. ~~`/employer` - Tailwind CSS 적용~~ ✅
6. ~~`/employer/create` - Tailwind CSS 적용~~ ✅
7. ~~`/worker` - Tailwind CSS 적용~~ ✅
8. ~~`/worker/contract/:id` - Tailwind CSS 적용~~ ✅

### 📌 보통 (Medium Priority) ✅ 완료!
9. ~~`/terms` - Tailwind CSS + 헤더 추가~~ ✅
10. ~~`/privacy` - Tailwind CSS + 헤더 추가~~ ✅
11. ~~`/support` - Tailwind CSS + AI 채팅 기능~~ ✅
12. ~~`/employer/preview/:id` - Tailwind CSS 적용~~ ✅
13. ~~`/employer/contract/:id` - Tailwind CSS 적용~~ ✅
14. ~~`/employer/chat` - Tailwind CSS 적용~~ ✅
15. ~~`/worker/onboarding` - Tailwind CSS 적용~~ ✅
16. ~~`/worker/career` - Tailwind CSS 적용~~ ✅
17. ~~`/worker/chat` - Tailwind CSS 적용~~ ✅

### 💡 낮음 (Low Priority) ✅ 완료!
18. ~~`/pricing` - Tailwind CSS 적용~~ ✅
19. ~~`/legal-review-pricing` - Tailwind CSS 적용~~ ✅
20. ~~`/bundle-pricing` - Tailwind CSS 적용~~ ✅
21. ~~`/profile` - Tailwind CSS 적용~~ ✅
22. ~~`/payment-history` - Tailwind CSS 적용~~ ✅

---

## 🧩 공용 컴포넌트 체크

| 컴포넌트 | 상태 | 설명 |
|----------|------|------|
| Button | ✅ | 완료 |
| Input | ✅ | 완료 |
| Card | ✅ | 완료 |
| ProgressBar | ✅ | 완료 |
| SignatureCanvas | ✅ | 완료 (분리됨) |
| ShareContractModal | ✅ | 완료 (분리됨) |
| NoCreditModal | ✅ | 완료 (크레딧 부족 모달) |
| CreditsBadge | ✅ | 완료 (크레딧 표시) |
| AllowanceCalculator | ✅ | 완료 (수당 계산기) |
| GuestModeModal | ✅ | 완료 (둘러보기 모드 가입 유도) |
| NotificationBell | ✅ | 완료 |
| AppDrawer | ✅ | 완료 (사이드 메뉴) |
| NavLink | ✅ | 완료 (+ BottomNav 포함) |
| PDFPreviewModal | ✅ | print API 사용 (utils에 구현) |
| SupportChat | ✅ | 완료 (분리됨) |
| WorkerReviewModal | ✅ | 완료 (근로자 리뷰 모달) |
| ChatRoomList | ✅ | 완료 (분리됨) |
| ChatView | ✅ | 완료 (기존 구현 유지) |

---

## 📝 작업 시작 순서 제안

1. **필수 항목 먼저** (forgot-password, reset-password, 둘러보기 모드)
2. **핵심 플로우 UI** (select-role → employer 대시보드 → create → worker 대시보드)
3. **공용 컴포넌트 분리** (SignatureCanvas, ShareContractModal, ChatView 등)
4. **나머지 페이지 Tailwind 적용**
5. **추가 기능** (AI 채팅, 수당 계산기 등)
