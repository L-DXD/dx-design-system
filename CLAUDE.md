# DX Design System — Claude 작업 지침

## 프로젝트 개요

Shoelace(Lit Web Components) 기반 멀티 플랫폼 디자인 시스템. React/Next.js + Thymeleaf 동시 지원.

**모노레포 구조:**
- `@dx/core` — Shoelace 컴포넌트를 `ds-*` 접두사로 래핑한 Web Components
- `@dx/react` — `@lit/react` 기반 React 래퍼
- `@dx/styles` — CSS Variables + Tailwind + Shoelace 테마
- `storybook` — 4탭 코드 뷰 문서 사이트

---

## 핵심 설계 원칙

### 1. Compound Component Pattern (복합 컴포넌트 패턴)

**모든 폼 컴포넌트는 Compound 패턴을 따른다.** `label`, `helperText`, `error` 같은 부속 요소를 **prop으로 전달하지 않는다**. 대신 별도 컴포넌트로 분리하여 소비자가 조립(compose)한다.

#### ❌ 나쁜 예 (prop 기반)

```tsx
<Input label="이메일" helperText="회사 이메일을 입력하세요" error={errors.email} />
<Toggle label="알림 받기" />
```

#### ✅ 좋은 예 (Compound 패턴)

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

**왜 이렇게 해야 하는가:**
- **유연한 조립**: Label을 위/아래/좌/우 어디든 배치 가능. 여러 Label, 여러 HelperText도 가능.
- **스타일 자유도**: 각 조각의 스타일을 소비자가 완전히 제어.
- **접근성 명시**: `htmlFor`/`id`로 연결 관계가 명확. ARIA 속성도 개별 제어.
- **shadcn/Radix UI 멘탈 모델**: React 개발자에게 익숙한 패턴.

### 2. Headless UI 철학

컴포넌트는 **동작(behavior)**과 **스타일(style)**을 분리한다.

- **동작 레이어** (`@dx/core`): 접근성, 키보드 네비게이션, 상태 관리. 최소한의 기본 스타일만 포함 (Shoelace 상속).
- **스타일 레이어**: CSS Variables 오버라이드, `::part()` CSS, 외부 Tailwind 클래스로 제어.

**구체적인 규칙:**
- 컴포넌트 API에 `variant`, `color`, `size` 같은 스타일 props는 최소화
- 필요 시 **의미적 variant**(`primary`, `destructive`, `success`)만 제공하고, 구체적 색상은 CSS Variables로
- 레이아웃은 **소비자의 책임** (`FormField`, `Stack`, 플레이너 div 등으로 조립)

### 3. Shoelace 래핑 원칙

Shoelace는 "batteries included"(label/help-text 내장) 철학이라 Compound 패턴과 충돌한다. 원칙:

- **인터랙티브 핵심 로직만 상속**: `ds-input`은 Shoelace의 `sl-input`을 상속하되, 내장 `label` 슬롯은 **사용하지 않는다**.
- **Compound 보조 컴포넌트는 직접 구현**: `Label`, `FormField`, `HelperText`, `ErrorMessage` 등은 Shoelace에 의존하지 않는 별도 Web Component / React 컴포넌트로 작성.
- **Shoelace 내장 label/help-text/error attribute는 사용 금지**: prop 기반 label은 이 DS의 철학에 어긋남.

### 4. 이벤트 접두사 `ds-`

Shoelace의 `sl-*` 이벤트는 `remapEvents` 유틸로 `ds-*`로 재디스패치한다. 소비자는 항상 `ds-*` 이벤트만 구독.

---

## 컴포넌트 추가 시 체크리스트

1. **API 설계**: Compound 패턴으로 분해 가능한가? label/helperText가 props에 섞여있지 않은가?
2. **Shoelace 상속**: 핵심 동작은 Shoelace 상속. 부속 요소는 별도 컴포넌트.
3. **이벤트**: `sl-*` → `ds-*` 재매핑 `connectedCallback`에 추가.
4. **React 래퍼**: `@lit/react` `createComponent`, 이벤트는 `ds-*` 이름으로 노출.
5. **Storybook 스토리**: 4탭 코드 뷰(HTML/CSS/WC/Thymeleaf/React) + 다양한 조립 예시.
6. **Shadow DOM**: 기본값(유지). `createRenderRoot`를 오버라이드하지 않는다.

---

## 코드 스타일

- TypeScript strict 모드
- 컴포넌트 파일당 하나의 Web Component
- 주석은 **왜(Why)** 만 기록. 무엇(What)은 이름으로 드러낸다.
- 불필요한 추상화/폴백 금지 (YAGNI, DRY)

---

## 참고 문서

- 스펙: `docs/superpowers/specs/2026-04-17-dx-design-system-design.md`
- 플랜: `docs/superpowers/plans/2026-04-17-dx-design-system-implementation.md`
- Shoelace 공식 문서: https://shoelace.style/
- shadcn/ui (Compound 패턴 참고): https://ui.shadcn.com/
- Radix UI Primitives: https://www.radix-ui.com/primitives
