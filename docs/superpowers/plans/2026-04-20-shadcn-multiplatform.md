# shadcn 기반 멀티 플랫폼 DS 구현 플랜 (v0.2.0)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** shadcn/ui 기반 React 컴포넌트(`@dx/ui`) + Light DOM Web Components(`@dx/elements`) + Tailwind v4 semantic 토큰(`@dx/styles`) 으로 멀티 플랫폼(React/Thymeleaf/HTML) 지원 DS 를 완성한다.

**Architecture:** 3 패키지 구조. `@dx/styles` 가 shadcn 표준 토큰 CSS + Tailwind theme 제공 (3 브랜드 primary/secondary/tertiary). `@dx/ui` 가 shadcn React 컴포넌트 + baseClasses 를 `*.styles.ts` 로 sub-path export. `@dx/elements` 가 baseClasses 를 import 해 Light DOM WC 로 래핑 — `<ds-input class="px-5">` 이 `tailwind-merge` 로 내부 `<input>` 에 병합. `ds-dialog` 는 native `<dialog>` + Alpine.js 통합 프로토타입.

**Tech Stack:** Tailwind v4, shadcn/ui (Radix UI), tsup(번들러), tailwind-merge, class-variance-authority, React 19, Next.js 16, Alpine.js(소비자 측), Thymeleaf(Spring Boot), Storybook 8 React-vite.

**References:**
- 스펙: `docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md`
- v0.1.0 분기: `feat/v0.1.0-setup` (Shoelace 시도, 참고용)

---

## File Structure

### 신규 생성 (`packages/elements/`)

- `package.json`, `tsconfig.json`, `tsup.config.ts`
- `src/base-element.ts` — `MOVE_TO_INNER` allow-list, `observedAttributes`, `attributeChangedCallback`, `DOMContentLoaded` 지연 등록 유틸
- `src/ds-button.ts`, `src/ds-input.ts`, `src/ds-label.ts`, `src/ds-badge.ts`, `src/ds-helper-text.ts`, `src/ds-error-message.ts`
- `src/ds-dialog.ts` — Alpine.js 통합 프로토타입
- `src/index.ts` — 등록 집행

### 수정 (`packages/ui/`)

- `src/components/ui/button.styles.ts` (신규) — baseClasses + variant/size 맵
- `src/components/ui/badge.styles.ts` (신규)
- `src/components/ui/input.styles.ts` (신규)
- `src/components/ui/label.styles.ts` (신규)
- `src/components/ui/form-field.styles.ts` (신규)
- `src/components/ui/button.tsx`, `badge.tsx` 등 — `*.styles.ts` import 로 리팩토링 + `tertiary` variant 추가
- `package.json` — `exports` 에 `./styles/*` sub-path 추가, tsup 엔트리 확장

### 수정 (`packages/styles/`)

- `src/tokens.css` — shadcn 표준 형태로 재작성 (primitive 제거, 3브랜드 semantic)
- `src/themes/default.css` — `@theme inline` 유지, spacing/font-size 토큰 노출 제거
- `postcss.config.cjs` — 두 번째 entry `styles-utilities.css` 용 safelist 설정
- `package.json` — `exports` 에 `./utilities` 추가, build script 확장

### 수정 (`packages/storybook/`)

- `.storybook/main.ts` — `@storybook/web-components-vite` → `@storybook/react-vite`
- `stories/foundation/*.stories.ts` → `stories/foundation/*.mdx` (or `.stories.tsx`) 로 재작성
- `stories/components/<name>.stories.tsx` (신규) — Button/Input/Label/Checkbox/Badge/FormField/Dialog
- 3탭 코드뷰 custom source transformer (v0.1.0 에서 이식)

### 수정 (`examples/`)

- `react-nextjs/app/page.tsx` — tertiary 버튼 포함, 3섹션 유지
- `vanilla-html/index.html` — `<script src=".../dx-elements.js">` 로드, `<ds-*>` 태그 사용, Alpine.js dialog 예시 포함
- `thymeleaf-spring/templates/signup.html` — `<ds-input th:field="*{email}">` 사용 (프로토타입 검증 결과에 따라 조정)
- 각 `README.md` — "Tailwind override 3 경로" 안내표 포함

### 수정 (문서)

- `CLAUDE.md`, `README.md`, `docs/architecture.md`, `docs/contributing.md` — v0.2.0 아키텍처로 전면 재작성

---

## Task 1: Thymeleaf `th:field` 호환성 사전 검증

**목적:** `<ds-input th:field="*{email}">` 가 form submit 에 정상 포함되는지 프로토타입으로 확인. 이 결과가 이후 Thymeleaf 예제 템플릿 형태를 좌우.

**Files:**
- Temporary: `/tmp/dx-thymeleaf-probe/` — 최소 Spring Boot 프로젝트 OR `examples/thymeleaf-spring/` 기존 디렉터리 활용

- [ ] **Step 1: 검증 셋업 결정**

Spring Boot 실행 환경 유무를 확인:
```bash
which java && java -version 2>&1 | head -1
```

Java 17+ 가 없으면 **대안**: Thymeleaf Online Playground (`https://www.thymeleaf.org/doc/articles/springmvcaccessdata.html`) 또는 Node 에서 `thymeleaf` npm 패키지 사용. 어느 쪽이든 `<ds-input th:field="*{email}">` 렌더 결과 HTML 을 확보.

- [ ] **Step 2: 프로토타입 HTML 작성**

```html
<!-- /tmp/dx-thymeleaf-probe/signup.html -->
<form th:action="@{/signup}" th:object="${form}" method="post">
  <ds-input th:field="*{email}" type="email" />
  <ds-input th:field="*{password}" type="password" />
  <button type="submit">가입</button>
</form>
```

- [ ] **Step 3: 서버 렌더 결과 확인**

Thymeleaf 가 `<ds-input th:field="*{email}">` 를 어떻게 확장하는지 문서화:
- 기대: `<ds-input id="email" name="email" value="" type="email">` (host 에 attribute 부착)
- 가능성 1: 정상 동작 → `@dx/elements` forwarding 이 inner `<input>` 으로 이동 → form submit 시 `email` 값 전송. ✅
- 가능성 2: `th:field` 가 "알려진 form tag 가 아님" 에러 → `th:attr` 워크어라운드 필요.
- 가능성 3: 속성만 부착되고 value 는 Model 에서 못 읽음 → partial.

- [ ] **Step 4: 결과를 스펙 리스크에 기록**

`docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md` 의 "리스크 및 미결 이슈" 섹션에 프로토타입 결과 append:

```markdown
### th:field 프로토타입 검증 결과 (2026-04-XX)

- 환경: Spring Boot 3.x + Thymeleaf 3.x
- 테스트: `<ds-input th:field="*{email}">` + Model `form.email = "test@example.com"`
- 렌더 결과: (실제 확인한 HTML 붙여넣기)
- 결론: (A) th:field 직접 사용 OK / (B) th:attr 워크어라운드 필수
```

- [ ] **Step 5: 커밋**

```bash
git add docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md
# 프로토타입 자체는 일회성이므로 커밋 제외
git commit -m "docs(spec): Thymeleaf th:field 프로토타입 검증 결과 기록"
```

---

## Task 2: `@dx/styles` — tokens.css 재작성 (shadcn 표준)

**Files:**
- Modify: `packages/styles/src/tokens.css`
- Modify: `packages/styles/src/themes/default.css`

- [ ] **Step 1: tokens.css 전면 재작성**

기존 파일을 다음으로 대체:

```css
/* packages/styles/src/tokens.css */
/**
 * DX Design System v0.2.0 — shadcn 표준 토큰.
 * Primitive 팔레트 없음. Tailwind 기본 팔레트 + opacity modifier (primary/90) 로 shade 처리.
 * 브랜드 3개: primary / secondary / tertiary.
 */

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
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);

  --primary: oklch(0.623 0.214 259.815);
  --primary-foreground: oklch(0.129 0.042 264.695);
  --secondary: oklch(0.372 0.044 257.287);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --tertiary: oklch(0.828 0.189 84.429);
  --tertiary-foreground: oklch(0.129 0.042 264.695);

  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);

  --destructive: oklch(0.637 0.237 25.331);
  --destructive-foreground: oklch(0.984 0.003 247.858);
  --success: oklch(0.723 0.219 149.579);
  --success-foreground: oklch(0.129 0.042 264.695);
  --warning: oklch(0.828 0.189 84.429);
  --warning-foreground: oklch(0.129 0.042 264.695);

  --border: oklch(0.279 0.041 260.031);
  --input: oklch(0.279 0.041 260.031);
  --ring: oklch(0.623 0.214 259.815);
}
```

- [ ] **Step 2: default.css 재작성**

```css
/* packages/styles/src/themes/default.css */
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
@import '../tokens.css';

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
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

- [ ] **Step 3: 빌드 및 검증**

```bash
pnpm --filter @dx/styles build
grep -c "^  --color-" packages/styles/dist/styles.css
```

Expected: `--color-*` 변수가 21개 이상 포함 (@theme inline 결과).

```bash
grep "color-tertiary\|color-primary" packages/styles/dist/styles.css | head
```

Expected: `--color-tertiary: var(--tertiary);` 등이 출력.

- [ ] **Step 4: 커밋**

```bash
git add packages/styles/src/tokens.css packages/styles/src/themes/default.css
git commit -m "feat(styles): shadcn 표준 토큰 형태로 재작성 (3 브랜드 + @theme inline)"
```

---

## Task 3: `@dx/styles` — styles-utilities.css fat 번들

**목적:** Tailwind 빌드 없는 Thymeleaf/HTML 소비자가 `<ds-input class="px-5">` 같은 임의 utility 를 쓸 수 있도록 safelist 기반 넓은 utility CSS 배포.

**Files:**
- Create: `packages/styles/src/themes/utilities.css`
- Modify: `packages/styles/package.json`

- [ ] **Step 1: utilities.css 생성**

```css
/* packages/styles/src/themes/utilities.css */
@import 'tailwindcss';
@custom-variant dark (&:where(.dark, .dark *));
@import '../tokens.css';

/* Safelist: 자주 쓰는 utility 를 강제 생성 */
@source inline "{px,py,pt,pb,pl,pr,m,mt,mb,ml,mr,mx,my}-{0,0.5,1,1.5,2,2.5,3,4,5,6,7,8,10,12,14,16,20,24}";
@source inline "{w,h,min-w,max-w}-{auto,full,fit,screen,0,1,2,4,6,8,10,12,16,20,24,32,40,48,56,64,72,80,96}";
@source inline "{w,max-w}-{1/2,1/3,2/3,1/4,3/4,1/5,2/5,3/5,4/5}";
@source inline "grid-cols-{1,2,3,4,5,6,7,8,9,10,11,12}";
@source inline "col-span-{1,2,3,4,5,6,7,8,9,10,11,12}";
@source inline "gap-{0,0.5,1,1.5,2,2.5,3,4,5,6,7,8,10,12,14,16}";
@source inline "rounded{,-{none,sm,md,lg,xl,2xl,3xl,full}}";
@source inline "border{,-{0,2,4,8}}";
@source inline "shadow{,-{none,xs,sm,md,lg,xl,2xl,inner}}";
@source inline "text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl}";
@source inline "font-{thin,light,normal,medium,semibold,bold,extrabold}";
@source inline "leading-{none,tight,snug,normal,relaxed,loose,3,4,5,6,7,8,9,10}";
@source inline "{bg,text,border,ring}-{primary,secondary,tertiary,destructive,success,warning,muted,accent,background,foreground,border,input,ring}";
@source inline "{bg,text,border}-{primary,secondary,tertiary,destructive,success,warning,muted,accent}-foreground";
@source inline "{bg,text,border}-{primary,secondary,tertiary,destructive,success,warning}/{10,20,30,40,50,60,70,80,90}";
@source inline "{flex,inline-flex,grid,inline-grid,block,inline-block,inline,hidden,contents}";
@source inline "flex-{row,col,row-reverse,col-reverse,wrap,nowrap,1,auto,initial,none}";
@source inline "items-{start,end,center,baseline,stretch}";
@source inline "justify-{start,end,center,between,around,evenly}";
@source inline "{sm,md,lg,xl}:{w,h,grid-cols,flex,hidden,block,inline-flex,gap,px,py,m,mt,text,items,justify}-*";

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
  --color-warning: var(--warning);
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

- [ ] **Step 2: package.json 업데이트**

```json
{
  "scripts": {
    "build": "postcss src/themes/default.css -o dist/styles.css && postcss src/themes/utilities.css -o dist/styles-utilities.css",
    "dev": "postcss src/themes/default.css -o dist/styles.css --watch"
  },
  "exports": {
    ".": "./dist/styles.css",
    "./utilities": "./dist/styles-utilities.css",
    "./tokens": "./src/tokens.css",
    "./theme": "./src/themes/default.css"
  }
}
```

- [ ] **Step 3: 빌드 및 크기 검증**

```bash
pnpm --filter @dx/styles build
du -h packages/styles/dist/*.css
```

Expected: `styles.css` 수십 KB, `styles-utilities.css` 100~300KB 범위.

```bash
gzip -c packages/styles/dist/styles-utilities.css | wc -c
```

Expected gzip: 30~60KB.

생성 CSS 에 `px-5` 가 포함됐는지:
```bash
grep -c "^\.px-5" packages/styles/dist/styles-utilities.css
```

Expected: 1 이상.

- [ ] **Step 4: 커밋**

```bash
git add packages/styles/src/themes/utilities.css packages/styles/package.json
git commit -m "feat(styles): styles-utilities.css 추가 — Tailwind 빌드 없는 환경용 safelist 번들"
```

---

## Task 4: `@dx/ui` — baseClasses 를 `*.styles.ts` 로 추출

**목적:** `@dx/elements` 가 동일 class 문자열을 import 할 수 있도록 각 컴포넌트의 Tailwind class 를 별도 파일로 이동.

**Files:**
- Create: `packages/ui/src/components/ui/button.styles.ts`, `badge.styles.ts`, `input.styles.ts`, `label.styles.ts`, `form-field.styles.ts`
- Modify: `packages/ui/src/components/ui/button.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`, `form-field.tsx`
- Modify: `packages/ui/package.json`

- [ ] **Step 1: button.styles.ts 작성 (+ tertiary variant)**

```ts
// packages/ui/src/components/ui/button.styles.ts
export const buttonBaseClasses =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

export const buttonVariantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  tertiary: "bg-tertiary text-tertiary-foreground hover:bg-tertiary/90",
  destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
  outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
} as const;

export const buttonSizeClasses = {
  default: "h-9 px-4 py-2 has-[>svg]:px-3",
  xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5",
  sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
  lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
  icon: "size-9",
} as const;

export type ButtonVariant = keyof typeof buttonVariantClasses;
export type ButtonSize = keyof typeof buttonSizeClasses;
```

- [ ] **Step 2: button.tsx 를 styles 참조로 리팩토링**

```tsx
// packages/ui/src/components/ui/button.tsx
import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  buttonBaseClasses,
  buttonVariantClasses,
  buttonSizeClasses,
} from "./button.styles";

const buttonVariants = cva(buttonBaseClasses, {
  variants: {
    variant: buttonVariantClasses,
    size: buttonSizeClasses,
  },
  defaultVariants: { variant: "default", size: "default" },
});

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

- [ ] **Step 3: badge.styles.ts + badge.tsx 동일 패턴으로 작성 (+ tertiary)**

```ts
// packages/ui/src/components/ui/badge.styles.ts
export const badgeBaseClasses =
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden";

export const badgeVariantClasses = {
  default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
  secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
  tertiary: "border-transparent bg-tertiary text-tertiary-foreground [a&]:hover:bg-tertiary/90",
  destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20",
  outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
} as const;

export type BadgeVariant = keyof typeof badgeVariantClasses;
```

`badge.tsx` 도 `input.tsx`, `label.tsx`, `form-field.tsx` 와 동일하게 `*.styles.ts` 를 import.

- [ ] **Step 4: input.styles.ts / label.styles.ts / form-field.styles.ts**

```ts
// input.styles.ts
export const inputBaseClasses =
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive";
```

```ts
// label.styles.ts
export const labelBaseClasses =
  "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";
```

```ts
// form-field.styles.ts
export const formFieldVerticalClasses = "flex flex-col gap-2";
export const formFieldHorizontalClasses = "flex flex-row items-center gap-2";
export const helperTextClasses = "text-xs text-muted-foreground";
export const errorMessageClasses = "text-xs font-medium text-destructive";
```

각 `.tsx` 파일이 이 상수를 import 하도록 수정 (현재 tsx 안에 하드코딩된 문자열을 교체).

- [ ] **Step 5: package.json `exports` + tsup 업데이트**

`packages/ui/package.json`:

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles/button": { "types": "./dist/styles/button.d.ts", "import": "./dist/styles/button.js" },
    "./styles/badge": { "types": "./dist/styles/badge.d.ts", "import": "./dist/styles/badge.js" },
    "./styles/input": { "types": "./dist/styles/input.d.ts", "import": "./dist/styles/input.js" },
    "./styles/label": { "types": "./dist/styles/label.d.ts", "import": "./dist/styles/label.js" },
    "./styles/form-field": { "types": "./dist/styles/form-field.d.ts", "import": "./dist/styles/form-field.js" }
  },
  "scripts": {
    "build": "tsup src/index.ts src/components/ui/button.styles.ts src/components/ui/badge.styles.ts src/components/ui/input.styles.ts src/components/ui/label.styles.ts src/components/ui/form-field.styles.ts --format esm --dts --clean --out-dir dist --entry.index src/index.ts"
  }
}
```

실제로는 tsup 설정 파일을 두는 편이 깔끔:

```ts
// packages/ui/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'styles/button': 'src/components/ui/button.styles.ts',
    'styles/badge': 'src/components/ui/badge.styles.ts',
    'styles/input': 'src/components/ui/input.styles.ts',
    'styles/label': 'src/components/ui/label.styles.ts',
    'styles/form-field': 'src/components/ui/form-field.styles.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
});
```

package.json `scripts.build` 를 `tsup` 으로 단순화.

- [ ] **Step 6: 빌드 및 검증**

```bash
pnpm --filter @dx/ui build
ls packages/ui/dist/styles/
```

Expected: `button.js`, `button.d.ts`, `badge.js`, ... 각 styles 파일이 emit.

```bash
node -e "import('@dx/ui/styles/button').then(m => console.log(Object.keys(m)))"
```

Expected: `['buttonBaseClasses', 'buttonVariantClasses', 'buttonSizeClasses']`.

React 예제도 빌드되는지 확인:
```bash
pnpm --filter @dx-examples/react-nextjs build
```

Expected: 성공 (tertiary variant 는 아직 사용 안 해도 OK).

- [ ] **Step 7: 커밋**

```bash
git add packages/ui/
git commit -m "refactor(ui): baseClasses 를 *.styles.ts 로 추출 + tertiary variant 추가"
```

---

## Task 5: `@dx/elements` — base-element + 6 atoms

**Files:**
- Create: `packages/elements/package.json`, `tsconfig.json`, `tsup.config.ts`
- Create: `packages/elements/src/base-element.ts`, `ds-button.ts`, `ds-input.ts`, `ds-label.ts`, `ds-badge.ts`, `ds-helper-text.ts`, `ds-error-message.ts`, `index.ts`

- [ ] **Step 1: 패키지 스캐폴딩**

```json
// packages/elements/package.json
{
  "name": "@dx/elements",
  "version": "0.2.0",
  "description": "DX Design System — Light DOM Web Components for HTML/Thymeleaf",
  "type": "module",
  "main": "dist/dx-elements.mjs",
  "module": "dist/dx-elements.mjs",
  "types": "dist/dx-elements.d.ts",
  "exports": {
    ".": {
      "types": "./dist/dx-elements.d.ts",
      "import": "./dist/dx-elements.mjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "dependencies": {
    "@dx/ui": "workspace:*",
    "tailwind-merge": "^3"
  },
  "devDependencies": {
    "tsup": "^8",
    "typescript": "^5"
  }
}
```

```json
// packages/elements/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

```ts
// packages/elements/tsup.config.ts
import { defineConfig } from 'tsup';
export default defineConfig({
  entry: { 'dx-elements': 'src/index.ts' },
  format: ['iife', 'esm'],
  globalName: 'DxElements',
  dts: true,
  clean: true,
  minify: true,
  outDir: 'dist',
});
```

- [ ] **Step 2: base-element.ts 작성**

```ts
// packages/elements/src/base-element.ts
import { twMerge } from 'tailwind-merge';

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

  static get observedAttributes(): string[] {
    return ['class', 'variant', 'size', 'disabled', 'required', 'value', 'placeholder'];
  }

  connectedCallback(): void {
    if (this.inner) return;
    const inner = this.renderInternal();
    this.inner = inner;

    const userClass = this.getAttribute('class') ?? '';
    inner.className = twMerge(this.getBaseClasses(), userClass);
    this.removeAttribute('class');

    for (const name of this.getAttributeNames()) {
      if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
        inner.setAttribute(name, this.getAttribute(name) ?? '');
        this.removeAttribute(name);
      }
    }

    while (this.firstChild) {
      inner.appendChild(this.firstChild);
    }

    this.appendChild(inner);
    this.style.display = 'contents';
  }

  attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null,
  ): void {
    if (!this.inner) return;
    if (name === 'class') {
      this.inner.className = twMerge(this.getBaseClasses(), value ?? '');
      this.removeAttribute('class');
      return;
    }
    if (name === 'variant' || name === 'size') {
      this.inner.className = twMerge(this.getBaseClasses(), '');
      return;
    }
    if (MOVE_TO_INNER.has(name) || isAriaAttr(name)) {
      if (value === null) this.inner.removeAttribute(name);
      else this.inner.setAttribute(name, value);
      this.removeAttribute(name);
    }
  }
}
```

- [ ] **Step 3: ds-button.ts**

```ts
// packages/elements/src/ds-button.ts
import { DxElement } from './base-element.js';
import {
  buttonBaseClasses,
  buttonVariantClasses,
  buttonSizeClasses,
  type ButtonVariant,
  type ButtonSize,
} from '@dx/ui/styles/button';

export class DsButton extends DxElement {
  protected getBaseClasses(): string {
    const variant = (this.getAttribute('variant') ?? 'default') as ButtonVariant;
    const size = (this.getAttribute('size') ?? 'default') as ButtonSize;
    return [
      buttonBaseClasses,
      buttonVariantClasses[variant] ?? buttonVariantClasses.default,
      buttonSizeClasses[size] ?? buttonSizeClasses.default,
    ].join(' ');
  }

  protected renderInternal(): HTMLElement {
    return document.createElement('button');
  }
}
```

- [ ] **Step 4: ds-input / ds-label / ds-badge / ds-helper-text / ds-error-message**

```ts
// ds-input.ts
import { DxElement } from './base-element.js';
import { inputBaseClasses } from '@dx/ui/styles/input';

export class DsInput extends DxElement {
  protected getBaseClasses() { return inputBaseClasses; }
  protected renderInternal() { return document.createElement('input'); }
}
```

```ts
// ds-label.ts
import { DxElement } from './base-element.js';
import { labelBaseClasses } from '@dx/ui/styles/label';

export class DsLabel extends DxElement {
  protected getBaseClasses() { return labelBaseClasses; }
  protected renderInternal() { return document.createElement('label'); }
}
```

```ts
// ds-badge.ts
import { DxElement } from './base-element.js';
import {
  badgeBaseClasses, badgeVariantClasses, type BadgeVariant,
} from '@dx/ui/styles/badge';

export class DsBadge extends DxElement {
  protected getBaseClasses() {
    const variant = (this.getAttribute('variant') ?? 'default') as BadgeVariant;
    return `${badgeBaseClasses} ${badgeVariantClasses[variant] ?? badgeVariantClasses.default}`;
  }
  protected renderInternal() { return document.createElement('span'); }
}
```

```ts
// ds-helper-text.ts
import { DxElement } from './base-element.js';
import { helperTextClasses } from '@dx/ui/styles/form-field';

export class DsHelperText extends DxElement {
  protected getBaseClasses() { return helperTextClasses; }
  protected renderInternal() { return document.createElement('p'); }
}
```

```ts
// ds-error-message.ts
import { DxElement } from './base-element.js';
import { errorMessageClasses } from '@dx/ui/styles/form-field';

export class DsErrorMessage extends DxElement {
  protected getBaseClasses() { return errorMessageClasses; }
  protected renderInternal() {
    const p = document.createElement('p');
    p.setAttribute('role', 'alert');
    return p;
  }
}
```

- [ ] **Step 5: index.ts — DOMContentLoaded 지연 등록**

```ts
// packages/elements/src/index.ts
import { DsButton } from './ds-button.js';
import { DsInput } from './ds-input.js';
import { DsLabel } from './ds-label.js';
import { DsBadge } from './ds-badge.js';
import { DsHelperText } from './ds-helper-text.js';
import { DsErrorMessage } from './ds-error-message.js';

const define = (name: string, ctor: CustomElementConstructor) => {
  if (!customElements.get(name)) customElements.define(name, ctor);
};

const register = () => {
  define('ds-button', DsButton);
  define('ds-input', DsInput);
  define('ds-label', DsLabel);
  define('ds-badge', DsBadge);
  define('ds-helper-text', DsHelperText);
  define('ds-error-message', DsErrorMessage);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', register, { once: true });
} else {
  register();
}

export { DsButton, DsInput, DsLabel, DsBadge, DsHelperText, DsErrorMessage };
```

- [ ] **Step 6: pnpm-workspace.yaml 업데이트 + install + build**

```bash
# pnpm-workspace.yaml 에 이미 packages/* 가 있으면 자동 인식
pnpm install
pnpm --filter @dx/elements build
```

Expected: `dx-elements.global.js` (IIFE) + `dx-elements.mjs` (ESM) + `.d.ts` emit.

```bash
du -h packages/elements/dist/*.js
```

Expected: 각 30~50KB (minified, tailwind-merge 포함).

- [ ] **Step 7: 스모크 테스트 HTML**

```html
<!-- packages/elements/test-smoke.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../styles/dist/styles-utilities.css">
  <script type="module" src="./dist/dx-elements.mjs"></script>
</head>
<body>
  <ds-button>기본</ds-button>
  <ds-button variant="secondary" class="w-full mt-4">secondary + class override</ds-button>
  <ds-input type="email" class="px-8" placeholder="큰 padding"/>
</body>
</html>
```

브라우저에서 파일을 열어(또는 `npx http-server packages/elements -p 5174 -o test-smoke.html`) DevTools 로 확인:
- `<ds-button>` 하위에 `<button class="...">` 가 렌더됨
- class 에 `w-full mt-4` + baseClasses 병합 확인
- `<ds-input>` 의 실제 `<input>` 에 `px-8` 적용 확인

- [ ] **Step 8: 커밋**

```bash
git add packages/elements/
git commit -m "feat(elements): Light DOM Web Components 6개 atoms + base-element"
```

---

## Task 6: `@dx/elements` — `ds-dialog` 프로토타입 (Alpine.js)

**Files:**
- Create: `packages/elements/src/ds-dialog.ts`
- Modify: `packages/elements/src/index.ts`

- [ ] **Step 1: ds-dialog.ts 작성**

스펙 §3.6 의 구현 코드를 그대로 사용 (MutationObserver 로 x-show 와 dialog.showModal 동기화, dialog-close 커스텀 이벤트 디스패치).

- [ ] **Step 2: index.ts 에 등록 추가**

```ts
import { DsDialog } from './ds-dialog.js';

// register() 내부에 추가
define('ds-dialog', DsDialog);

// export 에 추가
export { DsDialog };
```

- [ ] **Step 3: Alpine.js 스모크 테스트 HTML**

```html
<!-- packages/elements/test-dialog.html -->
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="../styles/dist/styles-utilities.css">
  <script defer src="https://unpkg.com/alpinejs"></script>
  <script type="module" defer src="./dist/dx-elements.mjs"></script>
</head>
<body class="p-10" x-data="{ open: false }">
  <ds-button @click="open = true">열기</ds-button>
  <ds-dialog x-show="open" @dialog-close="open = false">
    <h2 class="text-lg font-semibold">약관</h2>
    <p>본문 내용</p>
    <ds-button @click="open = false">닫기</ds-button>
  </ds-dialog>
</body>
</html>
```

검증 체크리스트:
- [ ] 버튼 클릭 → dialog 열림, backdrop 표시
- [ ] ESC 키 → 닫힘, `open` 상태 `false` 로 변경
- [ ] backdrop 클릭 → 닫힘
- [ ] 포커스가 dialog 내부로 트랩됨 (Tab 이 외부로 못 빠짐)
- [ ] 닫힐 때 `dialog-close` 이벤트로 Alpine `open` 이 `false` 됨

**실패 시나리오:**
- `display:contents` host + Alpine `x-show` `display:none` 충돌 → MutationObserver 수정 필요
- Alpine `x-transition` 과 `<dialog>.showModal()` 시각적 어긋남 → 이 경우 README 에 "트랜지션은 CSS `@starting-style` 로" 안내

- [ ] **Step 4: 검증 결과를 스펙에 기록**

```markdown
### ds-dialog 프로토타입 검증 결과 (2026-04-XX)

- Alpine.js 로딩: https://unpkg.com/alpinejs@3
- 테스트 체크리스트 (위 5개) 결과: ...
- 결론:
  (A) 전부 통과 → 동일 패턴으로 Select/Popover 등 확장 가능. 문서화 진행.
  (B) 일부 실패 → 해당 항목 대응 (구현 수정 또는 제약 문서화).
  (C) 치명적 실패 → Dialog 도 React 전용 확정, @dx/elements 에서 ds-dialog 제거.
```

`docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md` "리스크 및 미결 이슈" 섹션에 append.

- [ ] **Step 5: 커밋**

```bash
git add packages/elements/ docs/superpowers/specs/
git commit -m "feat(elements): ds-dialog 프로토타입 (native <dialog> + Alpine.js) + 검증 결과 기록"
```

---

## Task 7: Storybook 재구성 (React + 3탭 코드뷰)

**Files:**
- Modify: `packages/storybook/.storybook/main.ts`, `preview.ts`
- Modify: `packages/storybook/package.json`
- Delete: `packages/storybook/stories/foundation/*.stories.ts` (web-components 기반)
- Create: `packages/storybook/stories/foundation/*.mdx` (또는 `.stories.tsx`)
- Create: `packages/storybook/stories/components/{button,input,label,checkbox,badge,form-field,dialog}.stories.tsx`
- Create: `packages/storybook/.storybook/source-transformer.ts` — 3탭 custom source

- [ ] **Step 1: main.ts 를 react-vite 로 전환**

```ts
// packages/storybook/.storybook/main.ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen-typescript' },
};
export default config;
```

- [ ] **Step 2: preview.ts + DX 스타일 로드**

```ts
// packages/storybook/.storybook/preview.ts
import '@dx/styles';  // tokens + theme + Tailwind 컴파일

import type { Preview } from '@storybook/react-vite';
import axeKoLocale from 'axe-core/locales/ko.json';

const preview: Preview = {
  parameters: {
    a11y: { config: { locale: axeKoLocale } },
    options: {
      storySort: {
        order: ['Introduction', 'Foundation', 'Components'],
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme ?? 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      return story();
    },
  ],
};
export default preview;
```

- [ ] **Step 3: 3탭 custom source transformer**

Storybook 8 기본 `source.code` 는 string 1 개. 3탭 구현 방법 2가지:
1. `@storybook/addon-docs` 의 `SourceCode` 블록을 커스텀 MDX 로 확장
2. `parameters.docs.source.transform` 으로 메타에 접근해 조건부 렌더

간단히 option 2 사용. Story 에서 `parameters.docs.source.code` 를 객체로 넘기고 `transform` 에서 Storybook UI 에 탭 생성:

```ts
// packages/storybook/.storybook/source-transformer.ts
export function multiSource(sources: {
  react: string;
  thymeleaf: string;
  html: string;
}): string {
  // Storybook "Show code" 에는 하나의 문자열만 표시 가능하므로
  // 주석으로 탭 구분 + 실제 탭 UI 는 MDX 에서 별도 렌더
  return [
    '/* ===== React ===== */',
    sources.react,
    '',
    '/* ===== Thymeleaf ===== */',
    sources.thymeleaf,
    '',
    '/* ===== HTML ===== */',
    sources.html,
  ].join('\n');
}
```

**제약 사항 명시:** Storybook 기본 "Show code" 는 단일 문자열. 3탭 UI 를 원하면 MDX 기반 Docs 페이지에서 `<Tabs>` 컴포넌트로 구현. Stories 에서는 주석 구분으로 충분.

대안: 각 컴포넌트마다 MDX docs 페이지 작성:

```tsx
// stories/components/Button.mdx
import { Meta, Canvas, Controls, Source } from '@storybook/blocks';
import * as ButtonStories from './button.stories';

<Meta of={ButtonStories} />

# Button

<Canvas of={ButtonStories.Default} />
<Controls />

## 프레임워크별 사용법

### React
<Source code={`import { Button } from '@dx/ui';\n\n<Button>가입</Button>`} language="tsx" />

### Thymeleaf
<Source code={`<ds-button th:text="#{form.submit}">가입</ds-button>`} language="html" />

### HTML
<Source code={`<ds-button>가입</ds-button>`} language="html" />
```

- [ ] **Step 4: foundation stories MDX 로 재작성**

기존 `foundation/colors.stories.ts`, `grid.stories.ts`, `spacing.stories.ts`, `typography.stories.ts`, `icons.stories.ts` 를 `.mdx` + React 시각화 컴포넌트로 변환.

예:
```tsx
// stories/foundation/Colors.mdx
import { Meta } from '@storybook/blocks';
import { ColorSwatches } from './_colors';

<Meta title="Foundation/Colors" />

# Colors

<ColorSwatches />
```

```tsx
// stories/foundation/_colors.tsx
const SEMANTIC_COLORS = [
  { name: 'primary', token: '--primary' },
  { name: 'secondary', token: '--secondary' },
  { name: 'tertiary', token: '--tertiary' },
  // ...
];

export function ColorSwatches() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {SEMANTIC_COLORS.map(({ name, token }) => (
        <div key={name} className="flex flex-col gap-2">
          <div className="h-16 rounded-md" style={{ background: `var(${token})` }} />
          <code className="text-xs">{token}</code>
        </div>
      ))}
    </div>
  );
}
```

모든 Foundation 페이지 동일 패턴.

- [ ] **Step 5: components stories 작성**

각 컴포넌트 1 파일:

```tsx
// stories/components/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@dx/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'secondary', 'tertiary', 'destructive', 'outline', 'ghost', 'link'] },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'xs', 'icon'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = { args: { children: '가입' } };
export const Secondary: Story = { args: { variant: 'secondary', children: '보조' } };
export const Tertiary: Story = { args: { variant: 'tertiary', children: '3차' } };
export const Destructive: Story = { args: { variant: 'destructive', children: '삭제' } };
```

각 컴포넌트의 MDX docs 페이지에 3프레임워크 코드 스니펫.

- [ ] **Step 6: package.json 의존성 정리**

```json
"dependencies": {
  "@dx/styles": "workspace:*",
  "@dx/ui": "workspace:*"
},
"devDependencies": {
  "@storybook/addon-a11y": "^8",
  "@storybook/addon-essentials": "^8",
  "@storybook/blocks": "^8",
  "@storybook/react-vite": "^8",
  "@tailwindcss/vite": "^4",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "axe-core": "^4.11.3",
  "react": "^19",
  "react-dom": "^19",
  "storybook": "^8",
  "tailwindcss": "^4",
  "typescript": "^5",
  "vite": "^5"
}
```

web-components 의존성(`@storybook/web-components`, `lit`) 제거.

- [ ] **Step 7: 빌드 검증**

```bash
pnpm install
pnpm --filter storybook build
```

Expected: `packages/storybook/dist/` 에 static Storybook 생성.

- [ ] **Step 8: a11y 스캔 (Playwright MCP)**

```bash
pnpm --filter storybook dev  # background
# Playwright MCP 로 각 스토리 iframe 접속 → axe.run() → violations 0 확인
# Foundation + 모든 atom + ds-dialog 포함
```

- [ ] **Step 9: 커밋**

```bash
git add packages/storybook/
git commit -m "feat(storybook): React+Vite 로 전환, Foundation/Components 재구성"
```

---

## Task 8: examples/react-nextjs — tertiary 추가 + Task 4의 styles.ts 활용

**Files:**
- Modify: `examples/react-nextjs/app/page.tsx`

- [ ] **Step 1: page.tsx 에 tertiary 버튼 시연 추가**

3 섹션 중 Tailwind 오버라이드 섹션에 `<Button variant="tertiary">` 추가.

```tsx
<Button variant="tertiary">Tertiary</Button>
```

- [ ] **Step 2: 빌드 검증**

```bash
pnpm --filter @dx-examples/react-nextjs build
```

Expected: 성공, tertiary 버튼이 amber 톤으로 렌더.

- [ ] **Step 3: 커밋**

```bash
git add examples/react-nextjs/
git commit -m "feat(examples): react-nextjs 에 tertiary variant 시연 추가"
```

---

## Task 9: examples/vanilla-html — `<ds-*>` 태그 전면 사용

**Files:**
- Modify: `examples/vanilla-html/index.html`

- [ ] **Step 1: index.html 재작성**

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <title>DX Design System — Vanilla HTML</title>

    <link rel="stylesheet"
          href="../../packages/styles/dist/styles-utilities.css" />
    <script defer src="https://unpkg.com/alpinejs@3"></script>
    <script type="module" defer
            src="../../packages/elements/dist/dx-elements.mjs"></script>
  </head>
  <body class="bg-background text-foreground p-10">
    <main class="max-w-2xl mx-auto flex flex-col gap-10">
      <h1 class="text-3xl font-bold">DX Design System — Vanilla HTML</h1>

      <!-- 1. 기본 -->
      <section class="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 class="text-xl font-semibold">1. 기본 사용</h2>
        <form class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <ds-label for="email">이메일</ds-label>
            <ds-input id="email" type="email" placeholder="name@company.com"/>
            <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
          </div>
          <div class="flex flex-row items-center gap-2">
            <!-- ds-checkbox 는 Radix 의존으로 @dx/ui 전용. HTML 은 native 사용. -->
            <input type="checkbox" id="terms" class="size-4 rounded border-input" />
            <ds-label for="terms">동의</ds-label>
          </div>
          <ds-button type="submit">가입</ds-button>
        </form>
      </section>

      <!-- 2. Token 오버라이드 -->
      <section class="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 class="text-xl font-semibold">2. Token 오버라이드</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col gap-3 p-4 rounded-lg border">
            <ds-badge>기본</ds-badge>
            <ds-button>가입</ds-button>
          </div>
          <div class="flex flex-col gap-3 p-4 rounded-lg border"
               style="--primary:#8b5cf6; --ring:#8b5cf6;">
            <ds-badge>Purple</ds-badge>
            <ds-button>가입</ds-button>
          </div>
          <div class="flex flex-col gap-3 p-4 rounded-lg border"
               style="--primary:#10b981; --ring:#10b981;">
            <ds-badge>Emerald</ds-badge>
            <ds-button>가입</ds-button>
          </div>
        </div>
      </section>

      <!-- 3. Tailwind 오버라이드 -->
      <section class="flex flex-col gap-4 p-6 rounded-xl border">
        <h2 class="text-xl font-semibold">3. Tailwind 오버라이드</h2>
        <p class="text-sm text-muted-foreground">
          Light DOM WC 라서 class 가 실제 내부 요소에 병합됨.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ds-button>기본</ds-button>
          <ds-button class="w-full">w-full</ds-button>
          <ds-button class="w-full mt-2 shadow-lg rounded-full">rounded-full shadow-lg</ds-button>
          <ds-button variant="outline" class="bg-yellow-100 hover:bg-yellow-200">outline + bg</ds-button>
        </div>
        <ds-input type="email" class="border-2 border-primary" placeholder="border-2"/>
      </section>

      <!-- 4. Dialog (Alpine.js 통합) -->
      <section class="flex flex-col gap-4 p-6 rounded-xl border"
               x-data="{ open: false }">
        <h2 class="text-xl font-semibold">4. Dialog (Alpine.js)</h2>
        <ds-button @click="open = true">약관 보기</ds-button>
        <ds-dialog x-show="open" @dialog-close="open = false"
                   class="flex flex-col gap-3">
          <h3 class="text-lg font-semibold">이용약관</h3>
          <p class="text-sm">본문 내용...</p>
          <ds-button variant="outline" @click="open = false">닫기</ds-button>
        </ds-dialog>
      </section>
    </main>
  </body>
</html>
```

- [ ] **Step 2: README 업데이트**

```markdown
# vanilla-html 예제

## 로드하는 리소스
- `@dx/styles/dist/styles-utilities.css` — 토큰 + 넓은 utility safelist
- `https://unpkg.com/alpinejs@3` — dialog 등 인터랙션용 (선택)
- `@dx/elements/dist/dx-elements.mjs` — Light DOM Web Components

## 실행
`pnpm example:html`

## Tailwind 오버라이드가 동작하는 조건
이 예제는 `styles-utilities.css` (safelist 포함) 를 로드하므로 `px-*`, `bg-*`, `rounded-*`
등 safelist 범위 내의 Tailwind class 가 `<ds-*>` 에 걸렸을 때 병합되어 적용됩니다.

서비스에 자체 Tailwind 빌드 파이프라인이 있다면 `content` 글롭에 템플릿을 포함시켜
`styles-utilities.css` 대신 자기 `tailwind.css` 를 쓰세요 (safelist 범위 벗어나는 class 도 가능).
```

- [ ] **Step 3: 브라우저에서 확인**

```bash
pnpm example:html  # http-server 가 열림
```

체크리스트:
- [ ] 1번 섹션: 라벨·입력·버튼 정상 렌더
- [ ] 2번 섹션: Purple/Emerald 카드의 버튼·배지가 브랜드 컬러로 렌더
- [ ] 3번 섹션: `class="w-full mt-2 shadow-lg rounded-full"` 이 실제 `<button>` 에 적용된 것을 DevTools 로 확인
- [ ] 4번 섹션: 버튼 클릭 → dialog 열림, ESC / backdrop 클릭 / 닫기 버튼 모두 작동

- [ ] **Step 4: 커밋**

```bash
git add examples/vanilla-html/
git commit -m "feat(examples): vanilla-html 을 <ds-*> + Alpine.js 로 재작성"
```

---

## Task 10: examples/thymeleaf-spring — Task 1 결과 반영

**Files:**
- Modify: `examples/thymeleaf-spring/src/main/resources/templates/layout.html`, `signup.html`
- Modify: `examples/thymeleaf-spring/README.md`

- [ ] **Step 1: layout.html 업데이트**

```html
<head>
  <link rel="stylesheet" th:href="@{/css/styles-utilities.css}" />
  <script defer src="https://unpkg.com/alpinejs@3"></script>
  <script type="module" defer th:src="@{/js/dx-elements.mjs}"></script>
</head>
```

- [ ] **Step 2: signup.html — Task 1 결과에 따라 분기**

**만약 Task 1 검증이 `th:field` OK 라면:**
```html
<ds-input th:field="*{email}" type="email"/>
```

**만약 `th:attr` 워크어라운드가 필요하면:**
```html
<ds-input th:attr="id=${#ids.seq('email')},
                   name='email',
                   value=*{email}"
          type="email"/>
```

3섹션 (기본 / 토큰 / Tailwind) + Dialog 섹션 작성 (vanilla-html 과 동일 구조, Thymeleaf 관용 추가).

- [ ] **Step 3: README 업데이트**

Tailwind 3 경로 안내표 + Spring Boot 에 `@dx/elements` 번들 복사 스크립트.

- [ ] **Step 4: 커밋**

```bash
git add examples/thymeleaf-spring/
git commit -m "feat(examples): thymeleaf-spring 을 <ds-*> + (th:field 또는 th:attr) 로 재작성"
```

---

## Task 11: 문서 전면 재작성

**Files:**
- Modify: `CLAUDE.md`, `README.md`, `docs/architecture.md`, `docs/contributing.md`

- [ ] **Step 1: CLAUDE.md**

Shoelace 관련 규칙 전부 제거. 새 원칙:
- 3 패키지 구조 (`@dx/styles` / `@dx/ui` / `@dx/elements`)
- baseClasses 는 `@dx/ui/styles/*` 에 정의, 양 패키지 공유
- React 는 `<ds-*>` 미사용
- 새 컴포넌트 추가 절차: shadcn CLI → `*.styles.ts` 추출 → `@dx/elements` 래퍼 → 스토리 → 3 예제 추가
- 커밋 메시지 한글 유지

- [ ] **Step 2: README.md**

3 섹션 (React / Thymeleaf / HTML) 각각 shadcn + `@dx/elements` 사용법. "Tailwind override 조건 3경로" 안내표.

- [ ] **Step 3: docs/architecture.md**

새 아키텍처 설명. v0.1.0 Shoelace 시도·실패 이유는 "history" 요약. Light DOM WC 의 `display:contents` + attribute forwarding + tailwind-merge 메커니즘.

- [ ] **Step 4: docs/contributing.md**

빌드 의존 순서: `@dx/styles → @dx/ui → @dx/elements → storybook/examples`.
새 컴포넌트 추가 절차·체크리스트.

- [ ] **Step 5: 커밋**

```bash
git add CLAUDE.md README.md docs/
git commit -m "docs: v0.2.0 shadcn 기반 아키텍처로 전면 재작성"
```

---

## Task 12: 최종 빌드 검증 + 푸시

- [ ] **Step 1: 전 패키지 빌드**

```bash
pnpm --filter @dx/styles build
pnpm --filter @dx/ui build
pnpm --filter @dx/elements build
pnpm --filter storybook build
pnpm --filter @dx-examples/react-nextjs build
```

Expected: 전부 성공.

- [ ] **Step 2: Storybook a11y 재확인**

Playwright MCP 로 모든 atom + Foundation + Dialog 스토리 axe 스캔 → violations 0.

- [ ] **Step 3: vanilla-html + thymeleaf-spring 스모크**

```bash
pnpm example:html  # 브라우저에서 4섹션 체크
```

Thymeleaf 는 (Java 환경 있으면) `cp -r` 스크립트로 Spring 프로젝트에 복사 후 로컬 실행.

- [ ] **Step 4: 푸시**

```bash
git push origin feat/v0.2.0-shadcn
```

---

## 성공 기준 재확인 (스펙 §성공 기준)

- [ ] `packages/elements` 6 atoms + `ds-dialog` + base-element 구현
- [ ] `@dx/ui` tertiary variant + `*.styles.ts` sub-path export
- [ ] `@dx/elements` 가 `@dx/ui/styles/*` 로 baseClasses import
- [ ] `tokens.css` shadcn 형태 + 3브랜드
- [ ] `styles-utilities.css` safelist 배포
- [ ] `@dx/elements` 번들 < 50KB gzip
- [ ] Thymeleaf `th:field` 프로토타입 검증 (Task 1)
- [ ] Next.js 예제 빌드 성공 + primary/secondary/tertiary 3브랜드 렌더
- [ ] vanilla-html `<ds-input class="px-5">` 실제 적용 확인
- [ ] thymeleaf-spring 템플릿이 Task 1 결과 반영
- [ ] Storybook 빌드 + 3탭 코드뷰
- [ ] axe violations 0
- [ ] CLAUDE.md / README / architecture / contributing 재작성
- [ ] examples/*/README 에 Tailwind 3 경로 안내
- [ ] `ds-dialog` 프로토타입 검증 결과 기록

---

## 중단·재개 가이드

중간에 멈췄다 재개할 때:
1. `git log --oneline -10` 으로 마지막 완료 Task 확인
2. `git status` 로 현재 변경 상태 확인
3. Task 번호·Step 번호로 다음부터 재개
4. `@dx/styles` 재빌드 없이 `@dx/ui` 빌드하면 토큰 누락될 수 있으니 **의존 순서대로** 재빌드 우선
