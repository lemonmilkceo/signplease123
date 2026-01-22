# 🎨 SignPlease 디자인 토큰

이 문서는 SignPlease 앱에서 사용되는 디자인 토큰(CSS 변수)을 정의합니다.

## 📦 색상 시스템

### 기본 색상
| 토큰 | Light Mode | Dark Mode | 용도 |
|------|------------|-----------|------|
| `--background` | `hsl(0 0% 100%)` | `hsl(0 0% 7%)` | 페이지 배경 |
| `--foreground` | `hsl(0 0% 7%)` | `hsl(0 0% 98%)` | 기본 텍스트 |
| `--card` | `hsl(0 0% 100%)` | `hsl(0 0% 10%)` | 카드 배경 |
| `--card-foreground` | `hsl(0 0% 7%)` | `hsl(0 0% 98%)` | 카드 내 텍스트 |

### 브랜드 색상
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--primary` | `hsl(214 100% 59%)` | 주요 액션, CTA 버튼 |
| `--primary-foreground` | `hsl(0 0% 100%)` | primary 위의 텍스트 |
| `--secondary` | `hsl(210 40% 96%)` / `hsl(217 33% 17%)` | 보조 버튼, 배경 |
| `--secondary-foreground` | 테마에 따라 다름 | secondary 위의 텍스트 |

### 상태 색상
| 토큰 | Light Mode | Dark Mode | 용도 |
|------|------------|-----------|------|
| `--destructive` | `hsl(0 84% 60%)` | `hsl(0 62% 30%)` | 삭제, 에러 |
| `--success` | `hsl(142 71% 45%)` | `hsl(142 71% 35%)` | 성공, 완료 |
| `--warning` | `hsl(38 92% 50%)` | `hsl(38 92% 40%)` | 경고, 주의 |

### 뮤트 색상
| 토큰 | 용도 |
|------|------|
| `--muted` | 비활성 배경 |
| `--muted-foreground` | 보조 텍스트, 플레이스홀더 |
| `--accent` | 강조 배경 |
| `--accent-foreground` | 강조 영역 텍스트 |

### 유틸리티 색상
| 토큰 | 용도 |
|------|------|
| `--border` | 테두리 |
| `--input` | 입력 필드 테두리 |
| `--ring` | 포커스 링 |

---

## 📐 크기 및 간격

### Border Radius
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius` | `0.75rem` (12px) | 기본 라운드 |

### 그림자
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.05)` | 작은 그림자 |
| `--shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1)...` | 중간 그림자 |
| `--shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)...` | 큰 그림자 |
| `--shadow-card` | `0 1px 3px 0 rgba(0,0,0,0.1)...` | 카드 그림자 |
| `--shadow-button` | `0 1px 2px 0 rgba(0,0,0,0.05)` | 버튼 그림자 |

---

## 📝 타이포그래피

### 폰트 크기 (Tailwind 클래스)
| 클래스 | 크기 | 용도 |
|--------|------|------|
| `text-heading` | `1.5rem` (24px) | 페이지 제목 |
| `text-title` | `1.25rem` (20px) | 섹션 제목 |
| `text-body-lg` | `1.125rem` (18px) | 큰 본문 |
| `text-body` | `1rem` (16px) | 기본 본문 |
| `text-caption` | `0.875rem` (14px) | 작은 텍스트, 캡션 |

### 폰트 두께
| 클래스 | 두께 | 용도 |
|--------|------|------|
| `font-normal` | 400 | 기본 본문 |
| `font-medium` | 500 | 강조 텍스트 |
| `font-semibold` | 600 | 제목, 버튼 |
| `font-bold` | 700 | 강한 강조 |

---

## 🎯 컴포넌트 스타일

### 버튼 Variants
```tsx
// Button variants
<Button variant="primary">주요 액션</Button>
<Button variant="secondary">보조 액션</Button>
<Button variant="outline">아웃라인</Button>
<Button variant="ghost">고스트</Button>
<Button variant="destructive">삭제</Button>
```

### 버튼 크기
```tsx
<Button size="sm">작은 버튼</Button>  // min-h: 36px
<Button size="md">중간 버튼</Button>  // min-h: 44px
<Button size="lg">큰 버튼</Button>    // min-h: 56px
```

### Badge Variants
```tsx
<Badge variant="default">기본</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">성공</Badge>
<Badge variant="warning">경고</Badge>
<Badge variant="destructive">에러</Badge>
<Badge variant="outline">아웃라인</Badge>
```

### Avatar 크기
```tsx
<Avatar size="sm" />  // 32px
<Avatar size="md" />  // 40px
<Avatar size="lg" />  // 48px
<Avatar size="xl" />  // 64px
```

---

## 📱 반응형 중단점

| 중단점 | 값 | 용도 |
|--------|-----|------|
| `sm` | 640px | 작은 태블릿 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 데스크톱 |
| `xl` | 1280px | 큰 데스크톱 |

### 모바일 컨테이너
```css
.mobile-container {
  @apply max-w-md mx-auto px-5;
}
/* max-width: 448px, padding: 20px */
```

---

## ♿ 접근성

### 터치 타겟
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

### Safe Area
```css
.safe-area-pb {
  padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
}
.safe-area-pt {
  padding-top: max(0.5rem, env(safe-area-inset-top));
}
```

### 스크린 리더 전용
```css
.sr-only {
  /* 시각적으로 숨김, 스크린 리더는 읽음 */
}
```

---

## 🌙 다크 모드

다크 모드는 시스템 설정을 따르며, `prefers-color-scheme: dark` 미디어 쿼리로 자동 적용됩니다.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 7%;
    /* ... 다크 모드 색상 */
  }
}
```

---

## 📦 사용 예시

### Tailwind에서 CSS 변수 사용
```tsx
// 색상
<div className="bg-primary text-primary-foreground" />
<div className="bg-card text-card-foreground" />
<div className="border-border" />

// 그림자
<div className="shadow-card" />

// 라운드
<div className="rounded-2xl" /> // uses --radius
```

### CSS에서 직접 사용
```css
.custom-element {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
  box-shadow: var(--shadow-card);
}
```

---

*Last Updated: 2026-01-22*
