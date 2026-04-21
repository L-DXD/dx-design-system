# DX Design System — Claude 작업 지침

## 프로젝트 개요

shadcn/ui 기반 멀티 플랫폼 디자인 시스템. React / Thymeleaf / HTML 3 환경 동시 지원.

**구조 (3 패키지):**
- `@dx/styles` — Tailwind v4 theme + semantic 토큰 CSS
- `@dx/ui` — shadcn/ui React 컴포넌트 (baseClasses 는 *.styles.ts 로 분리, sub-path export)
- `@dx/elements` — Light DOM Web Components (Thymeleaf/HTML 전용)

**목적:**
- 일관된 UX (Tailwind class 를 단일 진실 공급원)
- 3 환경 동일 시각 결과 (class 이름 공유)
- 브랜드 커스터마이징 (wrapper 의 `--primary` 등 CSS 변수 재선언)

## 핵심 원칙 (절대 어기지 말 것)

1. **React 는 `<ds-*>` 를 쓰지 않는다.** `@dx/ui` import 만 사용. 두 컴포넌트 체계를 섞지 않음.
2. **baseClasses 는 `@dx/ui/src/components/ui/*.styles.ts` 가 단일 진실 공급원.** `@dx/elements` 는 여기서만 import. 인라인으로 class 문자열을 중복 정의하지 않는다.
3. **Light DOM only (elements).** Shadow DOM 은 Tailwind 오버라이드와 충돌하므로 쓰지 않는다. `display: contents` + native 내부 요소.
4. **토큰은 shadcn 표준.** `--primary` / `--secondary` / `--tertiary` / `--destructive` 등. primitive 팔레트(`--dx-palette-*`) 금지. shade 가 필요하면 Tailwind opacity modifier (`primary/90`) 사용.
5. **Radix 의존 컴포넌트는 React 전용.** Dialog/Select/Popover/Tooltip/DropdownMenu/Toast/Tabs. HTML/Thymeleaf 는 Alpine.js 나 native `<select>`/`<details>` 로 대체. 예외: `ds-dialog` 하나는 Alpine.js 통합 프로토타입.
6. **Thymeleaf 는 `th:field` 불가.** custom element 에서 동작 안 함 (Task 1 검증). `th:value` + `name` 개별 지정 사용.
7. **변경 시 관련 문서 동시 갱신.** README / architecture / 본 CLAUDE.md / 예제 3 개.

## 컴포넌트 추가 체크리스트

1. `packages/ui` 에 shadcn CLI 로 설치 또는 공식 레시피 복사: `npx shadcn@latest add <name>`
2. class 문자열을 `*.styles.ts` 로 분리 (`@dx/elements` 가 import 할 수 있도록)
3. `package.json` `exports` 에 `./styles/<name>` 추가
4. `tsup.config.ts` entry 에 새 `.styles.ts` 추가
5. 간단 atom 이면 `@dx/elements/src/ds-<name>.ts` 작성 + `index.ts` 에 `define()` 추가
6. 복잡한 컴포넌트 (Radix 의존) 면 React 전용으로 둠
7. Storybook `stories/components/<name>.stories.tsx` + `<name>.mdx` (React/Thymeleaf/HTML 3 섹션 코드)
8. 예제 3 개 중 해당되는 곳에 시연 추가

## 빌드 의존 순서

```
@dx/styles  →  @dx/ui  →  @dx/elements  →  storybook / examples
```

`@dx/elements` 는 `@dx/ui/styles/*` sub-path 를 import 하므로 `@dx/ui` 를 반드시 먼저 빌드.

## 커밋 메시지

- **한글**로 작성
- Conventional Commits 접두사 영문 유지 (feat, fix, chore, docs, refactor, test, style, perf)
- 예: `feat(elements): ds-toggle 추가`

## 참고 문서

- 스펙: `docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md`
- 플랜: `docs/superpowers/plans/2026-04-20-shadcn-multiplatform.md`
- shadcn/ui: https://ui.shadcn.com
- Radix UI: https://www.radix-ui.com
- Alpine.js: https://alpinejs.dev
