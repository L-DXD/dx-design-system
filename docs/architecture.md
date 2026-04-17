# 아키텍처

DX Design System을 구성하는 구조적 결정과 상세 원리. `CLAUDE.md` 의 규칙이 "무엇을 지켜야 하는가" 라면, 이 문서는 "왜 그렇게 결정했는가" 와 "어떻게 동작하는가" 를 다룬다.

---

## 목차

- [1. Compound Component Pattern](#1-compound-component-pattern)
- [2. Headless UI 철학](#2-headless-ui-철학)
- [3. Shoelace 래핑 원칙](#3-shoelace-래핑-원칙)
- [4. 이벤트 접두사 `ds-`](#4-이벤트-접두사-ds-)
- [5. 멀티 플랫폼 (Write Once, Use Everywhere)](#5-멀티-플랫폼-write-once-use-everywhere)
- [6. CSS Variables 기반 테마](#6-css-variables-기반-테마)
- [7. 다크모드](#7-다크모드)

---

## 1. Compound Component Pattern

**모든 폼 컴포넌트는 Compound 패턴을 따른다.** `label`, `helperText`, `error` 같은 부속 요소를 prop으로 전달하지 않는다. 별도 컴포넌트로 분리하여 소비자가 조립(compose)한다.

### ❌ 나쁜 예 (prop 기반)

```tsx
<Input label="이메일" helperText="회사 이메일을 입력하세요" error={errors.email} />
<Toggle label="알림 받기" />
```

### ✅ 좋은 예 (Compound 패턴)

```tsx
<FormField>
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" />
  <HelperText>회사 이메일을 입력하세요</HelperText>
  <ErrorMessage>{errors.email}</ErrorMessage>
</FormField>

<FormField orientation="horizontal">
  <Toggle id="notify" />
  <Label htmlFor="notify">알림 받기</Label>
</FormField>
```

### 왜 이렇게 해야 하는가

- **유연한 조립**: Label을 위/아래/좌/우 어디든 배치 가능. 여러 Label, 여러 HelperText도 가능.
- **스타일 자유도**: 각 조각의 스타일을 소비자가 완전히 제어.
- **접근성 명시**: `htmlFor`/`id` 로 연결 관계가 코드에 드러남. ARIA 속성도 개별 제어.
- **shadcn/Radix UI 멘탈 모델**: React 개발자에게 익숙한 패턴.

---

## 2. Headless UI 철학

컴포넌트는 **동작(behavior)** 과 **스타일(style)** 을 분리한다.

- **동작 레이어** (`@dx/core`): 접근성, 키보드 네비게이션, 상태 관리. 최소한의 기본 스타일만 포함 (Shoelace 상속).
- **스타일 레이어**: CSS Variables 오버라이드, `::part()` CSS, 외부 Tailwind 클래스로 제어.

**구체적인 규칙:**

- 컴포넌트 API에 `variant`, `color`, `size` 같은 스타일 props는 최소화.
- 필요 시 **의미적 variant**(`primary`, `destructive`, `success`)만 제공하고, 구체적 색상은 CSS Variables로.
- 레이아웃은 **소비자의 책임** (`FormField`, `Stack`, 플레이너 div 등으로 조립).

---

## 3. Shoelace 래핑 원칙

Shoelace는 "batteries included"(label/help-text 내장) 철학이라 Compound 패턴과 충돌한다. 그래서 선택적으로 상속한다.

- **인터랙티브 핵심 로직만 상속**: `ds-input` 은 Shoelace의 `sl-input` 을 상속하되, 내장 `label` 슬롯은 **사용하지 않는다**.
- **Compound 보조 컴포넌트는 직접 구현**: `Label`, `FormField`, `HelperText`, `ErrorMessage` 등은 Shoelace에 의존하지 않는 별도 Web Component / React 컴포넌트로 작성.
- **Shoelace 내장 label/help-text/error attribute는 사용 금지**: prop 기반 label은 이 DS의 철학에 어긋남.

### 접근성 이름 동기화

외부 `<ds-label html-for="X">` 가 커스텀 엘리먼트 호스트를 가리키면, Shadow DOM 내부 `<input>` 에는 자동으로 연결되지 않는다. `packages/core/src/utils/sync-accessible-name.ts` 가 `firstUpdated` 시점에 호스트의 `id` 와 매칭되는 `<ds-label>` 텍스트를 찾아 내부 컨트롤의 `aria-label` 로 반영하고 빈 `title=""` 를 제거한다.

---

## 4. 이벤트 접두사 `ds-`

Shoelace의 `sl-*` 이벤트는 `packages/core/src/utils/remap-events.ts` 로 `ds-*` 로 재디스패치한다. 소비자는 항상 `ds-*` 이벤트만 구독한다.

```ts
connectedCallback() {
  super.connectedCallback();
  remapEvents(this, { 'sl-input': 'ds-input', 'sl-change': 'ds-change' });
}
```

React 래퍼는 `createComponent` 의 `events` 매핑에서도 `ds-*` 이름을 사용한다.

---

## 5. 멀티 플랫폼 (Write Once, Use Everywhere)

하나의 Web Component를 세 가지 환경에서 동일하게 사용할 수 있다:

| 환경 | 사용 방식 |
|------|----------|
| **React/Next.js** | `import { Button } from '@dx/react'` |
| **Thymeleaf** | `<ds-button th:attr="...">[[#{...}]]</ds-button>` |
| **순수 HTML** | `<ds-button>` 태그 그대로 사용 |

빌드 산출물은 두 가지:

- `@dx/core/dist/index.js` — ESM, tree-shakeable (번들러가 있는 환경용)
- `@dx/core/dist/dx-core.bundle.js` — 단일 파일, CDN 로드용 (Thymeleaf/순수 HTML 용)

---

## 6. CSS Variables 기반 테마

서비스별 브랜드/다크모드는 CSS Variables 오버라이드만으로 적용된다. Shadow DOM 내부까지 자동 전파되므로 컴포넌트마다 재정의할 필요가 없다.

```css
:root {
  --dx-color-primary: var(--color-indigo-600);
}
```

토큰 계층:

- **Primitive 팔레트** (`--dx-palette-*-{50..950}`): DS 내부용 원시 값. 서비스가 직접 참조하지 않는다.
- **Semantic 토큰** (`--dx-color-primary`, `--dx-color-foreground` 등): 역할 기반. 컴포넌트와 서비스는 이 토큰만 쓴다.

서비스 테마는 semantic 토큰만 오버라이드한다. 상세 가이드는 `README.md` 의 "테마 커스터마이징" 참고.

---

## 7. 다크모드

CSS Variables 기반 다크모드. 세 가지 활성화 방식을 지원한다.

1. **명시적 클래스** (권장, Tailwind 호환): `<html class="dark">` 또는 하위 스코프에 `.dark` 클래스.
2. **data attribute**: `<html data-theme="dark">` — Thymeleaf 친화적.
3. **OS 자동 감지**: `.light` / `.dark` / `data-theme` 없으면 `prefers-color-scheme` 따름.

### 원칙

- Primitive 팔레트(`--dx-palette-*`)는 고정. 라이트/다크 공통.
- Semantic 토큰(`--dx-color-*`)만 다크모드에서 재정의.
- Shoelace의 `--sl-color-neutral-*` 스케일도 함께 반전 (0 ↔ 950).
- 컴포넌트는 항상 semantic 토큰만 사용해야 자동으로 다크모드 대응됨.

### 예시

```html
<!-- Thymeleaf -->
<html th:attr="data-theme=${userTheme}">
  <body>
    <ds-button variant="primary">저장</ds-button>
  </body>
</html>
```

```tsx
// React/Next.js
<html className={theme === 'dark' ? 'dark' : 'light'}>
```
