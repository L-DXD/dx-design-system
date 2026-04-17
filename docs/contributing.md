# 개발 가이드

DX Design System에 기여하거나 내부 구조를 이해하려는 개발자를 위한 문서.

---

## 목차

- [패키지 구조](#패키지-구조)
- [초기 셋업](#초기-셋업)
- [개발 워크플로우](#개발-워크플로우)
- [Atomic Design 작업 순서](#atomic-design-작업-순서)
- [컴포넌트 추가하기](#컴포넌트-추가하기)
- [커밋 메시지 규칙](#커밋-메시지-규칙)
- [기술 스택](#기술-스택)

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

## 초기 셋업

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

---

## 개발 워크플로우

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

---

## Atomic Design 작업 순서

**반드시 아래 순서를 지켜 상위 단계부터 구축한다.** 상위 단계가 완성되지 않았으면 하위 단계를 만들지 않는다.

1. **0단계 Foundation** — Color, Typography, Spacing, Icons
2. **1단계 Atoms** — Button, Input, Checkbox, Badge, Toggle 등 (현재 단계)
3. **2단계 Molecules** — FormField, 검색 바(입력창+버튼) 등
4. **3단계 Organisms** — Header, Nav, Card List, Footer
5. **4단계 Templates** — 레이아웃 와이어프레임
6. **5단계 Pages** — 실제 콘텐츠 적용, 테스트

---

## 컴포넌트 추가하기

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

---

## 커밋 메시지 규칙

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

- **작업 지침 / 설계 원칙** — [`CLAUDE.md`](../CLAUDE.md)
- **아키텍처 상세** — [`architecture.md`](./architecture.md)
- **상세 스펙** — [`superpowers/specs/2026-04-17-dx-design-system-design.md`](./superpowers/specs/2026-04-17-dx-design-system-design.md)
- **구현 플랜** — [`superpowers/plans/2026-04-17-dx-design-system-implementation.md`](./superpowers/plans/2026-04-17-dx-design-system-implementation.md)
- **Shoelace** — https://shoelace.style/
- **shadcn/ui (Compound 패턴 참고)** — https://ui.shadcn.com/
- **Radix UI Primitives** — https://www.radix-ui.com/primitives
