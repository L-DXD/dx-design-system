# DX Design System — Claude 작업 지침

## 프로젝트 개요

Shoelace(Lit Web Components) 기반 멀티 플랫폼 디자인 시스템. React/Next.js + Thymeleaf 동시 지원.

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

## Atomic Design 작업 순서

작업은 **반드시 아래 단계 순서대로** 진행한다. 상위 단계를 건너뛰고 하위 단계를 먼저 만들지 않는다.

1. **0단계 Foundation** — Color, Typography, Spacing & Grid, Icons
2. **1단계 Atoms** — Button, Input, Checkbox, Badge 등
3. **2단계 Molecules** — 검색 바(입력창+버튼), 폼 필드(라벨+입력창+오류)
4. **3단계 Organisms** — Header, Nav, Card List, Footer
5. **4단계 Templates** — 레이아웃 와이어프레임
6. **5단계 Pages** — 실제 콘텐츠 적용, 테스트

**중요:** 초기 셋업 과정에서 Atoms(Button, Input 등)를 먼저 구축한 상태이나, 이는 Shoelace 래핑 패턴 검증을 위한 것. Foundation이 완성되기 전까지 Atoms는 **임시 상태**로 취급하며, Foundation 완료 후 토큰 기반으로 재정비한다.

---

## 우려/리스크 관리

- **우선순위 경합**: 팀 내 과제로, B2C 사이트 등 우선순위 높은 개발 요청이 들어오면 이 프로젝트가 밀릴 수 있다. → 단계별 마일스톤을 작게 쪼개어 중단되더라도 배포 가능한 상태로 유지.
- **사내 인지도**: 이 디자인 시스템이 실제로 쓰이려면 "DX 기반으로 개발한다"는 인식이 사내에 퍼져야 한다. → 문서화와 실제 서비스 접목 사례가 핵심. Storybook 사이트, 4탭 코드 뷰, 사용 가이드를 꾸준히 업데이트.

---

## 핵심 규칙 (절대 어기지 말 것)

배경·예시·"왜 그렇게 결정했는가" 는 [`docs/architecture.md`](./docs/architecture.md) 참고. 여기서는 지켜야 할 **규칙만** 열거한다.

1. **Compound 패턴 준수** — 폼 컴포넌트에 `label` / `helperText` / `error` prop을 추가하지 않는다. 별도 컴포넌트(`<ds-label>`, `<ds-helper-text>`, `<ds-error-message>`)로 분리해서 `<ds-form-field>` 안에 조립한다. → [아키텍처 §1](./docs/architecture.md#1-compound-component-pattern)

2. **스타일 props 최소화** — `variant`/`color`/`size` 같은 스타일 prop은 추가하지 않는다. 의미적 variant(`primary`/`destructive`/`success`)만 허용. 구체 색상은 CSS Variables 로 제어. → [아키텍처 §2](./docs/architecture.md#2-headless-ui-철학)

3. **Shoelace 내장 label/help-text/error attribute 사용 금지** — `sl-input` 의 `label` prop 등은 쓰지 않는다. `ds-*` 는 핵심 동작만 상속하고 보조 컴포넌트는 직접 구현한다. → [아키텍처 §3](./docs/architecture.md#3-shoelace-래핑-원칙)

4. **이벤트는 `ds-*` 접두사** — Shoelace 컴포넌트를 래핑할 때 `connectedCallback` 에서 `remapEvents({ 'sl-X': 'ds-X' })` 로 재디스패치. 소비자·React 래퍼·스토리 모두 `ds-*` 만 구독. → [아키텍처 §4](./docs/architecture.md#4-이벤트-접두사-ds-)

5. **컴포넌트는 semantic 토큰만 사용** — `--dx-color-primary` 같은 semantic 토큰만 참조하고 primitive 팔레트(`--dx-palette-*`)를 직접 쓰지 않는다. 이렇게 해야 다크모드·테마 오버라이드가 자동 적용된다. → [아키텍처 §6](./docs/architecture.md#6-css-variables-기반-테마)

6. **Shadow DOM 기본값 유지** — `createRenderRoot` 를 오버라이드하지 않는다 (Shoelace 내부 스타일 보존). 유일한 예외는 `icon.ts` (Light DOM 렌더가 의도된 경우).

7. **접근성 이름 연결** — 외부 `<ds-label html-for>` 를 쓸 때 Shadow DOM 내부 컨트롤에도 이름이 연결되도록 `syncAccessibleName` 유틸을 `firstUpdated` 에서 호출한다 (`input`, `checkbox`, `toggle`, `select` 참고). 새 폼 컴포넌트 추가 시 동일 패턴 적용.

---

## 컴포넌트 추가 시 체크리스트

위 "핵심 규칙" 외에 새 컴포넌트를 만들 때 추가로 확인할 것:

- **React 래퍼**: `@lit/react` `createComponent` 로 생성하고 `events` 매핑에 `ds-*` 이름만 노출.
- **Storybook 스토리**: 4탭 코드 뷰(HTML/CSS · WC · Thymeleaf · React) 필수. 상태별 variation 최소 3개.
- **a11y**: 스토리의 Accessibility 패널 violations 0개 유지 (컴포넌트 레벨에서 수정, 스토리에서 우회 금지).

상세 절차는 아래 "작업 워크플로우" 참고.

---

## 작업 워크플로우

컴포넌트·토큰·스타일 등 **공개 API나 사용법에 영향을 주는 변경** 은 아래 순서를 빠짐없이 수행한다. 생략하면 Storybook · 소비자 문서 · 내부 지침이 금방 서로 어긋난다.

### 1. 구현

- `@dx/core` 에 Web Component 추가/수정 → 필요 시 `@dx/react` 래퍼 동기화.
- 토큰/스타일 변경은 `@dx/styles/src/tokens.css` 또는 관련 CSS에 반영.
- **공개 API(이벤트, slot, part, attribute, CSS 변수)를 바꾼 경우** 영향 범위를 주석으로 기록.

### 2. Storybook 스토리 작성·갱신

새 컴포넌트는 반드시 스토리를 추가하고, 기존 컴포넌트의 API가 바뀌었다면 스토리도 업데이트한다.

- 위치: `packages/storybook/stories/<atomic-level>/<name>.stories.ts` (예: `atoms/`, `molecules/`)
- 4탭 코드 스니펫 필수: `html` / `wc` / `thymeleaf` / `react`
- 상태별 variation 최소 3개: 기본, disabled/error 등 경계 상태, 조립(compose) 예시
- `autodocs` 태그 포함, `docs.description.component` 에 한글 설명 기재
- a11y 점검은 빌드 직후 별도 단계로 수행 (아래 4단계).

### 3. 빌드·검증

변경한 패키지와 그 하위 의존 패키지를 순서대로 빌드한다.

```bash
pnpm --filter @dx/styles build
pnpm --filter @dx/core build
pnpm --filter @dx/react build
```

의존 관계: `@dx/styles → @dx/core → @dx/react → storybook`. 상위를 바꿨다면 하위도 반드시 다시 빌드한다. Storybook dev 서버는 HMR 로 `@dx/core` 변경을 반영하지만, `@dx/styles` 는 PostCSS 빌드가 필요하므로 수동 재빌드해야 한다.

CI 가 있는 경우 테스트/타입체크/lint 가 모두 통과해야 한다.

### 4. 접근성(a11y) 점검 — 생략 금지

Storybook 의 **Accessibility 패널** 에서 axe-core violations 를 확인한다. 영향을 받은 스토리 전부에서 violations 0개가 기준이다.

- **점검 대상**: 새/수정된 컴포넌트 스토리 + 해당 컴포넌트를 포함하는 molecules/organisms 스토리. Foundation 변경(색상 토큰 등)이면 `foundation-*` 스토리와 Badge/Button 같이 해당 토큰을 쓰는 atoms 도 함께 점검.
- **자동 스캔 (권장)**: Playwright MCP 로 Storybook iframe을 순회하며 `axe.run()` 실행. 결과에서 Storybook chrome 관련 rule(`landmark-one-main`, `page-has-heading-one`, `region`, `frame-title`, `meta-viewport`)은 무시하고, 나머지 실제 violations 가 0 인지 확인한다.
- **위반이 나올 때**:
  - `color-contrast` → `@dx/styles` 의 토큰·override 에서 대비를 올린다 (badge 선례: 600 → 700 shade).
  - `label` / `label-title-only` → 컴포넌트의 `firstUpdated` 에서 `syncAccessibleName` 을 호출해 Shadow DOM 내부 컨트롤에 이름을 연결한다.
  - `heading-order` → 스토리의 heading 레벨을 h1→h2→h3 순서로 맞춘다.
  - **스토리 쪽에서 규칙을 disable 시켜 우회하지 않는다.** 원인을 컴포넌트/스타일 레이어에서 해결한다.
- 접근성 수정이 끝나면 변경된 패키지를 다시 빌드하고 axe 스캔을 반복해 0 violations 를 확인한다.

### 5. 문서 동기화 (자동 수행)

변경의 성격에 따라 **관련 문서를 같은 커밋에서** 함께 업데이트한다. 문서는 다음 네 갈래로 관리된다:

| 변경 유형                                   | 업데이트해야 하는 문서                                |
| ------------------------------------------- | ----------------------------------------------------- |
| 소비자가 쓰는 사용법/컴포넌트 API/테마 변수 | `README.md` (서비스 사용자 기준)                      |
| 아키텍처·구조적 결정                        | `docs/architecture.md`                                |
| 패키지 구조·워크플로우·컴포넌트 추가 방법   | `docs/contributing.md`                                |
| Claude 작업 지침 (본 문서의 원칙에 영향)    | `CLAUDE.md`                                           |
| 초기 설계·구현 로드맵 기록                  | `docs/superpowers/specs/` · `docs/superpowers/plans/` |

**원칙:**

- 새 `ds-*` 컴포넌트가 소비자에게 노출된다면 `README.md` 의 해당 환경(React/Thymeleaf/HTML) 예시에 추가.
- 아키텍처 결정(Compound 패턴, Shoelace 래핑 방식 등)을 바꾸었거나 새 패턴을 도입했다면 `docs/architecture.md` + `CLAUDE.md` 둘 다 갱신.
- 개발 프로세스/패키지 구조/빌드 방식이 바뀌면 `docs/contributing.md` 갱신.
- 문서 내 예시 코드 블록도 최신 API 와 일치해야 한다. 이전 예시가 더 이상 동작하지 않으면 그대로 두지 말고 수정한다.

### 6. 커밋

변경·스토리·문서 업데이트를 **하나의 커밋** 에 묶는다. 분리하면 "코드만 있고 문서 없는 리비전" 이 중간에 끼어 탐색이 어려워진다. 예:

```
feat(core): ds-avatar 컴포넌트 추가
  - @dx/core: DsAvatar 래핑 및 export
  - @dx/react: Avatar createComponent 래퍼
  - storybook: atoms/avatar.stories.ts (기본/사이즈/이미지 variation)
  - README / docs/contributing: 예시 목록 갱신
```

---

## 코드 스타일

- TypeScript strict 모드
- 컴포넌트 파일당 하나의 Web Component
- 주석은 **왜(Why)** 만 기록. 무엇(What)은 이름으로 드러낸다.
- 불필요한 추상화/폴백 금지 (YAGNI, DRY)

## 커밋 메시지

- **모든 커밋 메시지는 한글로 작성한다.**
- Conventional Commits 접두사는 영문 유지: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`.
- 제목은 한글로 간결하게, 본문이 필요하면 한글로 상세히 기술.
- 예시:
  - ✅ `feat(core): ds-icon 컴포넌트 추가 (Lucide 아이콘 렌더링)`
  - ✅ `fix(styles): Shadow DOM 비활성화로 인한 Shoelace 스타일 유실 수정`
  - ❌ `feat(core): add ds-icon component` (영문 제목 금지)

---

## 참고 문서

- 스펙: `docs/superpowers/specs/2026-04-17-dx-design-system-design.md`
- 플랜: `docs/superpowers/plans/2026-04-17-dx-design-system-implementation.md`
- Shoelace 공식 문서: https://shoelace.style/
- shadcn/ui (Compound 패턴 참고): https://ui.shadcn.com/
- Radix UI Primitives: https://www.radix-ui.com/primitives
