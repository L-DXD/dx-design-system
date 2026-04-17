# DX Design System — 설계 문서

## 개요

React/Next.js와 Thymeleaf 양쪽에서 사용 가능한 멀티 플랫폼 디자인 시스템.
Shoelace(Lit 기반 Web Components)를 코어로 감싸고, 서비스별 CSS Variables 오버라이드로 멀티 브랜드 테마를 지원한다.

### 핵심 결정 사항

| 항목 | 결정 |
|------|------|
| 코어 기술 | Shoelace (Lit Web Components) 기반 래핑 |
| 소비자 | React/Next.js + Thymeleaf (동시 지원) |
| 테마 전략 | CSS Variables 오버라이드 (서비스별 theme.css) |
| Storybook 코드 탭 | HTML/CSS, Web Component, Thymeleaf, React (4탭) |
| 패키지 스코프 | `@dx/*` (GitHub Packages, public) |
| 문서 배포 | Chromatic (비주얼 리그레션) + GitHub Pages (문서 사이트) |
| 초기 컴포넌트 | 8개 (Button, Input, Select, Checkbox, Radio, Badge, Chip, Toggle) |

---

## 1. 아키텍처

### 모노레포 구조

```
dx-design-system/
├── packages/
│   ├── core/          ← @dx/core: Shoelace 래핑 + ds- 접두사 재등록
│   ├── react/         ← @dx/react: @lit/react 래퍼 (파일당 3~5줄)
│   ├── styles/        ← @dx/styles: Tailwind CSS + CSS Variables + 기본 테마
│   └── storybook/     ← 문서 사이트 (4탭 코드 뷰)
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

### 패키지 의존 관계 (빌드 순서)

```
@dx/styles → @dx/core → @dx/react → storybook
```

### 각 패키지 역할

| 패키지 | 빌드 도구 | 출력물 | 소비자 |
|--------|----------|--------|--------|
| `@dx/styles` | Tailwind v4 + PostCSS | `styles.css` (CSS Variables + 유틸리티) | 모든 환경 |
| `@dx/core` | Vite (lib mode) + TS | ESM 모듈 + CDN 번들 (`dx-core.bundle.js`) | @dx/react, Thymeleaf, HTML |
| `@dx/react` | Vite (lib mode) + TS | ESM 모듈 (tree-shakeable) | React/Next.js |
| `storybook` | Storybook + Vite | 정적 사이트 | 개발자 문서 |

### 소비자별 설치 방식

**React/Next.js:**
```bash
pnpm add @dx/react @dx/styles
```

**Thymeleaf (CDN):**

패키지는 npmjs.com에 동시 배포되며, jsdelivr/unpkg가 자동으로 CDN을 제공한다.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@dx/core@1/dist/dx-core.bundle.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dx/styles@1/dist/styles.css">
```

**순수 HTML:**
```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@dx/core@1/dist/dx-core.bundle.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@dx/styles@1/dist/styles.css">
```

---

## 2. 컴포넌트 설계

### 설계 원칙

- **Shadow DOM 유지**: Shoelace 내부 스타일을 보존하기 위해 Shadow DOM을 유지한다.
- **태그 접두사 `ds-`**: 기존 HTML/Shoelace 태그와 충돌 방지.
- **Slot 기반 컴포지션**: 자식 콘텐츠는 `<slot>`으로 전달 (React의 `children`과 동일).
- **이벤트 접두사 `ds-`**: 네이티브 이벤트와 구분. Shoelace의 `sl-` 이벤트를 `ds-`로 재매핑.

### 스타일 커스터마이징 전략

Shadow DOM은 유지하되, 다음 세 가지 방법으로 외부에서 스타일을 제어한다:

1. **CSS Variables (주요 전략)**: `--dx-*` 및 `--sl-*` 변수는 Shadow DOM 경계를 관통한다. 서비스별 테마는 CSS Variables 오버라이드만으로 대부분 구현 가능.
2. **`::part()` CSS**: Shoelace가 노출한 parts(`::part(base)`, `::part(label)` 등)를 통해 Shadow DOM 내부 요소에 스타일 적용.
3. **외부 레이아웃/간격 클래스**: 컴포넌트 **외부**에 Tailwind 클래스 적용은 가능 (예: `<ds-button class="mt-4">`에서 `mt-4`는 호스트 요소에 적용됨). 단, 내부 버튼 요소에는 영향 없음.

```ts
// 간단한 래핑만 수행. Shadow DOM은 Shoelace 기본값 유지.
export class DsButton extends SlButton {}
customElements.define('ds-button', DsButton);
```

**트레이드오프:**
- Tailwind 유틸리티로 컴포넌트 **내부** 스타일(예: 버튼의 `padding`, `background`)은 직접 오버라이드 불가
- 대신 Shoelace의 검증된 스타일 시스템과 접근성을 그대로 활용
- 깊은 커스터마이징이 필요하면 `::part()` 또는 CSS Variables로 해결

### Shoelace → DX 매핑

| DX 컴포넌트 | Shoelace 원본 | 비고 |
|------------|--------------|------|
| `ds-button` | `sl-button` | variant, size, loading 그대로 |
| `ds-input` | `sl-input` | label, help-text 슬롯 내장 |
| `ds-select` + `ds-option` | `sl-select` + `sl-option` | 키보드, 포지셔닝 내장 |
| `ds-checkbox` | `sl-checkbox` | 접근성 내장 |
| `ds-radio-group` + `ds-radio` | `sl-radio-group` + `sl-radio` | 그룹 관리 내장 |
| `ds-badge` | `sl-badge` | pulse 애니메이션 옵션 포함 |
| `ds-chip` | `sl-tag` | removable, size 지원 |
| `ds-toggle` | `sl-switch` | 접근성 내장 |

### 컴포넌트 API 명세

| 컴포넌트 | Props | 이벤트 | Slot |
|----------|-------|--------|------|
| `ds-button` | `variant` (primary/secondary/ghost/destructive), `size` (sm/md/lg), `disabled`, `loading` | `click` (네이티브) | default (라벨) |
| `ds-input` | `type` (text/email/password/number), `placeholder`, `value`, `disabled`, `error` | `ds-input`, `ds-change` | label, helper |
| `ds-select` | `value`, `placeholder`, `disabled`, `error` | `ds-change` | default (ds-option 목록) |
| `ds-option` | `value`, `disabled` | — | default (라벨) |
| `ds-checkbox` | `checked`, `disabled`, `value` | `ds-change` | default (라벨) |
| `ds-radio-group` | `name`, `value`, `disabled` | `ds-change` | default (ds-radio 목록) |
| `ds-radio` | `value`, `disabled` | — | default (라벨) |
| `ds-badge` | `variant` (default/secondary/destructive/outline), `size` (sm/md) | — | default (텍스트) |
| `ds-chip` | `variant` (default/outline), `removable`, `selected` | `ds-remove`, `ds-select` | default (텍스트) |
| `ds-toggle` | `checked`, `disabled`, `size` (sm/md) | `ds-change` | default (라벨) |

### @dx/core 래핑 방식

```ts
// packages/core/src/components/button.ts
import '@shoelace-style/shoelace/dist/components/button/button.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.js';

export class DsButton extends SlButton {
  // Shoelace 기능을 그대로 상속
  // 필요한 경우에만 오버라이드
}

customElements.define('ds-button', DsButton);
```

### @dx/react 래퍼

```tsx
// packages/react/src/components/button.tsx
import React from 'react';
import { createComponent } from '@lit/react';
import { DsButton } from '@dx/core';

export const Button = createComponent({
  tagName: 'ds-button',
  elementClass: DsButton,
  react: React,
  events: { onClick: 'click' },
});
```

### 4탭 사용 예시 (Select 기준)

**HTML/CSS (no-JS fallback):**

HTML/CSS 탭은 Web Component 없이도 사용 가능한 순수 HTML 폴백을 제공한다. 인터랙션(키보드 네비게이션, 포지셔닝 등)은 Web Component 버전과 동일하지 않으며, 스타일만 일치시키는 것이 목표다.

```html
<select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
  <option value="">선택하세요</option>
  <option value="a">옵션 A</option>
</select>
```

**Web Component:**
```html
<ds-select placeholder="선택하세요">
  <ds-option value="a">옵션 A</ds-option>
</ds-select>
```

**Thymeleaf:**
```html
<ds-select th:attr="placeholder=${placeholder}">
  <ds-option th:each="item : ${options}"
             th:attr="value=${item.value}"
             th:text="${item.label}"></ds-option>
</ds-select>
```

**React:**
```tsx
import { Select, Option } from '@dx/react';

<Select placeholder="선택하세요" onDsChange={(e) => setValue(e.detail.value)}>
  <Option value="a">옵션 A</Option>
</Select>
```

---

## 3. 테마/스타일 시스템

### 3단 레이어 구조

```
Layer 1: Shoelace 기본 CSS Variables (sl-color-primary-600 등)
    ↓ 매핑 (base.css)
Layer 2: @dx/styles 기본 테마 (--dx-color-primary 등)
    ↓ 오버라이드 (서비스별 theme.css)
Layer 3: 서비스별 테마 (--dx-color-primary: #e11d48)
```

### @dx/styles 패키지 구조

```
packages/styles/
├── src/
│   ├── base.css          ← Tailwind + Shoelace CSS Variables 매핑
│   ├── tokens.css        ← DX 디자인 토큰 정의
│   └── themes/
│       └── default.css   ← 기본 테마
├── dist/
│   └── styles.css        ← 빌드 결과물 (단일 파일)
└── package.json
```

### DX 디자인 토큰

```css
:root {
  /* 색상 */
  --dx-color-primary: #3b82f6;
  --dx-color-primary-hover: #2563eb;
  --dx-color-secondary: #6b7280;
  --dx-color-destructive: #ef4444;
  --dx-color-background: #ffffff;
  --dx-color-foreground: #0f172a;
  --dx-color-muted: #f1f5f9;
  --dx-color-border: #e2e8f0;

  /* 타이포그래피 */
  --dx-font-sans: 'Pretendard', system-ui, sans-serif;
  --dx-font-size-sm: 0.875rem;
  --dx-font-size-base: 1rem;
  --dx-font-size-lg: 1.125rem;

  /* 간격 */
  --dx-radius: 0.5rem;
  --dx-radius-sm: 0.25rem;
  --dx-radius-lg: 0.75rem;

  /* 그림자 */
  --dx-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --dx-shadow-md: 0 4px 6px rgba(0,0,0,0.07);
}
```

### Shoelace 변수 매핑

```css
/* base.css — DX 토큰 → Shoelace 변수 매핑 */
:root {
  --sl-color-primary-600: var(--dx-color-primary);
  --sl-color-primary-700: var(--dx-color-primary-hover);
  --sl-color-danger-600: var(--dx-color-destructive);
  --sl-font-sans: var(--dx-font-sans);
  --sl-border-radius-medium: var(--dx-radius);
  --sl-input-border-radius-medium: var(--dx-radius);
}
```

### 서비스별 테마 오버라이드

```css
/* 서비스 A: theme.css */
:root {
  --dx-color-primary: #e11d48;
  --dx-color-primary-hover: #be123c;
  --dx-font-sans: 'Noto Sans KR', sans-serif;
  --dx-radius: 0.25rem;
}
```

서비스 팀은 `--dx-*` 변수만 알면 된다. Shoelace 변수를 직접 건드릴 필요 없음.

---

## 4. Storybook + 빌드/배포

### Storybook 구성

```
packages/storybook/
├── .storybook/
│   ├── main.ts           ← Vite builder, Web Components 프레임워크
│   ├── preview.ts        ← @dx/styles import, 테마 전환 데코레이터
│   └── addons/
│       └── code-tabs/    ← 4탭 코드 뷰 커스텀 addon
├── stories/
│   ├── button.stories.ts
│   ├── input.stories.ts
│   └── ...
└── package.json
```

### 4탭 코드 뷰

각 스토리의 `parameters.codeTabs`에 4가지 코드 스니펫을 선언한다. 커스텀 addon이 Storybook 패널에 **HTML/CSS | Web Component | Thymeleaf | React** 탭을 생성하고 복사 버튼을 제공한다.

```ts
export const Primary: StoryObj = {
  render: () => html`<ds-button variant="primary">저장하기</ds-button>`,
  parameters: {
    codeTabs: {
      html: `<button class="...">저장하기</button>`,
      wc: `<ds-button variant="primary">저장하기</ds-button>`,
      thymeleaf: `<ds-button th:attr="variant=\${v}">[[#{btn.save}]]</ds-button>`,
      react: `<Button variant="primary">저장하기</Button>`,
    },
  },
};
```

### 빌드 파이프라인 (Turborepo)

```json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "test": { "dependsOn": ["build"] }
  }
}
```

빌드 순서: `@dx/styles` → `@dx/core` → `@dx/react` → `storybook`

### @dx/core 이중 출력

```json
{
  "name": "@dx/core",
  "exports": {
    ".": "./dist/index.js",
    "./bundle": "./dist/dx-core.bundle.js"
  }
}
```

| 출력물 | 용도 | 소비자 |
|--------|------|--------|
| `dist/index.js` (ESM, tree-shakeable) | npm import | @dx/react, 모던 번들러 |
| `dist/dx-core.bundle.js` (all-in-one) | CDN / script 태그 | Thymeleaf, 순수 HTML |
| `dist/styles.css` (@dx/styles) | CSS link | 모든 환경 |

### 배포 흐름

```
PR 생성
  ↓
CI (GitHub Actions): lint + test + build
  ↓
Chromatic: 비주얼 리그레션 테스트 + 스토리 리뷰
  ↓
PR 머지 (main)
  ↓ 동시 실행
├── GitHub Packages: @dx/core, @dx/react, @dx/styles 배포
├── GitHub Pages: Storybook 문서 사이트 배포
└── CDN: bundle.js + styles.css (npmjs.com에 동시 배포 → jsdelivr/unpkg에서 자동 제공)
```

### 버전 관리 (changesets)

```
@dx/styles  1.0.0  ← 테마/토큰 변경 시
@dx/core    1.0.0  ← 컴포넌트 변경 시 (Shoelace 업데이트 포함)
@dx/react   1.0.0  ← 래퍼 변경 시 (보통 core와 같이 올라감)
```

독립 버전 관리. 토큰만 바뀌면 styles만 패치, 컴포넌트가 바뀌면 core + react 같이 올림.

---

## 5. SSR 고려사항 (Next.js)

Web Components는 브라우저 API(`customElements.define`)에 의존하기 때문에 서버에서 렌더링되지 않는다. Next.js에서 `@dx/react` 컴포넌트를 사용할 때:

- `@dx/react` 컴포넌트를 사용하는 파일에 `'use client'` 지시어를 선언해야 한다.
- 서버 렌더링 시 Web Component 태그는 빈 요소로 전달되고, 클라이언트에서 hydration 후 렌더링된다.
- FOUC(Flash of Unstyled Content)를 방지하기 위해 `@dx/styles`의 CSS를 `<head>`에서 로드한다.

```tsx
'use client';
import { Button } from '@dx/react';

export function SaveButton() {
  return <Button variant="primary">저장하기</Button>;
}
```

---

## 6. 접근성

Shoelace 컴포넌트는 WCAG 2.1 AA 수준의 접근성을 기본 제공한다. DX 디자인 시스템은 이를 그대로 상속하며:

- **키보드 네비게이션**: 모든 인터랙티브 컴포넌트에 내장 (Tab, Enter, Escape, 화살표 키)
- **ARIA 속성**: Shoelace가 자동으로 `aria-expanded`, `aria-selected`, `role` 등을 관리
- **자동 테스트**: Storybook에 `@storybook/addon-a11y` (axe-core 기반)를 추가하여 각 스토리에서 접근성 위반을 자동 검출

---

## 기술 스택 요약

| 도구 | 용도 |
|------|------|
| pnpm workspaces | 모노레포 패키지 관리 |
| Turborepo | 빌드 캐시 + 의존 순서 관리 |
| Lit + Shoelace | Web Components 코어 |
| @lit/react | React 래퍼 자동 생성 |
| Tailwind CSS v4 | 유틸리티 CSS + CSS Variables |
| Vite (lib mode) | 패키지 번들링 |
| TypeScript | 타입 안전성 |
| Storybook | 문서 사이트 + 4탭 코드 뷰 |
| Chromatic | 비주얼 리그레션 테스트 |
| GitHub Pages | 문서 사이트 호스팅 |
| GitHub Packages | npm 패키지 배포 |
| changesets | 버전 관리 + 체인지로그 |
