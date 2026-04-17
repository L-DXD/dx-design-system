# DX Design System

Shoelace(Lit Web Components) 기반 멀티 플랫폼 디자인 시스템. **React/Next.js + Thymeleaf** 를 동시에 지원하며, 사내 서비스 전반에 일관된 UX를 제공합니다.

이 문서는 **DX를 서비스에서 사용하려는 사람** 을 위한 가이드입니다. 설계 철학이나 기여 방법은 별도 문서를 참고하세요.

- 아키텍처 → [`docs/architecture.md`](./docs/architecture.md)
- 개발 / 기여 가이드 → [`docs/contributing.md`](./docs/contributing.md)

---

## 목차

- [지원 환경](#지원-환경)
- [React / Next.js](#react--nextjs)
- [Thymeleaf (Spring Boot)](#thymeleaf-spring-boot)
- [순수 HTML](#순수-html)
- [테마 커스터마이징](#테마-커스터마이징)
- [다크모드](#다크모드)
- [더 알아보기](#더-알아보기)

---

## 지원 환경

하나의 Web Component를 세 가지 환경에서 동일하게 사용할 수 있습니다.

| 환경 | 사용 방식 |
|------|----------|
| **React/Next.js** | `import { Button } from '@dx/react'` |
| **Thymeleaf** | `<ds-button th:attr="...">[[#{...}]]</ds-button>` |
| **순수 HTML** | `<ds-button>` 태그 그대로 사용 |

공통 배포 패키지:

- **`@dx/styles`** — CSS Variables + Tailwind + Shoelace 테마 (모든 환경 필수)
- **`@dx/core`** — 모든 `ds-*` Web Components (Thymeleaf/HTML/React 공통)
- **`@dx/react`** — React 컴포넌트 래퍼 (React/Next.js 전용)

---

## React / Next.js

**설치:**

```bash
pnpm add @dx/react @dx/styles
```

**루트 레이아웃에서 CSS import (한 번만):**

```tsx
// app/layout.tsx (Next.js App Router)
import '@dx/styles';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
```

**컴포넌트 사용:**

```tsx
'use client'; // Web Component는 클라이언트 전용. Next.js App Router에서 필수.

import { FormField, Label, Input, HelperText, Button } from '@dx/react';

export function SignupForm() {
  return (
    <form>
      <FormField>
        <Label htmlFor="email" required>이메일</Label>
        <Input id="email" type="email" placeholder="name@company.com" />
        <HelperText>회사 이메일을 입력하세요</HelperText>
      </FormField>

      <Button variant="primary" type="submit">가입하기</Button>
    </form>
  );
}
```

**SSR 주의사항:** Web Components는 브라우저 API에 의존하므로 `@dx/react` 컴포넌트를 쓰는 파일에 `'use client'` 지시어가 필요합니다. 페이지 레이아웃/RSC는 그대로 서버 렌더링되고, `@dx/react`를 쓰는 leaf 컴포넌트만 클라이언트 분리하는 표준 Next.js 패턴을 따릅니다.

---

## Thymeleaf (Spring Boot)

**1. 의존성 로드 (CDN 방식):**

```html
<!-- src/main/resources/templates/layout.html -->
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
  <!-- Web Components 로드 -->
  <script type="module"
          src="https://cdn.jsdelivr.net/npm/@dx/core@1/dist/dx-core.bundle.js"></script>

  <!-- 스타일 로드 -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@dx/styles@1/dist/styles.css" />

  <!-- (선택) Tailwind CSS — 추가 유틸리티 클래스 사용 시 -->
  <link rel="stylesheet" th:href="@{/css/tailwind.css}" />
</head>
<body>
  <!-- Thymeleaf 템플릿 내용 -->
</body>
</html>
```

**2. 폼 예시:**

```html
<form th:action="@{/signup}" th:object="${signupForm}" method="post">

  <ds-form-field>
    <ds-label html-for="email" required th:text="#{form.email.label}"></ds-label>
    <ds-input th:id="'email'" type="email" th:field="*{email}"></ds-input>
    <ds-helper-text th:text="#{form.email.helper}"></ds-helper-text>
    <ds-error-message th:if="${#fields.hasErrors('email')}"
                      th:errors="*{email}"></ds-error-message>
  </ds-form-field>

  <ds-form-field orientation="horizontal">
    <ds-checkbox id="terms" th:field="*{terms}"></ds-checkbox>
    <ds-label html-for="terms" th:text="#{form.terms.agree}"></ds-label>
  </ds-form-field>

  <ds-button type="submit" variant="primary" th:text="#{form.submit}"></ds-button>
</form>
```

**3. Tailwind를 Thymeleaf에서 쓰기 (선택):**

```js
// tailwind.config.js
export default {
  content: ['./src/main/resources/templates/**/*.html'],
};
```

빌드 결과물을 `src/main/resources/static/css/tailwind.css`로 출력하고 HTML에서 link로 불러옵니다.

---

## 순수 HTML

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <script type="module"
          src="https://cdn.jsdelivr.net/npm/@dx/core@1/dist/dx-core.bundle.js"></script>
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@dx/styles@1/dist/styles.css" />
</head>
<body>
  <ds-form-field>
    <ds-label html-for="name" required>이름</ds-label>
    <ds-input id="name" placeholder="홍길동"></ds-input>
  </ds-form-field>

  <ds-button variant="primary">확인</ds-button>
</body>
</html>
```

---

## 테마 커스터마이징

서비스별 브랜드 컬러/폰트는 **Semantic 토큰 오버라이드**로 적용합니다.

**방법 1: Tailwind 팔레트 사용 (권장)**

Tailwind 22개 팔레트(`--color-indigo-600` 등)에서 원하는 컬러 선택:

```css
/* service-a/theme.css */
:root {
  --dx-color-primary: var(--color-indigo-600);
  --dx-color-primary-hover: var(--color-indigo-700);
  --dx-color-ring: var(--color-indigo-500);
}
```

**방법 2: OKLCH 값 직접 지정**

```css
:root {
  --dx-color-primary: oklch(0.55 0.25 255);
  --dx-color-primary-hover: oklch(0.48 0.25 255);
}
```

**방법 3: 폰트/모양 변경**

```css
:root {
  --dx-font-sans: 'Noto Sans KR', sans-serif;
  --dx-radius: 0.25rem;
}
```

서비스에서 `@dx/styles` 다음에 자신의 `theme.css`를 로드하면 오버라이드가 적용됩니다.

---

## 다크모드

다음 3가지 방식 중 하나로 활성화:

```html
<!-- 1. 명시적 클래스 (권장, Tailwind 호환) -->
<html class="dark">

<!-- 2. data attribute (Thymeleaf 친화적) -->
<html data-theme="dark" th:attr="data-theme=${userTheme}">

<!-- 3. OS 자동 감지 — 클래스/속성 없으면 prefers-color-scheme 따름 -->
<html>
```

모든 DS 컴포넌트와 semantic 토큰이 자동 반전됩니다.

---

## 더 알아보기

- **아키텍처** — [`docs/architecture.md`](./docs/architecture.md) (Compound 패턴, Headless UI, CSS Variables 테마 등)
- **개발 / 기여 가이드** — [`docs/contributing.md`](./docs/contributing.md) (패키지 구조, 워크플로우, 컴포넌트 추가 방법)
- **컴포넌트 카탈로그** — Storybook 사이트
- **Shoelace 공식 문서** — https://shoelace.style/

---

## 라이선스

ISC (내부용)
