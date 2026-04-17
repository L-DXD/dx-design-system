# DX Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shoelace 기반 멀티 플랫폼 디자인 시스템(@dx/core, @dx/react, @dx/styles) + Storybook 4탭 코드 뷰 문서 사이트 구축

**Architecture:** Shoelace Web Components를 ds- 접두사로 래핑한 @dx/core가 유일한 로직 소스. @dx/react는 @lit/react로 자동 생성된 3~5줄 래퍼. @dx/styles는 CSS Variables 3단 레이어(Shoelace → DX 토큰 → 서비스 테마)로 멀티 브랜드 지원.

**Tech Stack:** pnpm workspaces, Turborepo, Lit + Shoelace, @lit/react, Tailwind CSS v4, Vite (lib mode), TypeScript, Storybook 8 (Web Components), Chromatic

**Spec:** `docs/superpowers/specs/2026-04-17-dx-design-system-design.md`

---

## File Structure

```
dx-design-system/
├── package.json                          ← 루트 workspace (scripts: dev, build, storybook)
├── pnpm-workspace.yaml                   ← packages/* 선언
├── turbo.json                            ← tasks 정의 (build, dev, lint, test)
├── tsconfig.base.json                    ← 공유 TS 설정
├── .gitignore
│
├── packages/
│   ├── styles/
│   │   ├── package.json                  ← @dx/styles
│   │   ├── src/
│   │   │   ├── tokens.css                ← --dx-* 디자인 토큰
│   │   │   ├── base.css                  ← DX 토큰 → Shoelace 변수 매핑
│   │   │   ├── shoelace.css              ← Shoelace 내부 스타일 전역 재등록
│   │   │   └── themes/
│   │   │       └── default.css           ← 기본 테마 (tokens + base import)
│   │   ├── postcss.config.js
│   │   └── dist/
│   │       └── styles.css                ← 빌드 결과물
│   │
│   ├── core/
│   │   ├── package.json                  ← @dx/core (exports: . + ./bundle)
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts                ← lib mode + bundle 이중 출력
│   │   ├── src/
│   │   │   ├── index.ts                  ← 모든 컴포넌트 re-export
│   │   │   └── components/
│   │   │       ├── button.ts             ← DsButton extends SlButton
│   │   │       ├── input.ts              ← DsInput extends SlInput
│   │   │       ├── select.ts             ← DsSelect extends SlSelect
│   │   │       ├── option.ts             ← DsOption extends SlOption
│   │   │       ├── checkbox.ts           ← DsCheckbox extends SlCheckbox
│   │   │       ├── radio-group.ts        ← DsRadioGroup extends SlRadioGroup
│   │   │       ├── radio.ts              ← DsRadio extends SlRadio
│   │   │       ├── badge.ts              ← DsBadge extends SlBadge
│   │   │       ├── chip.ts              ← DsChip extends SlTag
│   │   │       └── toggle.ts             ← DsToggle extends SlSwitch
│   │   └── dist/
│   │       ├── index.js                  ← ESM (tree-shakeable)
│   │       └── dx-core.bundle.js         ← CDN all-in-one
│   │
│   ├── react/
│   │   ├── package.json                  ← @dx/react
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── index.ts                  ← 모든 컴포넌트 re-export
│   │   │   └── components/
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── select.tsx
│   │   │       ├── option.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── radio-group.tsx
│   │   │       ├── radio.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── chip.tsx
│   │   │       └── toggle.tsx
│   │   └── dist/
│   │       └── index.js
│   │
│   └── storybook/
│       ├── package.json
│       ├── .storybook/
│       │   ├── main.ts                   ← Vite builder + Web Components
│       │   ├── preview.ts                ← @dx/styles import
│       │   └── addons/
│       │       └── code-tabs/
│       │           ├── register.tsx       ← Storybook addon 등록
│       │           └── CodeTabsPanel.tsx  ← 4탭 패널 UI
│       └── stories/
│           ├── button.stories.ts
│           ├── input.stories.ts
│           ├── select.stories.ts
│           ├── checkbox.stories.ts
│           ├── radio.stories.ts
│           ├── badge.stories.ts
│           ├── chip.stories.ts
│           └── toggle.stories.ts
│
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-04-17-dx-design-system-design.md
        └── plans/
            └── 2026-04-17-dx-design-system-implementation.md
```

---

## Task 1: 모노레포 인프라 설정

**Files:**
- Modify: `package.json` (루트)
- Modify: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `tsconfig.base.json`
- Create: `.gitignore` (업데이트)

- [ ] **Step 1: 루트 package.json 업데이트**

```json
{
  "name": "dx-design-system",
  "private": true,
  "packageManager": "pnpm@10.12.2",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "storybook": "pnpm --filter storybook run storybook"
  },
  "devDependencies": {
    "turbo": "^2"
  }
}
```

- [ ] **Step 2: turbo.json 생성**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

- [ ] **Step 3: tsconfig.base.json 생성**

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "lib": ["ES2021", "DOM", "DOM.Iterable"]
  }
}
```

`useDefineForClassFields: false`는 Lit 데코레이터(`@property`)가 올바르게 동작하기 위해 필요하다.

- [ ] **Step 4: .gitignore 업데이트**

```
node_modules/
dist/
.superpowers/
.turbo/
*.tsbuildinfo
```

- [ ] **Step 5: Turborepo 설치 및 확인**

Run: `pnpm add -Dw turbo`
Run: `pnpm turbo --version`
Expected: Turborepo 버전 출력

- [ ] **Step 6: 커밋**

```bash
git add package.json turbo.json tsconfig.base.json .gitignore
git commit -m "chore: configure monorepo infrastructure (turbo, tsconfig)"
```

---

## Task 2: @dx/styles 패키지

**Files:**
- Modify: `packages/styles/package.json`
- Create: `packages/styles/src/tokens.css`
- Create: `packages/styles/src/base.css`
- Create: `packages/styles/src/shoelace.css`
- Create: `packages/styles/src/themes/default.css`
- Create: `packages/styles/postcss.config.js`

- [ ] **Step 1: package.json 업데이트**

```json
{
  "name": "@dx/styles",
  "version": "0.1.0",
  "description": "DX Design System styles — CSS Variables + Tailwind + Shoelace theme",
  "main": "dist/styles.css",
  "exports": {
    ".": "./dist/styles.css",
    "./tokens": "./src/tokens.css"
  },
  "files": ["dist", "src"],
  "scripts": {
    "build": "postcss src/themes/default.css -o dist/styles.css",
    "dev": "postcss src/themes/default.css -o dist/styles.css --watch"
  },
  "dependencies": {
    "@shoelace-style/shoelace": "^2"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "postcss": "^8",
    "postcss-cli": "^11"
  }
}
```

- [ ] **Step 2: postcss.config.js 생성**

```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

- [ ] **Step 3: tokens.css 생성**

```css
/* packages/styles/src/tokens.css */
:root {
  /* Colors */
  --dx-color-primary: #3b82f6;
  --dx-color-primary-hover: #2563eb;
  --dx-color-secondary: #6b7280;
  --dx-color-secondary-hover: #4b5563;
  --dx-color-destructive: #ef4444;
  --dx-color-destructive-hover: #dc2626;
  --dx-color-background: #ffffff;
  --dx-color-foreground: #0f172a;
  --dx-color-muted: #f1f5f9;
  --dx-color-muted-foreground: #64748b;
  --dx-color-border: #e2e8f0;
  --dx-color-input: #e2e8f0;
  --dx-color-ring: #3b82f6;

  /* Typography */
  --dx-font-sans: 'Pretendard', system-ui, -apple-system, sans-serif;
  --dx-font-size-xs: 0.75rem;
  --dx-font-size-sm: 0.875rem;
  --dx-font-size-base: 1rem;
  --dx-font-size-lg: 1.125rem;
  --dx-font-size-xl: 1.25rem;

  /* Spacing / Radius */
  --dx-radius: 0.5rem;
  --dx-radius-sm: 0.25rem;
  --dx-radius-lg: 0.75rem;
  --dx-radius-full: 9999px;

  /* Shadows */
  --dx-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --dx-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07);
  --dx-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

- [ ] **Step 4: base.css 생성 (DX 토큰 → Shoelace 변수 매핑)**

```css
/* packages/styles/src/base.css */

/* DX tokens → Shoelace CSS variable mapping */
:root {
  /* Primary */
  --sl-color-primary-50: color-mix(in srgb, var(--dx-color-primary) 10%, white);
  --sl-color-primary-100: color-mix(in srgb, var(--dx-color-primary) 20%, white);
  --sl-color-primary-200: color-mix(in srgb, var(--dx-color-primary) 30%, white);
  --sl-color-primary-300: color-mix(in srgb, var(--dx-color-primary) 50%, white);
  --sl-color-primary-400: color-mix(in srgb, var(--dx-color-primary) 70%, white);
  --sl-color-primary-500: color-mix(in srgb, var(--dx-color-primary) 85%, white);
  --sl-color-primary-600: var(--dx-color-primary);
  --sl-color-primary-700: var(--dx-color-primary-hover);
  --sl-color-primary-800: color-mix(in srgb, var(--dx-color-primary) 85%, black);
  --sl-color-primary-900: color-mix(in srgb, var(--dx-color-primary) 70%, black);
  --sl-color-primary-950: color-mix(in srgb, var(--dx-color-primary) 50%, black);

  /* Danger (destructive) */
  --sl-color-danger-600: var(--dx-color-destructive);
  --sl-color-danger-700: var(--dx-color-destructive-hover);

  /* Neutral */
  --sl-color-neutral-0: var(--dx-color-background);
  --sl-color-neutral-50: var(--dx-color-muted);
  --sl-color-neutral-300: var(--dx-color-border);
  --sl-color-neutral-500: var(--dx-color-muted-foreground);
  --sl-color-neutral-700: var(--dx-color-secondary);
  --sl-color-neutral-900: var(--dx-color-foreground);
  --sl-color-neutral-1000: var(--dx-color-foreground);

  /* Typography */
  --sl-font-sans: var(--dx-font-sans);
  --sl-font-size-small: var(--dx-font-size-sm);
  --sl-font-size-medium: var(--dx-font-size-base);
  --sl-font-size-large: var(--dx-font-size-lg);

  /* Border Radius */
  --sl-border-radius-small: var(--dx-radius-sm);
  --sl-border-radius-medium: var(--dx-radius);
  --sl-border-radius-large: var(--dx-radius-lg);
  --sl-border-radius-pill: var(--dx-radius-full);

  /* Input */
  --sl-input-border-radius-small: var(--dx-radius-sm);
  --sl-input-border-radius-medium: var(--dx-radius);
  --sl-input-border-radius-large: var(--dx-radius-lg);
  --sl-input-border-color: var(--dx-color-border);
  --sl-input-border-color-focus: var(--dx-color-ring);

  /* Focus Ring */
  --sl-focus-ring-color: var(--dx-color-ring);
  --sl-focus-ring-width: 2px;
  --sl-focus-ring-offset: 2px;

  /* Shadow */
  --sl-shadow-small: var(--dx-shadow-sm);
  --sl-shadow-medium: var(--dx-shadow-md);
  --sl-shadow-large: var(--dx-shadow-lg);
}
```

- [ ] **Step 5: shoelace.css 생성 (Shoelace 내부 스타일 전역 재등록)**

```css
/* packages/styles/src/shoelace.css */
/* Shoelace 컴포넌트의 Shadow DOM을 비활성화했으므로,
   내부 스타일이 전역으로 노출되어야 한다.
   Shoelace의 themes/light.css를 import하여 기본 변수를 제공한다. */
@import '@shoelace-style/shoelace/dist/themes/light.css';
```

- [ ] **Step 6: default.css 생성 (엔트리포인트)**

```css
/* packages/styles/src/themes/default.css */
@import 'tailwindcss';
@import '../tokens.css';
@import '../base.css';
@import '../shoelace.css';
```

- [ ] **Step 7: 의존성 설치 및 빌드 테스트**

Run: `cd packages/styles && pnpm install`
Run: `mkdir -p dist && pnpm build`
Expected: `dist/styles.css` 생성, CSS Variables + Tailwind 유틸리티 포함

- [ ] **Step 8: 커밋**

```bash
git add packages/styles/
git commit -m "feat(styles): add @dx/styles with tokens, Shoelace mapping, and Tailwind"
```

---

## Task 3: @dx/core 패키지 — 인프라

**Files:**
- Modify: `packages/core/package.json`
- Create: `packages/core/tsconfig.json`
- Create: `packages/core/vite.config.ts`
- Create: `packages/core/src/index.ts`

- [ ] **Step 1: package.json 업데이트**

```json
{
  "name": "@dx/core",
  "version": "0.1.0",
  "description": "DX Design System — Lit Web Components (Shoelace-based)",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./bundle": "./dist/dx-core.bundle.js"
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build && vite build --config vite.config.bundle.ts",
    "dev": "vite build --watch"
  },
  "dependencies": {
    "lit": "^3",
    "@shoelace-style/shoelace": "^2"
  },
  "devDependencies": {
    "typescript": "^6",
    "vite": "^8"
  },
  "peerDependencies": {
    "@dx/styles": "workspace:*"
  }
}
```

- [ ] **Step 2: tsconfig.json 생성**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: vite.config.ts 생성 (lib mode — ESM)**

```ts
// packages/core/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['lit', /^@shoelace-style\//, /^@dx\//],
    },
    outDir: 'dist',
  },
});
```

타입 선언은 `tsc`로 별도 생성한다. `package.json`의 `build` 스크립트를 다음과 같이 수정:
```json
"build": "vite build && vite build --config vite.config.bundle.ts && tsc --emitDeclarationOnly --outDir dist"
```

- [ ] **Step 4: vite.config.bundle.ts 생성 (CDN all-in-one)**

```ts
// packages/core/vite.config.bundle.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'dx-core.bundle.js',
    },
    // 번들에는 모든 의존성을 포함 (CDN용)
    rollupOptions: {
      external: [],
    },
    outDir: 'dist',
    emptyOutDir: false, // ESM 빌드 결과를 보존
  },
});
```

- [ ] **Step 5: 빈 index.ts 생성**

```ts
// packages/core/src/index.ts
// Components will be exported here as they are created
```

- [ ] **Step 6: 의존성 설치**

Run: `cd packages/core && pnpm install`
Expected: shoelace, lit, vite, typescript 설치 완료

- [ ] **Step 7: 커밋**

```bash
git add packages/core/
git commit -m "chore(core): configure @dx/core package with Vite lib mode"
```

---

## Task 4: @dx/core — Button 컴포넌트 (파일럿)

Button을 먼저 만들어서 Shoelace 래핑 + Shadow DOM 비활성화 패턴을 검증한다. 이 패턴이 확정되면 나머지 컴포넌트에 동일하게 적용한다.

**Files:**
- Create: `packages/core/src/components/button.ts`
- Modify: `packages/core/src/index.ts`

- [ ] **Step 1: button.ts 생성**

```ts
// packages/core/src/components/button.ts
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';

export class DsButton extends SlButton {
  // Shadow DOM 비활성화 — 외부 Tailwind 클래스 적용 가능
  static override createRenderRoot() {
    return this;
  }

  // Shoelace sl-* 이벤트를 ds-* 로 재디스패치
  override connectedCallback() {
    super.connectedCallback();
    // Button은 네이티브 click만 사용하므로 추가 이벤트 매핑 불필요
  }
}

// ds- 접두사로 커스텀 엘리먼트 등록
if (!customElements.get('ds-button')) {
  customElements.define('ds-button', DsButton);
}
```

- [ ] **Step 2: index.ts에 export 추가**

```ts
// packages/core/src/index.ts
export { DsButton } from './components/button.js';
```

- [ ] **Step 3: 빌드 테스트**

Run: `cd packages/core && pnpm build`
Expected: `dist/index.js`와 `dist/dx-core.bundle.js` 생성, 에러 없음

- [ ] **Step 4: Shadow DOM 비활성화 검증**

빌드가 성공하면, 간단한 HTML 파일로 동작을 확인한다.

Create `packages/core/test.html`:
```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../styles/dist/styles.css">
</head>
<body>
  <ds-button variant="primary" class="mt-4">테스트 버튼</ds-button>
  <script type="module" src="./dist/dx-core.bundle.js"></script>
</body>
</html>
```

브라우저에서 열어서 확인:
1. 버튼이 렌더링되는가
2. `mt-4` Tailwind 클래스가 적용되는가
3. Shadow DOM이 없는가 (DevTools Elements 탭에서 `#shadow-root`가 안 보여야 함)

**중요:** Shadow DOM 비활성화가 Shoelace Button에서 문제를 일으키면, `::part()` 방식으로 대안을 테스트한다. 결과에 따라 나머지 컴포넌트의 접근 방식이 결정된다.

- [ ] **Step 5: test.html 삭제 및 커밋**

```bash
rm packages/core/test.html
git add packages/core/
git commit -m "feat(core): add ds-button component wrapping Shoelace"
```

---

## Task 5: @dx/core — 나머지 7개 컴포넌트

Task 4에서 검증된 패턴을 동일하게 적용한다.

**Files:**
- Create: `packages/core/src/components/input.ts`
- Create: `packages/core/src/components/select.ts`
- Create: `packages/core/src/components/option.ts`
- Create: `packages/core/src/components/checkbox.ts`
- Create: `packages/core/src/components/radio-group.ts`
- Create: `packages/core/src/components/radio.ts`
- Create: `packages/core/src/components/badge.ts`
- Create: `packages/core/src/components/chip.ts`
- Create: `packages/core/src/components/toggle.ts`
- Modify: `packages/core/src/index.ts`

모든 컴포넌트에 공통으로 적용되는 이벤트 재디스패치 헬퍼:

```ts
// packages/core/src/utils/remap-events.ts
/**
 * Shoelace의 sl-* 이벤트를 ds-* 이벤트로 재디스패치한다.
 * 원본 이벤트의 detail, bubbles, composed를 그대로 전달한다.
 */
export function remapEvents(el: HTMLElement, eventMap: Record<string, string>) {
  for (const [slEvent, dsEvent] of Object.entries(eventMap)) {
    el.addEventListener(slEvent, (e: Event) => {
      const ce = e as CustomEvent;
      el.dispatchEvent(new CustomEvent(dsEvent, {
        detail: ce.detail,
        bubbles: true,
        composed: true,
      }));
    });
  }
}
```

- [ ] **Step 1: input.ts (이벤트 재매핑 포함)**

```ts
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsInput extends SlInput {
  static override createRenderRoot() { return this; }

  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, {
      'sl-input': 'ds-input',
      'sl-change': 'ds-change',
    });
  }
}
if (!customElements.get('ds-input')) {
  customElements.define('ds-input', DsInput);
}
```

- [ ] **Step 2: select.ts + option.ts**

```ts
// select.ts
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsSelect extends SlSelect {
  static override createRenderRoot() { return this; }
  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-select')) {
  customElements.define('ds-select', DsSelect);
}
```

```ts
// option.ts
import SlOption from '@shoelace-style/shoelace/dist/components/option/option.component.js';

export class DsOption extends SlOption {
  static override createRenderRoot() { return this; }
}
if (!customElements.get('ds-option')) {
  customElements.define('ds-option', DsOption);
}
```

- [ ] **Step 3: checkbox.ts**

```ts
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsCheckbox extends SlCheckbox {
  static override createRenderRoot() { return this; }
  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-checkbox')) {
  customElements.define('ds-checkbox', DsCheckbox);
}
```

- [ ] **Step 4: radio-group.ts + radio.ts**

```ts
// radio-group.ts
import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsRadioGroup extends SlRadioGroup {
  static override createRenderRoot() { return this; }
  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-radio-group')) {
  customElements.define('ds-radio-group', DsRadioGroup);
}
```

```ts
// radio.ts
import SlRadio from '@shoelace-style/shoelace/dist/components/radio/radio.component.js';

export class DsRadio extends SlRadio {
  static override createRenderRoot() { return this; }
}
if (!customElements.get('ds-radio')) {
  customElements.define('ds-radio', DsRadio);
}
```

- [ ] **Step 5: badge.ts**

```ts
import SlBadge from '@shoelace-style/shoelace/dist/components/badge/badge.component.js';

export class DsBadge extends SlBadge {
  static override createRenderRoot() { return this; }
}
if (!customElements.get('ds-badge')) {
  customElements.define('ds-badge', DsBadge);
}
```

- [ ] **Step 6: chip.ts (Shoelace의 sl-tag 래핑)**

```ts
import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsChip extends SlTag {
  static override createRenderRoot() { return this; }
  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-remove': 'ds-remove' });
  }
}
if (!customElements.get('ds-chip')) {
  customElements.define('ds-chip', DsChip);
}
```

- [ ] **Step 7: toggle.ts (Shoelace의 sl-switch 래핑)**

```ts
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsToggle extends SlSwitch {
  static override createRenderRoot() { return this; }
  override connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-toggle')) {
  customElements.define('ds-toggle', DsToggle);
}
```

- [ ] **Step 8: index.ts 업데이트**

```ts
// packages/core/src/index.ts
export { remapEvents } from './utils/remap-events.js';
export { DsButton } from './components/button.js';
export { DsInput } from './components/input.js';
export { DsSelect } from './components/select.js';
export { DsOption } from './components/option.js';
export { DsCheckbox } from './components/checkbox.js';
export { DsRadioGroup } from './components/radio-group.js';
export { DsRadio } from './components/radio.js';
export { DsBadge } from './components/badge.js';
export { DsChip } from './components/chip.js';
export { DsToggle } from './components/toggle.js';
```

- [ ] **Step 9: 빌드 및 확인**

Run: `cd packages/core && pnpm build`
Expected: 에러 없이 빌드 완료

- [ ] **Step 10: 커밋**

```bash
git add packages/core/
git commit -m "feat(core): add all 8 components (input, select, checkbox, radio, badge, chip, toggle)"
```

---

## Task 6: @dx/react 패키지

**Files:**
- Create: `packages/react/package.json`
- Create: `packages/react/tsconfig.json`
- Create: `packages/react/vite.config.ts`
- Create: `packages/react/src/index.ts`
- Create: `packages/react/src/components/button.tsx`
- Create: `packages/react/src/components/input.tsx`
- Create: `packages/react/src/components/select.tsx`
- Create: `packages/react/src/components/option.tsx`
- Create: `packages/react/src/components/checkbox.tsx`
- Create: `packages/react/src/components/radio-group.tsx`
- Create: `packages/react/src/components/radio.tsx`
- Create: `packages/react/src/components/badge.tsx`
- Create: `packages/react/src/components/chip.tsx`
- Create: `packages/react/src/components/toggle.tsx`

- [ ] **Step 1: package.json 생성**

```json
{
  "name": "@dx/react",
  "version": "0.1.0",
  "description": "DX Design System — React wrappers for @dx/core Web Components",
  "type": "module",
  "main": "dist/index.js",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "dependencies": {
    "@lit/react": "^1",
    "@dx/core": "workspace:*"
  },
  "peerDependencies": {
    "react": "^18 || ^19",
    "@dx/styles": "workspace:*"
  },
  "devDependencies": {
    "react": "^19",
    "@types/react": "^19",
    "typescript": "^6",
    "vite": "^8"
  }
}
```

- [ ] **Step 2: tsconfig.json 생성**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: vite.config.ts 생성**

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', /^@lit\//, /^@dx\//, /^lit/],
    },
    outDir: 'dist',
  },
});
```

타입 선언은 `tsc`로 별도 생성. `package.json`의 `build`:
```json
"build": "vite build && tsc --emitDeclarationOnly --outDir dist"
```

- [ ] **Step 4: 10개 React 래퍼 컴포넌트 생성**

각 파일은 3~5줄. 예시 (button.tsx):

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

나머지 컴포넌트도 동일 패턴. 이벤트 매핑:

| 컴포넌트 | events |
|----------|--------|
| Button | `{ onClick: 'click' }` |
| Input | `{ onDsInput: 'ds-input', onDsChange: 'ds-change' }` |
| Select | `{ onDsChange: 'ds-change' }` |
| Option | `{}` |
| Checkbox | `{ onDsChange: 'ds-change' }` |
| RadioGroup | `{ onDsChange: 'ds-change' }` |
| Radio | `{}` |
| Badge | `{}` |
| Chip | `{ onDsRemove: 'ds-remove', onDsSelect: 'ds-select' }` |
| Toggle | `{ onDsChange: 'ds-change' }` |

- [ ] **Step 5: index.ts 생성**

```ts
// packages/react/src/index.ts
export { Button } from './components/button.js';
export { Input } from './components/input.js';
export { Select } from './components/select.js';
export { Option } from './components/option.js';
export { Checkbox } from './components/checkbox.js';
export { RadioGroup } from './components/radio-group.js';
export { Radio } from './components/radio.js';
export { Badge } from './components/badge.js';
export { Chip } from './components/chip.js';
export { Toggle } from './components/toggle.js';
```

- [ ] **Step 6: 의존성 설치 및 빌드**

Run: `cd packages/react && pnpm install`
Run: `pnpm build`
Expected: `dist/index.js` + `dist/index.d.ts` 생성

- [ ] **Step 7: 커밋**

```bash
git add packages/react/
git commit -m "feat(react): add @dx/react wrappers for all 10 components"
```

---

## Task 7: Storybook 설정

**Files:**
- Modify: `packages/storybook/package.json`
- Create: `packages/storybook/.storybook/main.ts`
- Create: `packages/storybook/.storybook/preview.ts`

- [ ] **Step 1: package.json 업데이트**

```json
{
  "name": "storybook",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "storybook": "storybook dev -p 6006",
    "build": "storybook build -o dist"
  },
  "dependencies": {
    "@dx/core": "workspace:*",
    "@dx/styles": "workspace:*"
  },
  "devDependencies": {
    "@storybook/web-components": "^8",
    "@storybook/web-components-vite": "^8",
    "@storybook/addon-essentials": "^8",
    "@storybook/addon-a11y": "^8",
    "@storybook/blocks": "^8",
    "storybook": "^8",
    "lit": "^3",
    "react": "^19",
    "react-dom": "^19",
    "@types/react": "^19"
  }
}
```

- [ ] **Step 2: .storybook/main.ts 생성**

```ts
// packages/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
```

- [ ] **Step 3: .storybook/preview.ts 생성**

```ts
// packages/storybook/.storybook/preview.ts
import '@dx/styles';
import '@dx/core';

import type { Preview } from '@storybook/web-components';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 4: 의존성 설치**

Run: `cd packages/storybook && pnpm install`

- [ ] **Step 5: 커밋**

```bash
git add packages/storybook/
git commit -m "chore(storybook): configure Storybook 8 with Web Components + a11y addon"
```

---

## Task 8: Storybook — Button 스토리 (파일럿)

**Files:**
- Create: `packages/storybook/stories/button.stories.ts`

- [ ] **Step 1: button.stories.ts 생성**

```ts
// packages/storybook/stories/button.stories.ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  parameters: {
    codeTabs: {
      html: `<button class="inline-flex items-center justify-center font-medium rounded-md h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
  저장하기
</button>`,
      wc: `<ds-button variant="primary">저장하기</ds-button>`,
      thymeleaf: `<ds-button th:attr="variant=\${variant}">[[#{btn.save}]]</ds-button>`,
      react: `import { Button } from '@dx/react';

<Button variant="primary" onClick={() => save()}>
  저장하기
</Button>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <ds-button
      variant=${args.variant || 'primary'}
      size=${args.size || 'medium'}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      저장하기
    </ds-button>
  `,
};

export const Secondary: Story = {
  render: () => html`<ds-button variant="secondary">취소</ds-button>`,
};

export const Destructive: Story = {
  render: () => html`<ds-button variant="danger">삭제</ds-button>`,
};

export const Loading: Story = {
  render: () => html`<ds-button variant="primary" loading>로딩 중...</ds-button>`,
};

export const Disabled: Story = {
  render: () => html`<ds-button variant="primary" disabled>비활성화</ds-button>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-button size="small">Small</ds-button>
      <ds-button size="medium">Medium</ds-button>
      <ds-button size="large">Large</ds-button>
    </div>
  `,
};
```

- [ ] **Step 2: Storybook 실행 확인**

Run: `cd packages/storybook && pnpm storybook`
Expected: http://localhost:6006 에서 Components/Button 스토리 확인

검증 항목:
1. 6개 스토리가 모두 렌더링되는가
2. Controls 패널에서 variant, size, disabled, loading 변경이 반영되는가
3. a11y 탭에서 접근성 위반이 없는가

- [ ] **Step 3: 커밋**

```bash
git add packages/storybook/stories/
git commit -m "feat(storybook): add Button stories with 6 variants"
```

---

## Task 9: Storybook — 나머지 7개 컴포넌트 스토리

**Files:**
- Create: `packages/storybook/stories/input.stories.ts`
- Create: `packages/storybook/stories/select.stories.ts`
- Create: `packages/storybook/stories/checkbox.stories.ts`
- Create: `packages/storybook/stories/radio.stories.ts`
- Create: `packages/storybook/stories/badge.stories.ts`
- Create: `packages/storybook/stories/chip.stories.ts`
- Create: `packages/storybook/stories/toggle.stories.ts`

- [ ] **Step 1: input.stories.ts**

각 스토리 파일은 Button과 동일한 구조:
- `meta`: title, tags, argTypes, codeTabs (4탭 코드 스니펫)
- 기본 스토리 + 주요 상태 변형 (disabled, error, sizes 등)
- `codeTabs` 파라미터에 HTML/CSS, WC, Thymeleaf, React 코드 포함

- [ ] **Step 2: select.stories.ts**
- [ ] **Step 3: checkbox.stories.ts**
- [ ] **Step 4: radio.stories.ts** (ds-radio-group + ds-radio 조합)
- [ ] **Step 5: badge.stories.ts**
- [ ] **Step 6: chip.stories.ts**
- [ ] **Step 7: toggle.stories.ts**

- [ ] **Step 8: Storybook에서 전체 확인**

Run: `cd packages/storybook && pnpm storybook`
Expected: 8개 컴포넌트가 모두 Components/ 아래에 나열되고 렌더링됨

- [ ] **Step 9: 커밋**

```bash
git add packages/storybook/stories/
git commit -m "feat(storybook): add stories for all 8 components with 4-tab code snippets"
```

---

## Task 10: Storybook — 4탭 코드 뷰 커스텀 Addon

**Files:**
- Create: `packages/storybook/.storybook/addons/code-tabs/register.tsx`
- Create: `packages/storybook/.storybook/addons/code-tabs/CodeTabsPanel.tsx`
- Modify: `packages/storybook/.storybook/main.ts`

- [ ] **Step 1: CodeTabsPanel.tsx 생성**

Storybook의 `useParameter` hook으로 `codeTabs`를 읽어 탭 UI를 렌더링한다. 각 탭에는 syntax-highlighted 코드와 복사 버튼이 포함된다.

```tsx
// packages/storybook/.storybook/addons/code-tabs/CodeTabsPanel.tsx
import React, { useState } from 'react';
import { useParameter } from '@storybook/manager-api';
import { SyntaxHighlighter } from '@storybook/components';

const TAB_LABELS: Record<string, string> = {
  html: 'HTML/CSS',
  wc: 'Web Component',
  thymeleaf: 'Thymeleaf',
  react: 'React',
};

export const CodeTabsPanel: React.FC<{ active: boolean }> = ({ active }) => {
  const codeTabs = useParameter<Record<string, string>>('codeTabs', {});
  const tabKeys = Object.keys(codeTabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0] || 'html');
  const [copied, setCopied] = useState(false);

  if (!active || tabKeys.length === 0) {
    return <div style={{ padding: 16 }}>No code tabs defined for this story.</div>;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeTabs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        {tabKeys.map((key) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); setCopied(false); }}
            style={{
              padding: '6px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              background: activeTab === key ? '#1ea7fd' : '#fff',
              color: activeTab === key ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            {TAB_LABELS[key] || key}
          </button>
        ))}
        <button onClick={handleCopy} style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter language={activeTab === 'react' ? 'tsx' : 'html'}>
        {codeTabs[activeTab]}
      </SyntaxHighlighter>
    </div>
  );
};
```

- [ ] **Step 2: register.tsx 생성**

```tsx
// packages/storybook/.storybook/addons/code-tabs/register.tsx
import React from 'react';
import { addons, types } from '@storybook/manager-api';
import { AddonPanel } from '@storybook/components';
import { CodeTabsPanel } from './CodeTabsPanel';

const ADDON_ID = 'dx-code-tabs';
const PANEL_ID = `${ADDON_ID}/panel`;

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Code',
    render: ({ active }) => (
      <AddonPanel active={active ?? false}>
        <CodeTabsPanel active={active ?? false} />
      </AddonPanel>
    ),
  });
});
```

- [ ] **Step 3: main.ts에 addon 추가**

먼저 addon에 preset을 만들어 manager entry를 등록한다:

```ts
// packages/storybook/.storybook/addons/code-tabs/preset.ts
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function managerEntries(entry: string[] = []) {
  return [...entry, join(__dirname, 'register')];
}
```

그리고 main.ts에서 preset으로 추가:

```ts
// packages/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/web-components-vite';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    join(__dirname, 'addons/code-tabs/preset'),
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
```

- [ ] **Step 4: Storybook에서 Code 탭 확인**

Run: `cd packages/storybook && pnpm storybook`
Expected: 각 스토리 하단 패널에 "Code" 탭이 나타나고, HTML/CSS | Web Component | Thymeleaf | React 탭 전환 + 복사 버튼 동작

- [ ] **Step 5: 커밋**

```bash
git add packages/storybook/.storybook/
git commit -m "feat(storybook): add code-tabs addon for 4-tab code view"
```

---

## Task 11: 전체 빌드 검증 및 정리

**Files:**
- Modify: 루트 `package.json` (최종 확인)

- [ ] **Step 1: 루트에서 전체 빌드**

Run: `pnpm install` (루트에서)
Run: `pnpm build`
Expected: styles → core → react → storybook 순서로 빌드 완료, 에러 없음

- [ ] **Step 2: Storybook 빌드**

Run: `pnpm storybook` (개발 서버) 또는 `pnpm --filter storybook build` (정적 빌드)
Expected: 8개 컴포넌트 스토리 + Code 탭 정상 동작

- [ ] **Step 3: 최종 커밋**

```bash
git add -A
git commit -m "chore: finalize dx-design-system v0.1.0 setup"
```

---

## Out of Scope (v0.1.0 이후)

아래 항목들은 스펙에 정의되어 있지만 v0.1.0 초기 구현 범위 밖이다. 별도 플랜으로 다룬다:

- **CI/CD**: GitHub Actions 워크플로우 (lint, test, build, publish)
- **Chromatic**: 비주얼 리그레션 테스트 설정
- **changesets**: 버전 관리 + 자동 체인지로그
- **GitHub Pages**: Storybook 정적 사이트 자동 배포
- **npmjs.com 배포**: GitHub Packages + npmjs.com 동시 배포 파이프라인
- **테마 전환 데코레이터**: Storybook에서 기본 테마 / 서비스 테마 전환 UI
