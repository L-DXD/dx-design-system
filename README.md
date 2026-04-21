# DX Design System

shadcn/ui 기반 멀티 플랫폼 디자인 시스템. **React / Thymeleaf / HTML** 을 동시에 지원하며, 사내 서비스 전반에 일관된 UX 를 제공합니다.

이 문서는 **DX 를 서비스에서 사용하려는 사람** 을 위한 가이드입니다.

- 아키텍처 → [`docs/architecture.md`](./docs/architecture.md)
- 기여 가이드 → [`docs/contributing.md`](./docs/contributing.md)

---

## 목차

- [지원 환경](#지원-환경)
- [React / Next.js](#react--nextjs)
- [Thymeleaf (Spring Boot)](#thymeleaf-spring-boot)
- [순수 HTML](#순수-html)
- [테마 커스터마이징](#테마-커스터마이징)
- [다크모드](#다크모드)

---

## 지원 환경

| 환경 | 컴포넌트 |
| --- | --- |
| **React / Next.js** | `@dx/ui` React 컴포넌트 (shadcn) |
| **Thymeleaf** | `@dx/elements` 의 `<ds-*>` Light DOM Web Components |
| **순수 HTML** | 동일 |

공통 배포:
- `@dx/styles` — Tailwind v4 theme + semantic 토큰 CSS (모든 환경)
- `@dx/ui` — React 컴포넌트 (React 전용)
- `@dx/elements` — Web Components (Thymeleaf/HTML 전용)

## Tailwind class override 조건

`<ds-input class="px-5">` 같은 Tailwind class 가 실제 스타일로 적용되려면 **해당 class 의 CSS 정의가 소비자 페이지에 로드되어 있어야** 합니다.

| 경로 | 로드 방법 | 자유도 |
| --- | --- | --- |
| React + 자체 Tailwind | `@import '@dx/styles/theme'` + `@source "./**/*.tsx"` | 무제한 |
| HTML/Thymeleaf + 자체 Tailwind | `tailwind.config.js` `content` 에 템플릿 포함 | 무제한 |
| HTML/Thymeleaf + 번들만 | `<link rel="stylesheet" href=".../styles-utilities.css">` | safelist 범위 |

---

## React / Next.js

### 설치

```bash
pnpm add @dx/ui @dx/styles
pnpm add -D tailwindcss @tailwindcss/postcss
```

### app/globals.css

```css
@import '@dx/styles/theme';
@source "./**/*.{tsx,ts,jsx,js}";
```

### 사용

```tsx
import { Button, Input, Label, FormField, HelperText } from '@dx/ui';

export function SignupForm() {
  return (
    <form>
      <FormField>
        <Label htmlFor="email">이메일</Label>
        <Input id="email" type="email" placeholder="name@company.com" />
        <HelperText>회사 이메일을 입력하세요</HelperText>
      </FormField>
      <Button variant="tertiary">가입하기</Button>
    </form>
  );
}
```

### Button / Badge variants

```tsx
<Button>default</Button>
<Button variant="secondary">secondary</Button>
<Button variant="tertiary">tertiary</Button>
<Button variant="destructive">destructive</Button>
<Button variant="outline">outline</Button>
<Button variant="ghost">ghost</Button>
<Button variant="link">link</Button>
```

---

## Thymeleaf (Spring Boot)

### 1. 의존성 배치

```bash
# 루트에서 빌드
pnpm --filter @dx/styles build
pnpm --filter @dx/elements build

# Spring 프로젝트로 복사
cp packages/styles/dist/styles-utilities.css <spring-project>/src/main/resources/static/css/
cp packages/elements/dist/dx-elements.mjs <spring-project>/src/main/resources/static/js/
```

### 2. layout.html

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org" lang="ko">
<head>
  <link rel="stylesheet" th:href="@{/css/styles-utilities.css}" />
  <script defer src="https://unpkg.com/alpinejs@3"></script>
  <script type="module" defer th:src="@{/js/dx-elements.mjs}"></script>
</head>
<body class="bg-background text-foreground">
  ...
</body>
</html>
```

### 3. signup.html — `th:field` 대신 `th:value` + `name` 사용

```html
<form th:action="@{/signup}" th:object="${signupForm}" method="post">

  <ds-label for="email">이메일</ds-label>
  <ds-input id="email"
            name="email"
            type="email"
            th:value="*{email}"/>
  <ds-error-message th:if="${#fields.hasErrors('email')}"
                    th:errors="*{email}"></ds-error-message>

  <ds-button type="submit">가입</ds-button>
</form>
```

> ⚠ `th:field` 는 `<input>`/`<select>`/`<textarea>` 에만 동작. `<ds-input>` 에는 적용되지 않으므로 `th:value`/`name` 을 개별적으로 지정.

---

## 순수 HTML

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dx/styles@0/dist/styles-utilities.css" />
  <script type="module" src="https://cdn.jsdelivr.net/npm/@dx/elements@0/dist/dx-elements.mjs"></script>
</head>
<body class="bg-background text-foreground p-10">
  <ds-label for="email">이메일</ds-label>
  <ds-input id="email" type="email" placeholder="name@company.com"/>
  <ds-button>가입</ds-button>
</body>
</html>
```

`<ds-button class="w-full mt-2 shadow-lg">` 같은 Tailwind class override 는 내부 `<button>` 에 tailwind-merge 로 병합됩니다.

---

## 테마 커스터마이징

### 방법 1: CSS 변수 재선언 (권장)

```css
/* service-a/theme.css */
:root {
  --primary: #8b5cf6;
  --primary-foreground: #ffffff;
  --ring: #8b5cf6;
}

.dark {
  --primary: #a78bfa;
}
```

`@dx/styles` 를 먼저 로드한 뒤 이 파일을 로드하면 오버라이드가 적용됩니다.

### 방법 2: 특정 wrapper 만 재테마 (인라인 style)

```tsx
<div style={{ '--primary': '#8b5cf6', '--ring': '#8b5cf6' }}>
  <Button>가입</Button>
</div>
```

HTML/Thymeleaf 도 동일:

```html
<div style="--primary: #8b5cf6; --ring: #8b5cf6;">
  <ds-button>가입</ds-button>
</div>
```

---

## 다크모드

```html
<html class="dark">...</html>
```

또는 OS 자동 감지 (prefers-color-scheme). 모든 semantic 토큰이 자동 반전됩니다.

---

## 라이선스

ISC (내부용)
