# Foundation/Grid 토큰 설계

작성일: 2026-04-20
작성자: jayoung.lee (@dx-design-system)
상태: 승인 대기

## 배경

DX Design System 의 Atomic Design 0단계 Foundation 에는 현재 Color, Typography, Spacing(Radius·Shadow 포함), Icons 네 축이 정의되어 있다. Grid(레이아웃 기준) 는 아직 없다.

Molecules/Organisms(`FormField`, `Card List`, `Header`) 단계로 진입하면 "이 컴포넌트가 lg 이상에서만 inline 레이아웃이 되어야 한다" "페이지 최대 폭이 xl 에서 1280px 로 잠겨야 한다" 와 같은 반응형·레이아웃 결정을 해야 한다. 그때마다 값을 임기응변으로 정하면 소비자(React/Thymeleaf) 간 정렬이 어긋나고, 서비스별 테마 커스터마이징의 기준도 없어진다.

따라서 Foundation 완료 전에 Grid 토큰(**값의 단일 진실 공급원**)을 확정한다. 본 스펙의 범위는 **토큰과 그 문서화**까지이며, 유틸 클래스나 `<ds-grid>` Web Component 는 포함하지 않는다.

## 목표

1. Breakpoint · Container max-width · Grid 관련 값을 CSS 변수로 정의한다.
2. 값은 Tailwind v4 기본값과 정렬해 Tailwind 유틸(`md:`) 을 쓰는 소비자의 반응형 분기점이 토큰과 자동으로 맞도록 한다.
3. Storybook 에 기존 `foundation/*.stories.ts` 와 동등한 밀도의 문서·시각화 스토리를 제공한다.
4. 소비자 문서(README) 에 사용법·한계를 기록해 "Tailwind 를 꼭 설치해야 하는가" 같은 오해를 원천 제거한다.

## 비목표 (Non-goals)

- `.dx-container` / `.dx-grid` / `.dx-col-*` 같은 **유틸리티 클래스**. Molecules/Organisms 실제 구축 중 필요가 확인된 뒤 별도 스펙으로 도입한다 (YAGNI).
- `<ds-grid>`, `<ds-grid-item>` 같은 **Web Component**. Atoms 단계로 승급되는 스코프이므로 Foundation 스펙에서 제외.
- 반응형 gutter (breakpoint별 다른 값). 현재 단일값 24px(`--dx-space-6`) 재사용. 실제 필요 발생 시 확장.
- Breakpoint 값의 사내 실사용 뷰포트 기반 재조정. 사내 데이터가 축적되지 않은 현시점에서는 Tailwind 관용값이 마찰 최소.

## 설계 결정 (Design Decisions)

### D1. 범위는 "토큰만"

**선택:** Option A — CSS 토큰만 정의.
**이유:** Foundation 의 목적은 "이후 컴포넌트가 참조할 기준치 확립" 이다. Molecules/Organisms 를 만들어보지 않은 상태에서 `<ds-grid>` 의 API(responsive props, slot 구조 등) 를 추측으로 결정하면 실제 사용 시 재설계 가능성이 크다. 토큰만 먼저 확정하고 상위 단계에서 부족함이 드러나면 유틸/WC 로 점진 확장한다.

### D2. Breakpoint 값은 Tailwind 기본값

**선택:** `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` (5단계).
**이유:**

- `@dx/styles` 가 이미 Tailwind 기반으로 빌드되어 소비자에게 전달됨.
- React/Next.js 소비자가 Tailwind 유틸(`md:` 등) 을 쓸 때 우리 토큰과 같은 지점에서 반응하도록 정렬 → 소비자의 멘탈 모델이 단순해짐.
- 사내 실사용 뷰포트 통계가 없는 상태에서 커스텀 값을 정하면 추측에 기반한 결정이 된다.

### D3. Container max-width 는 breakpoint 와 동일

**선택:** Tailwind `container` 플러그인 기본 규칙 — breakpoint 진입 시 해당 breakpoint 값이 container max-width 가 됨.
**이유:** 값을 이원화하면 기억해야 할 숫자가 두 배가 된다. 소비자가 "md 이상에서는 768 이하에 고정" 이라는 단순한 규칙만 외우면 됨.

### D4. Grid columns = 12, gutter = `--dx-space-6`(24px)

**선택:** 단일 값, spacing 토큰 재사용.
**이유:**

- 12 columns 는 사실상 웹 표준 (Bootstrap, Material, Tailwind grid 모두 12가 기본).
- Gutter 를 새 숫자로 도입하지 않고 기존 `--dx-space-6` 을 재사용하면 Foundation 내부 토큰 간 정렬성이 유지됨. 추후 반응형 gutter 가 필요해지면 `--dx-grid-gutter-sm` / `--dx-grid-gutter-lg` 로 확장 가능.

### D5. CSS 변수의 `@media` 한계 대응

**문제:** CSS 변수는 `@media (min-width: var(--dx-breakpoint-md))` 형태로 직접 쓸 수 없다 (CSS 사양 제약).

**대응:** 토큰은 다음 3가지 용도로 정의하고, 실제 반응형 분기는 리터럴 값(또는 Tailwind 유틸) 로 작성하도록 안내한다.

1. **SSOT (Single Source of Truth)** — 서비스마다 "우리는 어느 지점에서 분기하는가" 의 공식 기준.
2. **JavaScript 참조** — `getComputedStyle(document.documentElement).getPropertyValue('--dx-breakpoint-md')` 로 런타임 값 조회.
3. **테마 관리 일관성** — 서비스가 breakpoint 를 재정의할 때 모든 `ds-*` 컴포넌트의 내부 반응형 로직이 동일한 토큰을 참조하도록 함 (향후 유틸/WC 도입 시).

## 기술 상세 (Technical Details)

### 1. 토큰 정의 — `packages/styles/src/tokens.css`

```css
/* Breakpoints — Tailwind v4 기본값과 정렬.
   CSS @media 에서 직접 쓸 수 없음. 사용 가이드는 grid.stories.ts 참고. */
--dx-breakpoint-sm: 640px;
--dx-breakpoint-md: 768px;
--dx-breakpoint-lg: 1024px;
--dx-breakpoint-xl: 1280px;
--dx-breakpoint-2xl: 1536px;

/* Container max-widths — breakpoint 와 동일값 */
--dx-container-sm: 640px;
--dx-container-md: 768px;
--dx-container-lg: 1024px;
--dx-container-xl: 1280px;
--dx-container-2xl: 1536px;

/* Grid */
--dx-grid-columns: 12;
--dx-grid-gutter: var(--dx-space-6); /* 24px, 기존 spacing 토큰 재사용 */
```

### 2. Storybook 스토리 — `packages/storybook/stories/foundation/grid.stories.ts`

`title: 'Foundation/Grid'`, `tags: ['autodocs']`. 4개 stories:

#### 2.1 Breakpoints

5단계 표: 이름 · px · 대표 디바이스 · 사용 예시.

| 이름 | 값 | 대표 디바이스 | 용도 |
| --- | --- | --- | --- |
| sm | 640px | 모바일 가로 | 한 줄 레이아웃 시작점 |
| md | 768px | 태블릿 세로 | 2-column 레이아웃 분기 |
| lg | 1024px | 노트북 | 사이드바 노출 |
| xl | 1280px | 데스크탑 | 페이지 폭 확대 |
| 2xl | 1536px | 대형 모니터 | 최대 폭 도달 |

#### 2.2 Container

각 container max-width 를 회색 배경 + 중앙 정렬 박스로 시각화. 현재 뷰포트 크기에 따라 어느 container 가 활성화되는지 live 표시 (Storybook viewport toolbar 연동).

#### 2.3 Grid Overlay

12 columns + 24px gutter 를 오버레이(반투명 컬러 박스) 로 표시. 독자가 "gutter 가 이 정도 크기구나" 를 눈으로 확인 가능.

#### 2.4 Usage Guide

3가지 사용법 코드 예시를 4탭 코드 뷰(html/wc/thymeleaf/react) 대신 언어별 블록으로 제시 (토큰은 WC 가 아니라 스타일이므로 4탭 컨벤션 면제).

```css
/* 1. @media 리터럴 — 가장 흔한 경우 */
@media (min-width: 768px) {
  .my-layout {
    display: grid;
    grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
    gap: var(--dx-grid-gutter);
  }
}
```

```html
<!-- 2. Tailwind 유틸 — Tailwind 를 설치한 소비자 -->
<div class="md:grid md:grid-cols-12 md:gap-6">...</div>
```

```ts
// 3. JavaScript 참조 — 런타임 조회가 필요할 때
const md = parseInt(
  getComputedStyle(document.documentElement)
    .getPropertyValue('--dx-breakpoint-md'),
);
if (window.innerWidth >= md) { /* ... */ }
```

### 3. 문서 동기화

#### 3.1 `README.md`

"테마 커스터마이징" 섹션 또는 Storybook 바로가기 근처에 한 문단 추가:

> **Breakpoint 토큰** (`--dx-breakpoint-sm` 등) 은 Tailwind v4 기본값과 정렬됩니다. Tailwind 를 쓰는 소비자는 `md:` 접두사와 같은 지점에서 반응하고, Tailwind 를 쓰지 않는 소비자는 `@media (min-width: 768px)` 같은 리터럴 값을 직접 사용합니다. CSS 변수는 `@media` 인자로 직접 쓸 수 없다는 스펙 제약 때문입니다.

#### 3.2 `docs/architecture.md`

§6(또는 새 §7) 에 Grid 토큰의 철학 기록:

- 왜 토큰만 먼저 만들고 유틸/WC 는 뒤로 미루는가 (Foundation 의 목적, YAGNI).
- Tailwind 기본값과 정렬한 이유 (소비자 멘탈 모델 단순화).
- CSS 변수의 `@media` 한계에 대한 대응 (3가지 용도).

#### 3.3 `CLAUDE.md`

이번 변경으로 수정할 "핵심 규칙" 은 없다. 변경 불필요.

### 4. 검증 단계

1. **빌드:** `pnpm --filter @dx/styles build` → 성공 확인.
2. **토큰 노출 확인:** 빌드 결과 `dist/styles.css` 에 새 변수 5+5+2 = 12개가 포함되었는지 grep.
3. **Storybook 렌더링:** `pnpm --filter storybook dev` → `foundation/grid` 4개 스토리가 모두 에러 없이 렌더링.
4. **a11y 스캔:** Playwright MCP 로 `foundation-grid-*` 스토리에 axe 스캔 → violations 0개 (Storybook chrome 규칙 제외).
5. **기존 foundation 스토리 회귀 없음:** spacing, typography, colors, icons 4개 스토리도 함께 axe 스캔해 변경 영향 없는지 확인.

## 컴포넌트 영향 (Impact)

**직접 영향:** 없음. 이번 변경은 신규 토큰 추가이며 기존 토큰 이름/값을 바꾸지 않는다.

**향후 영향 (참고):**

- Molecules 단계에서 `FormField` 의 orientation 이 특정 breakpoint 이상에서만 horizontal 로 바뀌는 로직을 구현할 때 이 토큰의 값을 리터럴로 참조한다.
- Organisms 단계의 `Header` / `Nav` 반응형 동작 역시 동일 토큰을 기준으로 작성한다.

## 리스크 및 미결 이슈

- **사내 실사용 뷰포트와의 불일치 가능성:** 사내 B2C 서비스가 실제로 쓰는 디바이스 폭이 Tailwind 기본값과 맞지 않을 수 있다. 이 경우 서비스별 `theme.css` 에서 `--dx-breakpoint-*` 를 재정의할 수 있도록 설계되어 있어 리스크는 제한적.
- **CSS 변수 `@media` 한계 혼동:** 소비자가 `@media (min-width: var(--dx-breakpoint-md))` 를 시도하면 실패한다. Storybook Usage Guide 스토리와 README 문단에서 **반드시** 명시적으로 경고.

## 성공 기준

- [ ] `tokens.css` 에 12개 신규 변수 추가, 빌드 성공.
- [ ] `foundation/grid.stories.ts` 4개 스토리 렌더링 정상.
- [ ] axe 스캔 violations 0개.
- [ ] README 문단·architecture 문서 동기화 완료.
- [ ] 모든 변경이 한 커밋에 묶여 있음 (규칙 §6).
