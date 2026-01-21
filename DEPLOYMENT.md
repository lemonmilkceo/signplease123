# 🚀 싸인해주세요 배포 가이드

## 목차
1. [Supabase 설정](#1-supabase-설정)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [Vercel 배포](#3-vercel-배포)
4. [Edge Functions 배포](#4-edge-functions-배포)
5. [PWA 아이콘 생성](#5-pwa-아이콘-생성)
6. [도메인 연결](#6-도메인-연결-선택)

---

## 1. Supabase 설정

### 1.1 프로젝트 생성

1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: `signplease` (원하는 이름)
   - **Database Password**: 안전한 비밀번호 생성 (저장해두세요!)
   - **Region**: Northeast Asia (Seoul) - `ap-northeast-2`
4. "Create new project" 클릭 후 2-3분 대기

### 1.2 데이터베이스 스키마 설정

1. Supabase Dashboard → **SQL Editor** 이동
2. "New query" 클릭
3. `supabase/migrations/001_initial_schema.sql` 내용 복사 & 붙여넣기
4. **Run** 클릭
5. 성공 확인 후, `supabase/migrations/002_rls_policies.sql` 동일하게 실행

### 1.3 인증 설정

1. **Authentication** → **Providers** 이동
2. **Email** 활성화 확인 (기본 활성화)
3. **Site URL** 설정:
   - 개발: `http://localhost:5173`
   - 프로덕션: `https://your-domain.vercel.app`

### 1.4 API 키 확인

1. **Project Settings** → **API** 이동
2. 다음 값들을 복사해두세요:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` → `VITE_SUPABASE_ANON_KEY`
   - `service_role` → Edge Functions에서 사용 (비공개!)

---

## 2. 환경 변수 설정

### 2.1 로컬 개발 환경

프로젝트 루트에 `.env` 파일 생성:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# App
VITE_APP_NAME=싸인해주세요
VITE_APP_URL=http://localhost:5173
```

### 2.2 Supabase Edge Functions 환경 변수

Supabase Dashboard → **Project Settings** → **Edge Functions**:

```bash
OPENAI_API_KEY=sk-your-openai-api-key
```

> ⚠️ OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 생성

---

## 3. Vercel 배포

### 3.1 GitHub 연결

1. 프로젝트를 GitHub에 푸시:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/signplease.git
git push -u origin main
```

### 3.2 Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 선택
4. **Framework Preset**: Vite 자동 감지
5. **Environment Variables** 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Deploy" 클릭

### 3.3 배포 확인

- 배포 완료 후 제공되는 URL로 접속
- 예: `https://signplease.vercel.app`

### 3.4 Supabase Site URL 업데이트

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL**을 Vercel 배포 URL로 변경
3. **Redirect URLs**에 추가:
   - `https://your-app.vercel.app/*`

---

## 4. Edge Functions 배포

### 4.1 Supabase CLI 설치

```bash
npm install -g supabase
```

### 4.2 로그인 및 연결

```bash
supabase login
supabase link --project-ref your-project-id
```

### 4.3 Functions 배포

```bash
supabase functions deploy generate-contract
supabase functions deploy contract-legal-advice
supabase functions deploy explain-term
supabase functions deploy support-chat
supabase functions deploy submit-inquiry
```

### 4.4 환경 변수 설정

```bash
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key
```

---

## 5. PWA 아이콘 생성

### 5.1 아이콘 생성

1. [RealFaviconGenerator](https://realfavicongenerator.net) 접속
2. `public/icons/icon.svg` 업로드
3. 설정 조정 후 "Generate" 클릭
4. 다운로드한 파일을 `public/icons/`에 복사

### 5.2 필요한 아이콘 크기

```
icon-72x72.png
icon-96x96.png
icon-128x128.png
icon-144x144.png
icon-152x152.png
icon-192x192.png
icon-384x384.png
icon-512x512.png
```

---

## 6. 도메인 연결 (선택)

### 6.1 Vercel 커스텀 도메인

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력 (예: `signplease.kr`)
4. DNS 설정 안내에 따라 설정

### 6.2 DNS 설정 예시

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 6.3 Supabase URL 업데이트

커스텀 도메인 연결 후 Supabase의 Site URL도 업데이트하세요.

---

## 체크리스트

배포 전 확인사항:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 데이터베이스 스키마 적용 완료
- [ ] RLS 정책 적용 완료
- [ ] 환경 변수 설정 완료
- [ ] Vercel 배포 완료
- [ ] Edge Functions 배포 완료
- [ ] OpenAI API 키 설정 완료
- [ ] PWA 아이콘 생성 완료
- [ ] Site URL 설정 완료

---

## 문제 해결

### 빌드 오류

```bash
# 로컬에서 빌드 테스트
npm run build
```

### Supabase 연결 오류

1. 환경 변수 확인
2. Supabase 프로젝트 상태 확인
3. RLS 정책 확인

### Edge Functions 오류

```bash
# 로그 확인
supabase functions logs generate-contract
```

---

## 지원

문제가 있으시면 이슈를 생성해주세요.
