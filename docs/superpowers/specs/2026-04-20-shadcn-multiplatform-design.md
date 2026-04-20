# shadcn 기반 멀티 플랫폼 디자인 시스템 설계

작성일: 2026-04-20
작성자: jayoung.lee (@dx-design-system)
상태: 승인 대기

## 배경

v0.1.0 에서 Shoelace(Lit Web Components) 기반 멀티 플랫폼 DS 를 시도했으나, **Shadow DOM 과 Tailwind 오버라이드의 구조적 충돌** (host 에만 적용, 내부 박스 안 바뀜) 을 해결할 수 없었다. 추가로 `@lit/react` 타입 체계, Shoelace 라이브러리 타입 버그, 빌드 툴체인 복잡도 등 유지보수 부담이 누적.

v0.2.0 에서는 shadcn/ui 기반으로 재출발한다. 핵심 관찰:

- **"멀티 플랫폼" = Web Component 가 유일한 해법이 아니다.** Tailwind class 가 세 환경에서 동일하게 동작하면 동일한 렌더 결과가 나온다.
- **Shadow DOM 이 문제였지, Web Component 자체가 문제는 아니다.** Light DOM Web Component 는 Tailwind 와 자연스럽게 호환된다.
- **React 와 HTML/Thymeleaf 는 다른 DX 를 가져야 한다.** React 는 타입·이벤트 등 프레임워크 이점을 살리고, HTML/Thymeleaf 는 short tag(`<ds-input>`) + Tailwind class 병합.

## 목표

1. **React 소비자**: shadcn/ui 관례 그대로 (`<Button>`, `className={cn(...)}`) 사용.
2. **Thymeleaf / HTML 소비자**: `<ds-button>`, `<ds-input class="px-5">` 같은 short tag 로 작성. Tailwind class override 가 실제 내부 요소에 병합되어 적용됨.
3. **세 환경이 동일한 시각 결과** 를 내도록 Tailwind class 를 단일 진실 공급원으로 유지.
4. **토큰 시스템** 은 shadcn 표준 관례에 맞춰 단순화. 3개 브랜드 컬러(primary/secondary/tertiary) 지원.
5. **Storybook** 은 React 중심으로 재구성하되, 각 스토리의 코드 탭에 세 환경 (React / Thymeleaf / HTML) 전부 노출.

## 비목표 (Non-goals)

- **복잡한 상호작용 컴포넌트 (Dialog/Select/Popover/Tooltip 등) 의 Light DOM WC 구현.** a11y·keyboard·focus trap 구현 비용이 높고 HTML/Thymeleaf 서비스별 요구가 상이. React 전용으로 두고 HTML/Thymeleaf 는 native 요소 또는 Alpine.js 사용.
- **Primitive 팔레트 레이어.** shadcn 은 semantic 토큰 1개 값 + Tailwind opacity modifier(`primary/90`) 로 shade 처리. 11 shade primitive 불필요.
- **커스텀 spacing/font-size/z-index/breakpoint 토큰.** Tailwind 기본 스케일로 충분. 현재 tokens.css 의 과도한 `--dx-space-*`, `--dx-font-size-*` 등 제거.
- **Shoelace 와의 호환.** v0.1.0 코드는 `feat/v0.1.0-setup` 브랜치에 보존. v0.2.0 은 완전 재작성.
- **shadcn 공식에 없는 커스텀 컴포넌트 신규 개발.** FormField/HelperText/ErrorMessage 같은 compound wrapper 외에는 shadcn 레시피 그대로 사용.

## 설계 결정 (Design Decisions)

### D1. 패키지 구조: 3 개

**선택:**
- `@dx/styles` — Tailwind v4 theme + semantic 토큰 CSS
- `@dx/ui` — shadcn/ui React 컴포넌트
- `@dx/elements` — Light DOM Web Components (Thymeleaf/HTML 전용)

**이유:** React vs. HTML/Thymeleaf 는 **서로 다른 배포 모델** (npm 모듈 vs. script tag). 물리적으로 분리해야 tree-shaking·로딩·의존성 관리가 각 환경에 맞게 최적화됨.

### D2. React 는 `<ds-*>` 를 쓰지 않는다

**선택:** React 환경에서는 오직 `@dx/ui` import 만 사용. Custom element 를 JSX 에서 쓰지 않음.

**이유:**
- 타입 안전성 — shadcn React 컴포넌트는 full TypeScript type 지원. Custom element 는 JSX.IntrinsicElements 선언이 필요하고 prop typing 이 약함.
- SSR — React 의 SSR/RSC 가 custom element 와 교차할 때 hydration 이슈 가능성. 완전 별개 경로로 두어 회피.
- DX — React 소비자 관점에서 `<Button>` 과 `<ds-button>` 두 가지 중 선택지를 두면 혼동 유발.

### D3. `@dx/elements` = Light DOM Web Components

**선택:** `connectedCallback` 에서 base className 과 사용자 `class` 를 `tailwind-merge` 로 병합 → 내부에 native 요소(`<input>`/`<button>` 등) 를 Light DOM 으로 렌더.

**이유:**
- Shadow DOM 의 Tailwind 한계 (v0.1.0 에서 검증) 를 원천 회피.
- 내부가 native 요소라 form participation, validity API, a11y, keyboard 가 무료.
- `twMerge` 로 React `cn()` 과 동일한 충돌 해결 로직 보장.

### D4. baseClasses 는 `@dx/ui` 와 **단일 문자열 공유**

**선택:** 각 컴포넌트의 Tailwind class 문자열을 `@dx/ui/src/components/*` 에 정의하고, `@dx/elements` 가 이를 import 해 재사용.

**이유:** 두 패키지가 같은 스타일을 내도록 보장. 한쪽만 바꿨을 때 일관성 깨지는 것을 구조적으로 막음.

### D5. 토큰: shadcn 표준 형태 + 3 브랜드

**선택:**
- `:root` + `.dark` 블록에 semantic 토큰만 정의 (primitive 팔레트 없음).
- 접두사 없음 — `--primary`, `--secondary`, `--tertiary` (shadcn 관례 그대로).
- `@theme inline` 으로 Tailwind 유틸에 노출 (`bg-primary`, `text-foreground`).
- 브랜드 3개: `primary` / `secondary` / `tertiary`.

**이유:**
- shadcn 공식 문서/레시피 그대로 적용 가능.
- 11 shade 대신 Tailwind opacity modifier (`primary/90`, `primary/10`) 사용 → 브랜드 변경 시 1개 값만 바꾸면 자동 전파.
- 네임스페이스 충돌은 shadcn 관례상 드물고, `@dx-` 접두사의 이점보다 표준 호환이 크다.

### D6. 복잡한 컴포넌트는 React 전용

**선택:** Dialog, Select, Popover, Tooltip, DropdownMenu, Toast, Tabs 등 Radix UI 의존 컴포넌트는 `@dx/ui` 에서만 제공. `@dx/elements` 에는 포함하지 않음.

**이유:**
- a11y (focus trap, ARIA live, keyboard navigation) 가 복잡해서 Light DOM WC 로 재구현 시 Radix 수준의 품질 보장 어려움.
- HTML/Thymeleaf 환경에서는 Alpine.js, HTMX, 또는 native `<select>` / `<details>` 로 대체하는 편이 현실적.

### D7. Storybook 은 React + 3 탭 코드뷰

**선택:** `@storybook/react-vite` 로 마이그레이션. 스토리는 `@dx/ui` 컴포넌트 React 로 렌더하되, 각 스토리의 `parameters.docs.source.code` 에 React / Thymeleaf / HTML 3 탭 스니펫 수동 작성.

**이유:**
- React 가 단일 진실 공급원.
- 3 탭은 소비자에게 "같은 UI 를 내 환경에서 어떻게 쓰나" 즉각 답을 줌.
- v0.1.0 에서 구축한 4 탭 코드뷰 인프라 재활용 가능.

## 기술 상세 (Technical Details)

### 1. `@dx/styles` — tokens.css 재작성

```css
/* packages/styles/src/tokens.css */
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));

:root {
  /* Surface */
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);

  /* Brand — 3 tiers */
  --primary: oklch(0.546 0.245 262.881);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(1 0 0);
  --tertiary: oklch(0.769 0.188 70.08);
  --tertiary-foreground: oklch(0.129 0.042 264.695);

  /* Neutrals */
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);

  /* Status */
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(1 0 0);
  --success: oklch(0.627 0.194 149.214);
  --success-foreground: oklch(1 0 0);
  --warning: oklch(0.769 0.188 70.08);
  --warning-foreground: oklch(0.129 0.042 264.695);

  /* Borders / inputs / focus */
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.623 0.214 259.815);

  /* Radius / typography */
  --radius: 0.5rem;
  --font-sans: 'Pretendard', system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.129 0.042 264.695);
  --secondary: oklch(0.372 0.044 257.287);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --tertiary: oklch(0.828 0.189 84.429);
  --tertiary-foreground: oklch(0.129 0.042 264.695);
  /* 나머지 다크 오버라이드 동일 패턴 */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-tertiary: var(--tertiary);
  --color-tertiary-foreground: var(--tertiary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

**제거되는 토큰:** `--dx-space-*`, `--dx-font-size-*`, `--dx-font-weight-*`, `--dx-line-height-*`, `--dx-letter-spacing-*`, `--dx-radius-{none,sm,md,lg,xl,2xl,full}` (최소 세트 유지), `--dx-shadow-*`, `--dx-z-*`, `--dx-breakpoint-*`, `--dx-container-*`, `--dx-grid-*`, `--dx-palette-*` 전부.

**이유:** Tailwind 기본 스케일 (`m-4`, `text-lg`, `shadow-md`, `z-50`, `md:`, `max-w-2xl`) 로 충분.

### 2. `@dx/ui` — 기존 유지 + `tertiary` variant 추가

현재 shadcn CLI 로 설치한 Button/Input/Label/Checkbox/Badge 중, **Button & Badge 에 `tertiary` variant 추가** (shadcn 공식에 없음):

```ts
// button.tsx
variants: {
  variant: {
    default: '...',
    destructive: '...',
    outline: '...',
    secondary: '...',
    tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary/90',  // NEW
    ghost: '...',
    link: '...',
  },
  /* ... */
}
```

`FormField` / `HelperText` / `ErrorMessage` 는 기존 작성본 유지 (shadcn 관례를 따른 Compound).

### 3. `@dx/elements` — 신규 패키지

#### 3.1 구조

```
packages/elements/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── src/
│   ├── base-element.ts         공통 upgrade/merge/forward 로직
│   ├── ds-button.ts
│   ├── ds-input.ts
│   ├── ds-label.ts
│   ├── ds-badge.ts
│   ├── ds-helper-text.ts
│   ├── ds-error-message.ts
│   └── index.ts                 customElements.define 집행
└── dist/
    ├── dx-elements.js           IIFE (script 태그용)
    └── dx-elements.mjs          ESM
```

#### 3.2 baseClasses 공유 전략

`@dx/ui` 의 Button/Input/Badge 등에서 사용하는 Tailwind class 문자열을 별도 파일로 추출:

```ts
// packages/ui/src/components/ui/button.styles.ts  (신규)
export const buttonBaseClasses =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

export const buttonVariantClasses = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  tertiary: 'bg-tertiary text-tertiary-foreground hover:bg-tertiary/90',
  destructive: 'bg-destructive text-white hover:bg-destructive/90',
  outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
} as const;

export const buttonSizeClasses = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3',
  lg: 'h-10 px-6',
  icon: 'size-9',
} as const;
```

그리고 `button.tsx` 의 `cva` 호출이 이 상수를 참조하도록 수정. `@dx/elements/ds-button.ts` 도 동일 import.

#### 3.3 `base-element.ts`

##### 3.3.1 Attribute 분류 규칙 (명시적 allow/deny)

소비자가 host 에 쓴 attribute 는 다음 세 부류로 분리 처리:

| 부류 | 동작 | 대상 attribute | 근거 |
|---|---|---|---|
| **Move to inner** (host 에서 제거, inner 에 부착) | 내부 native control 에 필요 | `id`, `name`, `value`, `type`, `placeholder`, `disabled`, `required`, `readonly`, `min`, `max`, `step`, `pattern`, `minlength`, `maxlength`, `autocomplete`, `autofocus`, `inputmode`, `spellcheck`, `form`, `for`, `aria-*`, `role` | `<label for>` 가 inner 의 `id` 를 찾아야 하고, form submit 이 inner 의 `name/value` 를 직렬화해야 함. `aria-*`/`role` 은 focusable control 에 있어야 screen reader 가 정확히 읽음. |
| **Keep on host** | host 에만 유지 | `style`, `data-*`, `tabindex` (host 자체가 focusable 하지 않음) | 인라인 스타일은 레이아웃 투명화(`display:contents`) 와 함께 host 의 부가 hook 으로 유지. `data-*` 는 app 수준 메타 — host 가 DOM 식별자로 남아야 함. |
| **Merge** | 병합 후 inner 에 부착, host 에서 제거 | `class` | `tailwind-merge` 로 baseClasses 와 충돌 해결. |

Event listener (`onclick=""`) 는 host 에 남겨둠: 사용자 JS 가 `document.querySelector('ds-button#save').addEventListener(...)` 로 구독할 때 이벤트가 inner 에서 bubble-up 해 host 에서 잡히므로 기능상 문제 없음.

##### 3.3.2 Reactive attribute 처리 (observedAttributes)

`class` / `variant` / `size` / `disabled` 등이 동적으로 바뀔 수 있으므로 (Alpine.js, HTMX, 사용자 JS) `attributeChangedCallback` 구현 필수. 변경 시 inner 의 해당 attribute 를 갱신하고 `class` 의 경우 재병합.

##### 3.3.3 구현

```ts
import { twMerge } from 'tailwind-merge';

/**
 * host 에서 inner 로 MOVE 할 attribute 목록.
 * Control-level attribute (form participation / a11y) 은 inner 에 있어야 한다.
 */
const MOVE_TO_INNER = new Set([
  'id', 'name', 'value', 'type', 'placeholder',
  'disabled', 'required', 'readonly',
  'min', 'max', 'step', 'pattern', 'minlength', 'maxlength',
  'autocomplete', 'autofocus', 'inputmode', 'spellcheck',
  'form', 'for', 'role',
]);

const isAriaAttr = (name: string) => name.startsWith('aria-');

export abstract class DxElement extends HTMLElement {
  protected inner?: HTMLElement;
  protected abstract getBaseClasses(): string;
  protected abstract renderInternal(): HTMLElement;

  static get observedAttributes() {
    return ['class', 'variant', 'size', 'disabled', 'required', 'value', 'placeholder'];
  }

  connectedCallback() {
    if (this.inner) return; // 이미 upgrade 된 경우(중복 connect) skip

    const inner = this.renderInternal();
    this.inner = inner;

    // 1. class 병합
    const userClass = this.getAttribute('class') ?? '';
    inner.className = twMerge(this.getBaseClasses(), userClass);
    this.removeAttribute('class');

    // 2. control-level attribute 를 inner 로 이동
    for (const name of this.getAttributeNames()) {
      if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
        inner.setAttribute(name, this.getAttribute(name) ?? '');
        this.removeAttribute(name);
      }
    }

    // 3. 텍스트 콘텐츠를 inner 로 이동 (slot 역할)
    while (this.firstChild) {
      inner.appendChild(this.firstChild);
    }

    this.appendChild(inner);
    this.style.display = 'contents';
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (!this.inner) return;
    if (name === 'class') {
      this.inner.className = twMerge(this.getBaseClasses(), value ?? '');
      this.removeAttribute('class');
      return;
    }
    if (name === 'variant' || name === 'size') {
      // 재조립 (baseClasses 가 variant/size 에 의존)
      this.inner.className = twMerge(this.getBaseClasses(), '');
      return;
    }
    // MOVE_TO_INNER 부류는 inner 갱신
    if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
      if (value === null) this.inner.removeAttribute(name);
      else this.inner.setAttribute(name, value);
      this.removeAttribute(name);
    }
  }
}
```

##### 3.3.4 파싱 타이밍 이슈 대응

Custom element upgrade 가 parser 의 children 파싱보다 먼저 발생하면 `this.firstChild` 가 `null`. 두 가지 방어책 병행:

1. **Script 로드 위치 가이드**: `<script type="module" src="...dx-elements.js" defer>` — `defer` 가 document parsing 완료 후 실행을 보장.
2. **DCL 시점 정의**: `@dx/elements/index.ts` 에서 `DOMContentLoaded` 이후에 `customElements.define(...)` 을 실행하여 모든 HTML 이 이미 parsed 된 상태에서 upgrade 되도록 강제.

```ts
// packages/elements/src/index.ts
import { DsButton, DsInput, DsLabel, DsBadge, DsHelperText, DsErrorMessage } from './ds-*';

const register = () => {
  if (!customElements.get('ds-button')) customElements.define('ds-button', DsButton);
  // ... 나머지
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', register, { once: true });
} else {
  register();
}
```

#### 3.4 `ds-button.ts` 예시

```ts
import { DxElement } from './base-element.js';
import {
  buttonBaseClasses,
  buttonVariantClasses,
  buttonSizeClasses,
} from '@dx/ui/components/ui/button.styles';

type Variant = keyof typeof buttonVariantClasses;
type Size = keyof typeof buttonSizeClasses;

class DsButton extends DxElement {
  getBaseClasses() {
    const variant = (this.getAttribute('variant') ?? 'default') as Variant;
    const size = (this.getAttribute('size') ?? 'default') as Size;
    return [
      buttonBaseClasses,
      buttonVariantClasses[variant] ?? buttonVariantClasses.default,
      buttonSizeClasses[size] ?? buttonSizeClasses.default,
    ].join(' ');
  }
  renderInternal(cls: string) {
    const btn = document.createElement('button');
    btn.className = cls;
    return btn;
  }
}

customElements.define('ds-button', DsButton);
```

#### 3.5 번들 (tsup)

- entry: `src/index.ts`
- format: `['iife', 'esm']`
- IIFE 는 `window.DxElements` 글로벌에 노출 (디버깅 편의, 소비자가 직접 쓸 일은 없음).
- tailwind-merge 는 번들에 포함. 예상 bundle size ~35KB gzip.

### 4. Storybook 재구성

- **프레임워크**: `@storybook/web-components-vite` → `@storybook/react-vite` 로 전환.
- **Foundation stories**: MDX 기반 재작성 (토큰 시각화는 프레임워크 무관). v0.1.0 의 Grid/Color/Typography/Spacing 스토리 내용 재활용.
- **Component stories**: `packages/storybook/stories/components/<name>.stories.tsx` — 각 컴포넌트당 1 파일.
- **3 탭 코드뷰**: 각 스토리에 custom `source` 정의. v0.1.0 의 4 탭 인프라(`parameters.docs.source.code`) 재사용.

#### 스토리 구조 예시

```tsx
// stories/components/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@dx/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: '가입' },
  parameters: {
    docs: {
      source: {
        code: {
          react: `<Button>가입</Button>`,
          thymeleaf: `<ds-button th:text="#{form.submit}">가입</ds-button>`,
          html: `<ds-button>가입</ds-button>`,
        },
      },
    },
  },
};
```

### 5. 예제 재작성

- `examples/react-nextjs` — `@dx/ui` 만 사용, 3 섹션 (기본 / 토큰 오버라이드 / Tailwind 오버라이드) 유지.
- `examples/vanilla-html` — `@dx/elements` 스크립트 로드 + `<ds-*>` 태그로 작성.
- `examples/thymeleaf-spring` — 동일 + `th:field` / `th:errors` 주석 예시.

세 예제가 동일한 "가입 폼" 을 렌더하되 각 환경의 관용 사용법으로 작성됨.

### 6. 문서 동기화 (CLAUDE.md / README.md / docs/architecture.md)

- `CLAUDE.md` — "Shoelace 래핑" 관련 규칙 제거. "shadcn 기반 + Light DOM WC" 원칙으로 재작성. 패키지 구조 (`@dx/styles`, `@dx/ui`, `@dx/elements`) 갱신.
- `README.md` — 소비자 가이드 전면 재작성. 3 섹션(React/Thymeleaf/HTML) 각각 shadcn 관례·`@dx/elements` 사용법으로 교체.
- `docs/architecture.md` — 새 아키텍처 기록. v0.1.0 Shoelace 전환 시도와 그 결정 이유는 "history" 섹션으로 요약 보존.
- `docs/contributing.md` — 새 컴포넌트 추가 절차 (shadcn CLI → tertiary variant 추가 → elements 래퍼 → 스토리) 업데이트.

## 성공 기준

- [ ] `packages/elements` 신규 생성, 6 atoms + base-element (MOVE_TO_INNER allow-list, observedAttributes, DOMContentLoaded 지연 등록 포함) 구현
- [ ] `@dx/ui` Button / Badge 에 `tertiary` variant 추가
- [ ] `@dx/ui` 의 baseClasses 를 별도 파일(`*.styles.ts`) 로 추출하고 sub-path export
- [ ] `@dx/elements` 가 `@dx/ui/styles/*` sub-path 로 baseClasses import 성공
- [ ] `@dx/styles/src/tokens.css` shadcn 형태로 재작성 (primitive 팔레트 제거, 3브랜드 semantic)
- [ ] `@dx/styles` 가 `dist/styles.css` (슬림) 와 `dist/styles-utilities.css` (safelist 기반 fat) 두 개 배포
- [ ] `pnpm --filter @dx/styles build` + `@dx/ui build` + `@dx/elements build` 성공
- [ ] `@dx/elements` 번들 크기 < 50KB gzip (tailwind-merge 포함)
- [ ] **Thymeleaf 프로토타입 검증**: Spring Boot 최소 세팅에서 `<ds-input th:field="*{email}">` 가 form submit 시 `email` 필드로 정상 전송되는지 확인 (구현 첫 Task)
- [ ] `examples/react-nextjs` 빌드 성공, primary/secondary/tertiary 버튼 3개 모두 정상 렌더 + 다크모드 토글 동작
- [ ] `examples/vanilla-html/index.html` 브라우저에서 열어 `<ds-input class="px-5">` 의 실제 `<input>` 이 padding-5 적용된 것을 DevTools 로 확인
- [ ] `examples/thymeleaf-spring/` 템플릿이 위 프로토타입 검증 결과에 맞춰 `th:field` 또는 `th:attr` 로 작성됨
- [ ] Storybook 빌드 성공, 각 컴포넌트 스토리에 React/Thymeleaf/HTML 3 탭 코드 표시 (custom source transformer v0.1.0 재이식)
- [ ] axe 스캔 violations 0 (Foundation + 모든 atom 스토리 + FormField compound 스토리)
- [ ] CLAUDE.md / README / architecture / contributing 4 문서 재작성 완료
- [ ] 각 `examples/*/README.md` 에 "Tailwind class override 가 동작하는 조건" 안내표 포함

## Tailwind class override 가 동작하는 조건 (중요)

`<ds-input class="px-5">` 의 `px-5` 는 "Tailwind 가 생성한 CSS 유틸 class" 이다. 해당 class 의 CSS 정의가 소비자 페이지에 로드되어 있어야 실제 스타일이 적용됨. 런타임 `twMerge` 는 class **문자열 병합** 만 하고 CSS 를 만들어내지는 않는다.

### 7.1 소비자 환경별 요구사항

#### React (Next.js) — Tailwind 빌드 있음
사용자 프로젝트에 Tailwind 가 이미 설정되어 있음 (`@dx/styles` 와 `@tailwindcss/postcss` 로드). `globals.css` 에 소비자 마크업을 스캔하도록 `@source` 디렉티브 추가만 필요:

```css
@import '@dx/styles/theme';
@source "./**/*.{tsx,ts,jsx,js}";
```

React 환경은 `<ds-*>` 를 쓰지 않으므로 HTML override 고민 자체가 불필요 (shadcn React 컴포넌트는 Light DOM 네이티브 → class 자동 반영).

#### Thymeleaf / HTML — 두 가지 경로

**경로 A (권장): 소비자 프로젝트에 Tailwind 빌드 구성**

```js
// tailwind.config.js (Spring Boot 프로젝트 내)
export default {
  content: ['./src/main/resources/templates/**/*.html'],
};
```

빌드 산출물 `tailwind.css` 를 `static/css/` 에 놓고 layout 에서 로드. 이 때 `@dx/styles` 의 토큰 CSS 도 `@import '@dx/styles'` 로 포함. 자기 템플릿의 `px-5`, `bg-primary/90` 같은 class 가 JIT 로 컴파일되어 CSS 에 포함됨.

**경로 B (Tailwind 빌드 없는 서비스용): `@dx/styles` 의 "fat" utility 번들 로드**

`@dx/styles` 가 두 개의 CSS 를 배포:

- `dist/styles.css` — 슬림 (토큰 + `@dx/ui` / `@dx/elements` 에서 실제 사용한 class 만)
- `dist/styles-utilities.css` — **넓은 유틸리티 세트** (모든 spacing/color/layout/typography Tailwind 유틸을 safelist 로 강제 생성)

경로 B 를 택한 서비스는 `<link rel="stylesheet" href=".../styles-utilities.css">` 하나만 로드하면 `class="px-5 mt-4 bg-primary/90"` 같은 임의 class 가 그대로 동작. 대가는 CSS 크기 증가 (예상 100~200KB gzip). 이 번들은 자주 쓰이는 유틸만 safelist 해 크기를 관리 (`px-0` ~ `px-96`, 모든 `bg-*/{opacity}` 등).

#### 3가지 경로 요약

| 환경 | CSS 로드 방법 | 자유도 |
|---|---|---|
| React | 프로젝트 Tailwind + `@source` | 무제한 |
| Thymeleaf (빌드 O) | 프로젝트 Tailwind + content glob | 무제한 |
| Thymeleaf (빌드 X) | `@dx/styles/dist/styles-utilities.css` | safelist 범위 |
| HTML | 동일 | 동일 |

### 7.2 문서 의무

각 `examples/*/README.md` 와 루트 `README.md` 에 위 "3가지 경로 요약표" 를 포함해 소비자가 오해하지 않도록 **필수 안내**.

## 리스크 및 미결 이슈

- **`th:field` 호환성 사전 검증 필요**: Thymeleaf 의 `th:field` 프로세서는 태그 이름을 보고 `<input>`/`<select>`/`<textarea>` 전략을 선택. `<ds-input>` 은 알려진 form tag 가 아니므로 `id`/`name`/`value` attribute 를 host 에 부착만 하고 종료할 가능성 큼. 구현 단계 첫 Task 에서 프로토타입으로 검증:
  1. 최소한의 Spring Boot + Thymeleaf 세팅으로 `<ds-input th:field="*{email}">` 렌더 결과 확인
  2. 정상 동작 시 (host 에 `id/name/value` 가 부착되면 우리 forwarding 이 처리) 그대로 진행
  3. 예상 밖 동작(에러·누락) 시 `th:attr="id=${...}, name=${...}, value=*{email}"` 워크어라운드를 공식 가이드로 전환.
- **`baseClasses` 파일 sub-path export 전략**: `@dx/ui/components/ui/button.styles` 를 양쪽 패키지(`@dx/ui`, `@dx/elements`) 가 import 해야 함. 다음 설정으로 고정:
  - `packages/ui/package.json` `exports` 에 `"./styles/*": { "types": "./src/components/ui/*.styles.ts", "import": "./dist/styles/*.js" }` 추가.
  - tsup 이 각 `*.styles.ts` 를 별 entry 로 빌드.
  - `@dx/elements` 가 `import { buttonBaseClasses } from '@dx/ui/styles/button'` 형태로 import.
- **Tailwind `styles-utilities.css` 크기 관리**: safelist 범위를 "자주 쓸 class" 로 제한 해야 함. 후보: `px-{0..8}`, `py-{0..8}`, `m*-{0..8}`, `w-{auto,full,fit,1/2,...}`, `grid-cols-{1..12}`, `gap-{0..8}`, 모든 `bg-{primary,secondary,...}/{10,20,...,90}`, 모든 `text-{primary,secondary,...}`, `rounded-{none,sm,md,lg,full}`, responsive prefix `{sm,md,lg}:`. 최종 리스트는 plan 단계에서 확정.
- **tailwind-merge 런타임 비용**: `@dx/elements` 번들에 tailwind-merge 포함 시 ~35KB gzip 증가. 페이지 로드에 영향 가능. 측정 후 필요 시 tree-shakeable subset 검토.
- **Storybook `source.code` 3탭 transformer**: v0.1.0 에서 구축한 custom transformer 가 `@storybook/react-vite` 에서도 동일하게 동작하는지 확인 필요. 첫 Task 에서 재이식.
- **Storybook Foundation 스토리 MDX 재작성 비용**: Grid/Color/Typography/Spacing 스토리는 web-components 의 Lit `html` 기반. MDX + 순수 React 컴포넌트로 재작성 — Grid visualization 등 복잡한 시각화는 MDX `<Canvas>` 에 React 컴포넌트를 임베드하는 방식으로 이식.
- **HTML/Thymeleaf 번들 배포 경로**: 사내 CDN 이 없는 경우 `@dx/elements` 결과물을 각 Spring 프로젝트 `static/js/` 에 수동 복사해야 함. 자동화 스크립트(`scripts/publish-to-services.sh`) 작성 여부는 plan 단계 결정.
