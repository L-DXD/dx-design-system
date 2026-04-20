# Foundation/Grid 토큰 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** DX Design System Foundation 에 Breakpoint / Container max-width / Grid 관련 CSS 토큰을 추가하고, Storybook 4개 스토리와 소비자 문서를 함께 제공한다.

**Architecture:** `@dx/styles/src/tokens.css` 의 `:root` 블록 말미에 §8 BREAKPOINTS / CONTAINER / GRID 섹션을 신설해 12개 CSS 변수를 primitive 레이어로 추가한다. 다크모드 오버라이드 블록에는 포함시키지 않는다(테마 독립적). Storybook 은 기존 `spacing.stories.ts` 와 동일한 데이터 배열 + `.map()` 패턴을 따른다.

**Tech Stack:** CSS Custom Properties (PostCSS + Tailwind v4 컴파일), Storybook(Web Components + Lit html), Playwright MCP + axe-core(a11y 검증).

**References:**

- 스펙: `docs/superpowers/specs/2026-04-20-grid-foundation-tokens-design.md`
- 기존 Foundation 스토리 패턴: `packages/storybook/stories/foundation/spacing.stories.ts`
- 작업 워크플로우: `CLAUDE.md` §작업 워크플로우

---

## File Structure

**신규 파일:**

- `packages/storybook/stories/foundation/grid.stories.ts` — 4개 스토리(Breakpoints / Container / GridOverlay / UsageGuide)

**수정 파일:**

- `packages/styles/src/tokens.css:345` — `:root` 블록 말미에 §8 섹션 추가 (12개 변수)
- `README.md` — "테마 커스터마이징" 섹션 뒤에 Breakpoint 정렬 문단 추가
- `docs/architecture.md` — "§7 Grid 토큰의 철학과 한계" 신규 섹션 추가

**커밋 전략:** 워크플로우 §6 원칙대로 **단일 feature 커밋** 에 토큰·스토리·문서를 모두 묶는다. 작업 중에는 local 에서 단계별 진행하되 최종은 squash 또는 한 번에 `git add` 로 묶는다.

---

## Task 1: Grid 토큰 추가 (tokens.css)

**Files:**

- Modify: `packages/styles/src/tokens.css` (기존 `:root` 블록 말미, §7 Z-INDEX 다음)

- [ ] **Step 1: `tokens.css` 에 §8 섹션 추가**

`tokens.css` 의 345번 줄(현재 `:root` 블록 닫는 `}` 바로 앞) 에 아래 섹션을 삽입한다. `--dx-z-tooltip: 1070;` 다음 줄에 이어서 작성.

```css
  /* ============================================================
   *  8. BREAKPOINTS / CONTAINER / GRID
   *  Tailwind v4 기본값과 정렬. 테마 독립적이므로 .dark 오버라이드 없음.
   *  CSS 변수는 @media 인자로 직접 쓸 수 없으므로(스펙 제약),
   *  실제 반응형 분기는 Tailwind 유틸 `md:` 또는 `@media (min-width: 768px)`
   *  리터럴로 작성한다. 자세한 용도는 grid.stories.ts 참고.
   * ============================================================ */

  /* Breakpoints */
  --dx-breakpoint-sm: 640px;
  --dx-breakpoint-md: 768px;
  --dx-breakpoint-lg: 1024px;
  --dx-breakpoint-xl: 1280px;
  --dx-breakpoint-2xl: 1536px;

  /* Container max-widths — breakpoint와 동일값 */
  --dx-container-sm: 640px;
  --dx-container-md: 768px;
  --dx-container-lg: 1024px;
  --dx-container-xl: 1280px;
  --dx-container-2xl: 1536px;

  /* Grid */
  --dx-grid-columns: 12; /* unitless. `repeat(var(--dx-grid-columns), 1fr)` 형태로만 사용. */
  --dx-grid-gutter: var(--dx-space-6); /* 24px, 기존 spacing 토큰 재사용 */
```

- [ ] **Step 2: `@dx/styles` 재빌드**

```bash
pnpm --filter @dx/styles build
```

Expected: 에러 없이 `dist/styles.css` 생성.

- [ ] **Step 3: 빌드 결과에 토큰이 포함되었는지 검증**

```bash
grep -c "dx-breakpoint-\|dx-container-\|dx-grid-" packages/styles/dist/styles.css
```

Expected: 12 이상 (5 + 5 + 2 = 최소 12회 등장).

개별 확인:

```bash
grep -o "dx-breakpoint-[a-z0-9]*" packages/styles/dist/styles.css | sort -u
# 기대 출력: dx-breakpoint-2xl / -lg / -md / -sm / -xl (5개)

grep -o "dx-container-[a-z0-9]*" packages/styles/dist/styles.css | sort -u
# 기대 출력: dx-container-2xl / -lg / -md / -sm / -xl (5개)

grep -o "dx-grid-[a-z]*" packages/styles/dist/styles.css | sort -u
# 기대 출력: dx-grid-columns / dx-grid-gutter (2개)
```

검증 실패 시: PostCSS 설정이 unused custom property 를 제거하는지 `packages/styles/postcss.config.*` 확인. 기존 `--dx-z-tooltip` 등이 보존되는 것을 보면 보존되는 것이 정상.

---

## Task 2: Storybook Grid 스토리 파일 생성 + Breakpoints 스토리

**Files:**

- Create: `packages/storybook/stories/foundation/grid.stories.ts`

- [ ] **Step 1: 파일 생성 + meta + Breakpoints 스토리 작성**

```ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Breakpoint · Container · Grid 토큰. Tailwind v4 기본값과 정렬되어 있다. ' +
          'CSS 변수는 `@media` 인자로 직접 쓸 수 없으므로, 실제 반응형 분기는 ' +
          '`@media (min-width: 768px)` 리터럴 또는 Tailwind `md:` 접두사로 작성한다. ' +
          '토큰은 ① 값의 SSOT, ② JavaScript 런타임 참조, ③ 테마 오버라이드 일관성 용도.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ========================================================================
 *  1. Breakpoints — Tailwind v4 기본값과 정렬된 5단계
 * ======================================================================== */

const BREAKPOINTS = [
  { name: 'sm', token: '--dx-breakpoint-sm', px: 640, device: '모바일 가로', usage: '한 줄 레이아웃 시작점' },
  { name: 'md', token: '--dx-breakpoint-md', px: 768, device: '태블릿 세로', usage: '2-column 레이아웃 분기' },
  { name: 'lg', token: '--dx-breakpoint-lg', px: 1024, device: '노트북', usage: '사이드바 노출' },
  { name: 'xl', token: '--dx-breakpoint-xl', px: 1280, device: '데스크탑', usage: '페이지 폭 확대' },
  { name: '2xl', token: '--dx-breakpoint-2xl', px: 1536, device: '대형 모니터', usage: '최대 폭 도달' },
];

export const Breakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '반응형 분기점 5단계. 값은 Tailwind 기본값과 동일하므로 `md:` 유틸을 쓰는 소비자와 자동 정렬된다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${BREAKPOINTS.map(
        (b) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 60px 1fr 80px 180px 1fr;
              gap: 16px;
              align-items: center;
              padding: 12px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-foreground);">
              ${b.name}
            </code>
            <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              var(${b.token})
            </code>
            <div style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              ${b.px}px
            </div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${b.device}</div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${b.usage}
            </div>
          </div>
        `,
      )}
    </div>
  `,
};
```

- [ ] **Step 2: Storybook dev 서버에서 Breakpoints 스토리 렌더링 확인**

```bash
pnpm --filter storybook dev
```

브라우저에서 `Foundation/Grid/Breakpoints` 네비게이션 항목 클릭. 5개 row 가 표로 렌더링되는지 확인. 에러 콘솔 없음.

---

## Task 3: Container 스토리 추가

**Files:**

- Modify: `packages/storybook/stories/foundation/grid.stories.ts`

- [ ] **Step 1: Container 스토리 추가**

파일 하단에 이어서 작성:

```ts
/* ========================================================================
 *  2. Container — 각 breakpoint의 max-width 시각화
 * ======================================================================== */

const CONTAINERS = [
  { name: 'sm', token: '--dx-container-sm', px: 640 },
  { name: 'md', token: '--dx-container-md', px: 768 },
  { name: 'lg', token: '--dx-container-lg', px: 1024 },
  { name: 'xl', token: '--dx-container-xl', px: 1280 },
  { name: '2xl', token: '--dx-container-2xl', px: 1536 },
];

export const Container: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '각 breakpoint에서 활성화되는 container max-width. 회색 배경 + 중앙 정렬 박스로 나란히 표시한다. ' +
          '실제 활성 container 는 Storybook viewport toolbar 로 크기를 바꿔가며 확인.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${CONTAINERS.map(
        (c) => html`
          <div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 6px;
              "
            >
              <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
                var(${c.token})
              </code>
              <span style="font-size: 12px; color: var(--dx-color-muted-foreground);">${c.px}px</span>
            </div>
            <div
              style="
                position: relative;
                height: 48px;
                background: var(--dx-color-muted);
                border-radius: 4px;
                overflow: hidden;
              "
            >
              <div
                style="
                  width: min(100%, ${c.px}px);
                  height: 100%;
                  margin: 0 auto;
                  background: var(--dx-color-primary-subtle);
                  border-left: 2px solid var(--dx-color-primary);
                  border-right: 2px solid var(--dx-color-primary);
                "
              ></div>
            </div>
          </div>
        `,
      )}
    </div>
  `,
};
```

- [ ] **Step 2: 렌더링 확인**

Storybook 에서 `Foundation/Grid/Container` 확인. 5개의 가로 막대가 세로로 나열되고, 각각 중앙에 파란 영역(container max-width)이 표시되는지. 뷰포트 폭이 container max 보다 작으면 100% 로 꽉 차게 됨.

---

## Task 4: GridOverlay 스토리 추가

**Files:**

- Modify: `packages/storybook/stories/foundation/grid.stories.ts`

- [ ] **Step 1: GridOverlay 스토리 추가**

파일 하단에 이어서:

```ts
/* ========================================================================
 *  3. Grid Overlay — 12 columns + 24px gutter 시각화
 * ======================================================================== */

export const GridOverlay: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '12 columns + 24px gutter 가 실제로 어떻게 보이는지 오버레이로 시연. ' +
          '컬럼 개수는 `--dx-grid-columns`, gutter 는 `--dx-grid-gutter` (=`--dx-space-6`) 토큰으로 제어.',
      },
    },
  },
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
        gap: var(--dx-grid-gutter);
        padding: 16px;
        border: 1px dashed var(--dx-color-border);
        border-radius: 8px;
      "
    >
      ${Array.from({ length: 12 }, (_, i) => i + 1).map(
        (i) => html`
          <div
            style="
              background: var(--dx-color-primary-subtle);
              border: 1px solid var(--dx-color-primary);
              border-radius: 4px;
              padding: 16px 8px;
              text-align: center;
              font-family: var(--dx-font-mono);
              font-size: 12px;
              color: var(--dx-color-primary);
            "
          >
            ${i}
          </div>
        `,
      )}
    </div>
    <div style="margin-top: 16px; font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.6;">
      <strong>columns:</strong> <code>var(--dx-grid-columns)</code> = 12<br />
      <strong>gutter:</strong> <code>var(--dx-grid-gutter)</code> = <code>var(--dx-space-6)</code> = 24px
    </div>
  `,
};
```

- [ ] **Step 2: 렌더링 확인**

`Foundation/Grid/GridOverlay` 에 12개 컬럼 박스(1~12 숫자)가 균등 폭으로 나열되고, 사이 간격이 24px(`--dx-space-6`)인지 눈으로 확인.

---

## Task 5: UsageGuide 스토리 추가

**Files:**

- Modify: `packages/storybook/stories/foundation/grid.stories.ts`

- [ ] **Step 1: UsageGuide 스토리 추가**

파일 하단에 이어서:

```ts
/* ========================================================================
 *  4. Usage Guide — 3가지 사용법 코드 예시
 * ======================================================================== */

const USAGE_EXAMPLES = [
  {
    title: '1. @media 리터럴',
    note: '가장 흔한 경우. CSS 변수는 @media 인자로 쓸 수 없으므로 리터럴 값을 직접 입력.',
    lang: 'css',
    code: `@media (min-width: 768px) {
  .my-layout {
    display: grid;
    grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
    gap: var(--dx-grid-gutter);
  }
}`,
  },
  {
    title: '2. Tailwind 유틸 클래스',
    note: 'Tailwind 를 설치한 소비자 전용. 접두사(`md:`)가 `--dx-breakpoint-md` 와 같은 지점에서 반응.',
    lang: 'html',
    code: `<div class="md:grid md:grid-cols-12 md:gap-6">
  <!-- ... -->
</div>`,
  },
  {
    title: '3. JavaScript 참조',
    note: '브라우저 전용. Next.js RSC / Thymeleaf 서버 렌더 중에는 window 가 없으므로 반드시 가드.',
    lang: 'ts',
    code: `if (typeof window !== 'undefined') {
  const md = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dx-breakpoint-md'),
  );
  if (window.innerWidth >= md) { /* ... */ }
}`,
  },
];

export const UsageGuide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Breakpoint / Grid 토큰을 쓰는 3가지 방법. ' +
          '환경(CSS / Tailwind / JS)별로 골라 쓴다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${USAGE_EXAMPLES.map(
        (ex) => html`
          <div
            style="
              padding: 16px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <div
              style="
                font-size: 14px;
                font-weight: var(--dx-font-weight-semibold);
                color: var(--dx-color-foreground);
                margin-bottom: 6px;
              "
            >
              ${ex.title}
            </div>
            <div
              style="
                font-size: 12px;
                color: var(--dx-color-muted-foreground);
                line-height: 1.6;
                margin-bottom: 12px;
              "
            >
              ${ex.note}
            </div>
            <pre
              style="
                background: var(--dx-color-muted);
                padding: 12px;
                border-radius: 4px;
                font-family: var(--dx-font-mono);
                font-size: 12px;
                line-height: 1.6;
                overflow-x: auto;
                margin: 0;
              "
            ><code>${ex.code}</code></pre>
          </div>
        `,
      )}
    </div>
  `,
};
```

- [ ] **Step 2: 렌더링 확인**

`Foundation/Grid/UsageGuide` 에 3개 카드(`@media 리터럴` / `Tailwind 유틸` / `JavaScript 참조`)가 세로로 나열되고, 각 카드 내부에 코드 블록이 올바르게 표시되는지 확인.

---

## Task 6: Storybook autodocs 페이지와 사이드바 정렬 확인

**Files:**

- 없음 (확인 작업)

- [ ] **Step 1: autodocs 페이지 확인**

Storybook 에서 `Foundation/Grid` 의 자동 생성 "Docs" 페이지로 이동. meta 의 component 설명과 4개 스토리가 순서대로(Breakpoints → Container → GridOverlay → UsageGuide) 렌더링되는지 확인.

- [ ] **Step 2: 사이드바 정렬 확인**

Storybook 사이드바에서 그룹 순서가 `Foundation → Atoms → Molecules → Organisms → Templates → Pages` 인지 확인 (`preview.ts` 의 `storySort` 설정이 이미 적용되어 있음). Foundation 내부에서 Grid 가 다른 Foundation 항목(Colors / Icons / Spacing / Typography) 과 알파벳 순서로 정렬되는지 확인.

---

## Task 7: 접근성(a11y) 스캔

**Files:**

- 없음 (검증 작업)

- [ ] **Step 1: Playwright MCP 로 axe 스캔 실행**

Storybook dev 서버가 켜진 상태에서 Playwright MCP 로 다음 스토리 iframe 4개에 `axe.run()` 실행:

- `/?path=/story/foundation-grid--breakpoints`
- `/?path=/story/foundation-grid--container`
- `/?path=/story/foundation-grid--grid-overlay`
- `/?path=/story/foundation-grid--usage-guide`

- [ ] **Step 2: 결과 검증**

Storybook chrome 관련 rule 은 무시 (`landmark-one-main`, `page-has-heading-one`, `region`, `frame-title`, `meta-viewport`).

나머지 실제 violations = 0 이어야 함.

- [ ] **Step 3: 위반이 나오면 원인 해결**

`color-contrast` → `@dx/styles` 토큰 조정.
다른 rule → 스토리 쪽이 아닌 컴포넌트/스타일 레이어에서 수정.
규칙 disable 로 우회 금지 (CLAUDE.md §4 참고).

---

## Task 8: README 업데이트 (Breakpoint 정렬 안내)

**Files:**

- Modify: `README.md` — "테마 커스터마이징" 섹션 뒤

- [ ] **Step 1: README 의 "테마 커스터마이징" 섹션 마지막(방법 3 폰트/모양 뒤) 에 문단 추가**

다음 섹션(`## 다크모드`) 직전에 아래 블록을 삽입:

```markdown
### Breakpoint 토큰 사용

`@dx/styles` 는 Tailwind v4 기본값과 정렬된 breakpoint 토큰(`--dx-breakpoint-sm` ~ `--dx-breakpoint-2xl`) 을 제공합니다. CSS 변수는 `@media` 쿼리 인자로 직접 쓸 수 없다는 스펙 제약이 있으므로, 실제 반응형 분기는 다음 세 가지 방식으로 작성합니다.

**1. `@media` 리터럴:**

```css
@media (min-width: 768px) {
  .my-layout {
    display: grid;
    grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
    gap: var(--dx-grid-gutter);
  }
}
```

**2. Tailwind 유틸 (Tailwind 설치한 소비자):**

```html
<div class="md:grid md:grid-cols-12 md:gap-6">...</div>
```

**3. JavaScript 참조 (SSR 가드 필수):**

```ts
if (typeof window !== 'undefined') {
  const md = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--dx-breakpoint-md'),
  );
  if (window.innerWidth >= md) { /* ... */ }
}
```

더 자세한 내용은 Storybook `Foundation/Grid` 카테고리를 참고하세요.
```

> **주의:** 위 마크다운 블록의 안쪽 ```` ``` ```` 펜스 3종류는 실제 파일 삽입 시 바깥 외곽선과 충돌하지 않도록 그대로 붙여넣어야 합니다. Edit tool 사용 시 다음 구분점을 쓰세요:
>
> - 기존 마지막 폰트/모양 코드 블록 직후 ~ `## 다크모드` 직전 사이에 삽입.
> - 삽입할 섹션의 외곽 제목은 `### Breakpoint 토큰 사용`.

- [ ] **Step 2: 렌더링 확인**

`README.md` 를 GitHub preview 또는 VS Code Markdown preview 로 열어 코드 블록과 헤더가 깨지지 않는지 확인.

---

## Task 9: architecture.md 업데이트

**Files:**

- Modify: `docs/architecture.md` — 파일 말미 또는 `§6 CSS Variables 기반 테마` 다음

- [ ] **Step 1: architecture.md 확인**

```bash
cat docs/architecture.md | grep -n "^## \|^### "
```

현재 섹션 구조 파악. §6 다음에 §7 을 추가할 자리를 확인.

- [ ] **Step 2: §7 Grid 토큰 섹션 추가**

`§6 CSS Variables 기반 테마` 섹션의 끝(다음 §7 이 시작하는 줄 직전) 에 아래 섹션 삽입. 만약 §7 이 이미 존재하면 번호를 밀고 새 §7 을 삽입, 기존 §7~§N 을 §8~§(N+1) 로 재번호화.

```markdown
## 7. Grid 토큰의 철학과 한계

Foundation 0단계에 **Breakpoint / Container / Grid** 관련 CSS 토큰(`--dx-breakpoint-*`, `--dx-container-*`, `--dx-grid-columns`, `--dx-grid-gutter`) 을 정의한다.

### 7-1. 왜 토큰만 먼저 만드는가

Atomic Design 작업 순서상 Foundation 의 목적은 "이후 단계(Atoms, Molecules, Organisms) 가 참조할 기준치의 확립" 이다. `.dx-container` 유틸 클래스나 `<ds-grid>` Web Component 를 Molecules/Organisms 경험 없이 미리 설계하면, 실제 쓸 때 맞지 않아 재설계하게 될 확률이 크다(YAGNI). 따라서 이 단계에서는 값의 **단일 진실 공급원(SSOT)** 만 확정하고, 유틸/컴포넌트는 필요가 드러나면 별도 스펙으로 도입한다.

### 7-2. Tailwind 기본값과 정렬한 이유

Breakpoint 값은 Tailwind v4 기본값(`640 / 768 / 1024 / 1280 / 1536`) 과 동일하게 둔다. `@dx/styles` 가 이미 Tailwind 로 빌드되어 소비자에게 전달되므로, Tailwind 유틸(`md:` 등) 을 쓰는 소비자는 우리 토큰과 같은 지점에서 반응한다. 사내 실사용 뷰포트 통계가 축적되기 전에 커스텀 값을 도입하는 것은 추측 기반 결정이므로 미룬다. 서비스는 `theme.css` 에서 `:root` 스코프로 이 토큰을 오버라이드할 수 있다.

### 7-3. CSS 변수의 `@media` 한계 대응

CSS 사양상 `@media (min-width: var(--dx-breakpoint-md))` 는 **동작하지 않는다**. 따라서 토큰은 다음 세 용도로만 쓴다.

1. **값의 SSOT** — 서비스마다 "어느 지점에서 분기하는가" 의 공식 기준 제공.
2. **JavaScript 런타임 참조** — `getComputedStyle` 로 값 조회. 단, SSR 환경에서는 `typeof window !== 'undefined'` 가드 필수.
3. **테마 관리 일관성** — 향후 유틸/WC 도입 시 내부 반응형 로직이 동일 토큰을 참조하도록 보장.

실제 반응형 분기(`@media` 쿼리, Tailwind `md:` 접두사) 는 리터럴 값 또는 Tailwind 유틸로 작성한다. 자세한 사용법은 Storybook `Foundation/Grid/UsageGuide` 및 README "Breakpoint 토큰 사용" 섹션 참고.

### 7-4. 다크모드와의 관계

Grid 토큰은 **테마 독립적**(라이트/다크 모두 동일값) 이다. 따라서 `.dark` / `prefers-color-scheme: dark` 오버라이드 블록에 포함시키지 않는다.
```

- [ ] **Step 3: 렌더링 확인**

```bash
cat docs/architecture.md | grep -n "^## "
```

새 §7 이 제 자리에 삽입되었는지 확인. 링크 앵커(`#7-grid-토큰의-철학과-한계` 등) 가 깨지지 않는지 GitHub preview 또는 VS Code 로 확인.

---

## Task 10: 최종 빌드 + 단일 커밋

**Files:**

- 없음 (검증 + 커밋)

- [ ] **Step 1: 전체 재빌드**

의존 순서대로:

```bash
pnpm --filter @dx/styles build
pnpm --filter @dx/core build
pnpm --filter @dx/react build
```

Expected: 전부 성공.

- [ ] **Step 2: Storybook static 빌드로 최종 검증**

```bash
pnpm --filter storybook build-storybook
```

Expected: 에러 없이 `packages/storybook/storybook-static/` 생성.

- [ ] **Step 3: 변경 파일 확인**

```bash
git status
git diff --stat
```

Expected 변경 목록:

- `packages/styles/src/tokens.css` (§8 추가)
- `packages/styles/dist/styles.css` (재빌드 결과물, `.gitignore` 상태에 따라 tracked 또는 untracked)
- `packages/storybook/stories/foundation/grid.stories.ts` (신규)
- `README.md` (Breakpoint 섹션 추가)
- `docs/architecture.md` (§7 추가)

- [ ] **Step 4: 단일 커밋으로 묶어 푸시**

워크플로우 §6 원칙대로 **하나의 커밋** 으로 묶는다:

```bash
git add \
  packages/styles/src/tokens.css \
  packages/storybook/stories/foundation/grid.stories.ts \
  README.md \
  docs/architecture.md
# dist/ 는 .gitignore 에 있으면 제외, tracked 라면 추가.

git commit -m "$(cat <<'EOF'
feat(styles): Foundation Grid 토큰 추가 (breakpoint / container / grid)

- @dx/styles tokens.css: §8 BREAKPOINTS / CONTAINER / GRID 섹션 신설
  - Tailwind v4 기본값과 정렬된 breakpoint 5단계
  - Container max-width 5단계 (breakpoint 동일값)
  - Grid columns(12) / gutter(--dx-space-6 재사용)
- storybook: foundation/grid.stories.ts (4 variation)
  - Breakpoints / Container / GridOverlay / UsageGuide
- README: "Breakpoint 토큰 사용" 섹션 추가 (@media / Tailwind / JS 3가지 예시)
- docs/architecture: §7 Grid 토큰의 철학과 한계 추가
  - 왜 토큰만 먼저 만드는가 (YAGNI)
  - Tailwind 정렬 이유
  - @media 한계 대응 (SSOT / JS 참조 / 테마 일관성)
  - 테마 독립성

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 5: 커밋 확인**

```bash
git log -1 --stat
```

Expected: 4개 파일 변경이 단일 커밋에 묶여 있음.

---

## 성공 기준 체크리스트 (스펙 §성공 기준 재확인)

- [ ] `tokens.css` 에 12개 신규 변수 추가, 빌드 성공
- [ ] `foundation/grid.stories.ts` 4개 스토리 렌더링 정상
- [ ] axe 스캔 violations 0개
- [ ] README / architecture.md 동기화 완료
- [ ] 모든 변경이 한 커밋에 묶여 있음

---

## 중단 복구 가이드

중간에 중단되어 재개할 때:

1. `git status` 로 현재 변경 상태 확인.
2. Task 번호를 보고 가장 마지막으로 완료된 Step 이후부터 재개.
3. tokens.css 변경 후 재빌드하지 않은 채로 스토리 작업 중이라면, 해당 스토리는 CSS 변수를 resolve 못해 시각적 결함이 나타날 수 있음 → 먼저 `pnpm --filter @dx/styles build` 재실행.
4. 최종 커밋은 무조건 Task 10 에서 한 번에 묶어 수행 (개별 커밋 금지: 워크플로우 §6).
