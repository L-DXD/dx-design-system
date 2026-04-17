# DX Design System — Claude 작업 지침

## 프로젝트 개요

Shoelace(Lit Web Components) 기반 멀티 플랫폼 디자인 시스템. React/Next.js + Thymeleaf 동시 지원.

**담당자:**
- 주담당: 민경미
- 부담당: 이자영 (개발 환경 셋팅, Foundation, Atoms, 인프라)

**목적/목표 (내부 서비스):**
- 일관된 사용자 경험(UX) 제공
- 작업 생산성 및 효율성 극대화
- 개발 요청 시 원활한 커뮤니케이션
- 재사용 가능한 표준 요소 정의 → 유지보수 비용 절감
- 새로운 시스템 개발 시마다 반복되는 스타일 재정의 리소스 낭비 방지

**모노레포 구조:**
- `@dx/core` — Shoelace 컴포넌트를 `ds-*` 접두사로 래핑한 Web Components
- `@dx/react` — `@lit/react` 기반 React 래퍼
- `@dx/styles` — CSS Variables + Tailwind + Shoelace 테마
- `storybook` — 4탭 코드 뷰 문서 사이트

---

## Atomic Design 로드맵 (2026년)

작업은 **반드시 아래 단계 순서대로** 진행한다. 상위 단계를 건너뛰고 하위 단계를 먼저 만들지 않는다.

| 월 | 담당 | 단계 | 내용 |
|----|------|------|------|
| 4월 | 자영 | **개발 환경 셋팅** | React, Vite, Storybook, Tailwind, CLAUDE.md |
| 5월 | 자영 | **0단계 Foundation** | Color, Typography, Spacing & Grid, Icons |
| 5월 | 경미 | 학습 | React.js, Next.js 학습 |
| 6월 | 자영 | **1단계 Atoms** | Button, Input, Checkbox, Badge 등 |
| 6월 | 경미 | 리서치 | 패턴 수집 |
| 7월 | 경미 | **2단계 Molecules** | 검색 바(입력창+버튼), 폼 필드(라벨+입력창+오류) |
| 8월 | 경미 | **3단계 Organisms** | Header, Nav, Card List, Footer |
| 9월 | 경미 | **4단계 Templates** | 레이아웃 와이어프레임 |
| 10월 | 경미 | **5단계 Pages** | 실제 콘텐츠 적용, 테스트 |
| 11월 | 경미 | 문서화 마무리 | — |
| 11월 | 자영 | 배포 | MCP 구축 또는 npm 패키지 배포 |
| 12월 | — | 완성 | 실제 서비스 접목 |

**현재 시점(2026-04):** 4월 개발 환경 셋팅 단계. 5월부터 0단계 Foundation에 집중.

**중요:** 초기 셋업 과정에서 Atoms(Button, Input 등)를 먼저 구축한 상태이나, 이는 Shoelace 래핑 패턴 검증을 위한 것. Foundation이 완성되기 전까지 Atoms는 **임시 상태**로 취급하며, Foundation 완료 후 토큰 기반으로 재정비한다.

---

## 우려/리스크 관리

- **우선순위 경합**: 팀 내 과제로, B2C 사이트 등 우선순위 높은 개발 요청이 들어오면 이 프로젝트가 밀릴 수 있다. → 단계별 마일스톤을 작게 쪼개어 중단되더라도 배포 가능한 상태로 유지.
- **사내 인지도**: 이 디자인 시스템이 실제로 쓰이려면 "DX 기반으로 개발한다"는 인식이 사내에 퍼져야 한다. → 문서화와 실제 서비스 접목 사례가 핵심. Storybook 사이트, 4탭 코드 뷰, 사용 가이드를 꾸준히 업데이트.

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
