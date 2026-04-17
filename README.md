# DX Design System

Shoelace(Lit Web Components) 기반 멀티 플랫폼 디자인 시스템. **React/Next.js + Thymeleaf** 를 동시에 지원하며, 사내 서비스 전반에 일관된 UX를 제공합니다.

---

## 목차

- [철학](#철학)
- [패키지 구조](#패키지-구조)
- [서비스에서 사용하기](#서비스에서-사용하기)
  - [React / Next.js](#react--nextjs)
  - [Thymeleaf (Spring Boot)](#thymeleaf-spring-boot)
  - [순수 HTML](#순수-html)
  - [테마 커스터마이징](#테마-커스터마이징)
  - [다크모드](#다크모드)
- [개발 가이드](#개발-가이드)
  - [초기 셋업](#초기-셋업)
  - [개발 워크플로우](#개발-워크플로우)
  - [Atomic Design 작업 순서](#atomic-design-작업-순서)
  - [컴포넌트 추가하기](#컴포넌트-추가하기)
  - [커밋 메시지 규칙](#커밋-메시지-규칙)
- [기술 스택](#기술-스택)

---

## 철학

### 1. Compound Component Pattern

**폼 컴포넌트의 `label`, `helperText`, `error`는 prop이 아니라 별도 컴포넌트로 조립한다.** shadcn/Radix UI 멘탈 모델을 따른다.

```html
<!-- ❌ Prop 기반 (사용하지 않음) -->
<ds-input label="이메일" helper-text="회사 이메일을 입력하세요" error="..." />

<!-- ✅ Compound 조립 -->
<ds-form-field>
  <ds-label html-for="email" required>이메일</ds-label>
  <ds-input id="email" type="email" />
  <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
  <ds-error-message>유효하지 않은 이메일입니다</ds-error-message>
</ds-form-field>
```

**이유:**
- **유연한 조립**: Label을 어디든 배치 가능. 여러 개 가능.
- **스타일 자유도**: 각 조각을 개별 스타일링.
- **접근성 명시**: `htmlFor`/`id` 연결이 코드에 드러남.

### 2. Headless UI 철학

**동작(behavior)** 과 **스타일(style)** 을 분리한다.

- 동작: Shoelace가 제공하는 접근성/키보드 네비게이션/상태관리
- 스타일: CSS Variables + `::part()` + Tailwind 클래스로 외부 제어
- `variant`/`color`/`size` 같은 스타일 props는 최소화하고 의미적 variant(`primary`/`destructive`)만 제공

### 3. 멀티 플랫폼 (Write Once, Use Everywhere)

하나의 Web Component를 세 가지 환경에서 동일하게 사용할 수 있다:

| 환경 | 사용 방식 |
|------|----------|
| **React/Next.js** | `import { Button } from '@dx/react'` |
| **Thymeleaf** | `<ds-button th:attr="...">[[#{...}]]</ds-button>` |
| **순수 HTML** | `<ds-button>` 태그 그대로 사용 |

### 4. CSS Variables 기반 테마

서비스별 브랜드/다크모드는 CSS Variables 오버라이드만으로 적용된다.

```css
:root {
  --dx-color-primary: var(--color-indigo-600);
}
```

Shadow DOM 내부까지 자동 전파되어 모든 컴포넌트에 즉시 반영된다.

---

## 패키지 구조

모노레포 형태로 4개 패키지로 구성된다.

```
dx-design-system/
├── packages/
│   ├── styles/      ← @dx/styles  (CSS Variables + Tailwind + Shoelace 테마)
│   ├── core/        ← @dx/core    (Shoelace 래핑 Web Components)
│   ├── react/       ← @dx/react   (@lit/react 기반 React 래퍼)
│   └── storybook/   ← 문서 사이트 (4탭 코드 뷰)
```

### 의존 관계 (빌드 순서)

```
@dx/styles  →  @dx/core  →  @dx/react  →  storybook
```

### 각 패키지 역할

| 패키지 | 빌드 도구 | 출력 | 소비자 |
|--------|----------|------|--------|
| **`@dx/styles`** | Tailwind v4 + PostCSS | `dist/styles.css` (CSS Variables + Tailwind + Shoelace) | 모든 환경 |
| **`@dx/core`** | Vite (lib mode) | `dist/index.js` (ESM) + `dist/dx-core.bundle.js` (CDN) | @dx/react, Thymeleaf, HTML |
| **`@dx/react`** | Vite (lib mode) | `dist/index.js` (ESM, tree-shakeable) | React/Next.js |
| **`storybook`** | Storybook 8 + Vite | 정적 사이트 | 개발자 문서 |

### 디렉토리 상세

```
packages/
├── styles/
│   ├── src/
│   │   ├── tokens.css       ← --dx-* 디자인 토큰 (Color/Typography/Spacing)
│   │   ├── base.css         ← DX 토큰 → Shoelace 변수 매핑
│   │   ├── shoelace.css     ← Shoelace 기본 테마 import
│   │   ├── form.css         ← Compound 컴포넌트 스타일
│   │   └── themes/
│   │       └── default.css  ← 엔트리포인트
│   └── dist/styles.css
│
├── core/
│   ├── src/
│   │   ├── components/
│   │   │   ├── button.ts, input.ts, select.ts, ...   ← Shoelace 래핑
│   │   │   ├── icon.ts                               ← Lucide 기반 (Light DOM)
│   │   │   ├── label.ts, form-field.ts, ...          ← Compound 컴포넌트
│   │   │   └── ...
│   │   ├── utils/
│   │   │   └── remap-events.ts   ← sl-* → ds-* 이벤트 재매핑
│   │   └── index.ts
│   ├── vite.config.ts            ← ESM lib 빌드
│   └── vite.config.bundle.ts     ← CDN all-in-one 빌드
│
├── react/
│   ├── src/
│   │   ├── components/   ← @lit/react createComponent 래퍼 (파일당 3~5줄)
│   │   └── index.ts
│   └── vite.config.ts
│
└── storybook/
    ├── .storybook/
    │   ├── main.ts
    │   ├── preview.ts        ← @dx/styles import, 다크모드 토글
    │   └── addons/code-tabs/ ← 4탭 코드 뷰 커스텀 addon
    └── stories/
        ├── foundation/       ← Colors/Typography/Spacing/Icons
        ├── compound.stories.ts
        ├── button.stories.ts
        ├── input.stories.ts
        └── ...
```

---

## 서비스에서 사용하기

### React / Next.js

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

### Thymeleaf (Spring Boot)

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

### 순수 HTML

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

### 테마 커스터마이징

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

### 다크모드

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

## 개발 가이드

### 초기 셋업

```bash
# 저장소 클론
git clone <repo-url> dx-design-system
cd dx-design-system

# pnpm 설치 (필수 — npm/yarn 대신)
npm install -g pnpm@10

# 의존성 설치
pnpm install

# 전체 패키지 빌드
pnpm build

# Storybook 실행
pnpm storybook
# → http://localhost:6006
```

### 개발 워크플로우

**변경하려는 패키지만 빌드:**

```bash
pnpm --filter @dx/styles build
pnpm --filter @dx/core build
pnpm --filter @dx/react build
```

**Watch 모드(개발 중):**

```bash
pnpm --filter @dx/core dev
pnpm storybook
```

Storybook은 `@dx/core` 변경 시 자동 리빌드·리로드합니다.

**전체 빌드 (Turbo 캐시 활용):**

```bash
pnpm build
```

### Atomic Design 작업 순서

**반드시 아래 순서를 지켜 상위 단계부터 구축한다.** 상위 단계가 완성되지 않았으면 하위 단계를 만들지 않는다.

1. **0단계 Foundation** — Color, Typography, Spacing, Icons
2. **1단계 Atoms** — Button, Input, Checkbox, Badge, Toggle 등 (현재 단계)
3. **2단계 Molecules** — FormField, 검색 바(입력창+버튼) 등
4. **3단계 Organisms** — Header, Nav, Card List, Footer
5. **4단계 Templates** — 레이아웃 와이어프레임
6. **5단계 Pages** — 실제 콘텐츠 적용, 테스트

### 컴포넌트 추가하기

**체크리스트:**

1. **Foundation 토큰이 준비됐는가?** 새 색상/크기가 필요하다면 `@dx/styles/src/tokens.css`에 먼저 추가.
2. **Compound 패턴으로 분해 가능한가?** 폼 관련이면 `label`/`helperText`/`error`를 prop이 아닌 별도 컴포넌트로.
3. **Shoelace에 유사한 컴포넌트가 있는가?**
   - 있으면: `@dx/core/src/components/<name>.ts`에서 `extends Sl<Name>`으로 래핑
   - 없으면: `LitElement` 또는 `HTMLElement`를 직접 상속
4. **이벤트 재매핑** — Shoelace의 `sl-*` 이벤트는 `connectedCallback`에서 `remapEvents`로 `ds-*`로 변환
5. **React 래퍼 작성** — `@dx/react/src/components/<name>.tsx`에 `createComponent` 3~5줄
6. **Storybook 스토리** — 4탭 코드 스니펫(HTML/CSS, Web Component, Thymeleaf, React) 필수
7. **Shadow DOM** — `createRenderRoot` 오버라이드하지 않음 (기본값 유지). Shoelace 내부 스타일을 보존하기 위함.

**예시 — 새 컴포넌트 `ds-avatar` 추가:**

```ts
// packages/core/src/components/avatar.ts
import SlAvatar from '@shoelace-style/shoelace/dist/components/avatar/avatar.component.js';

export class DsAvatar extends SlAvatar {}

if (!customElements.get('ds-avatar')) {
  customElements.define('ds-avatar', DsAvatar);
}
```

```ts
// packages/core/src/index.ts 에 export 추가
export { DsAvatar } from './components/avatar.js';
```

```tsx
// packages/react/src/components/avatar.tsx
import React from 'react';
import { createComponent } from '@lit/react';
import { DsAvatar } from '@dx/core';

export const Avatar = createComponent({
  tagName: 'ds-avatar',
  elementClass: DsAvatar,
  react: React,
  events: {},
});
```

```ts
// packages/storybook/stories/avatar.stories.ts (생략 — 4탭 코드 필수)
```

### 커밋 메시지 규칙

- **모든 커밋 메시지는 한글로 작성**
- Conventional Commits 접두사는 영문 유지: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`
- 제목은 한글로 간결하게, 본문이 필요하면 한글로 상세히

```
✅ feat(core): ds-avatar 컴포넌트 추가 (Shoelace 래핑)
✅ fix(styles): 다크모드에서 border 색상이 적용되지 않는 문제 수정
❌ feat(core): add avatar component  (영문 제목 금지)
```

---

## 기술 스택

| 도구 | 용도 |
|------|------|
| **pnpm workspaces** | 모노레포 패키지 관리 |
| **Turborepo** | 빌드 캐시 + 의존 순서 |
| **Lit 3** | Web Components 런타임 |
| **Shoelace 2** | 기반 컴포넌트 라이브러리 |
| **@lit/react** | React 래퍼 자동 생성 |
| **Tailwind CSS v4** | 유틸리티 + CSS Variables (OKLCH) |
| **Lucide Icons** | 아이콘 세트 |
| **Vite 8 (lib mode)** | 패키지 번들링 |
| **TypeScript 6** | 타입 안전성 |
| **Storybook 8** | 문서 사이트 + 4탭 코드 뷰 |

---

## 참고 문서

- **작업 지침 / 설계 원칙** — [`CLAUDE.md`](./CLAUDE.md)
- **상세 스펙** — [`docs/superpowers/specs/2026-04-17-dx-design-system-design.md`](./docs/superpowers/specs/2026-04-17-dx-design-system-design.md)
- **구현 플랜** — [`docs/superpowers/plans/2026-04-17-dx-design-system-implementation.md`](./docs/superpowers/plans/2026-04-17-dx-design-system-implementation.md)
- **Shoelace** — https://shoelace.style/
- **shadcn/ui (Compound 패턴 참고)** — https://ui.shadcn.com/
- **Radix UI Primitives** — https://www.radix-ui.com/primitives

---

## 라이선스

ISC (내부용)
