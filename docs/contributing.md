# 기여 가이드

## 개발 환경

- Node 20+
- pnpm 10+
- Java 17+ (Thymeleaf 예제 검증용, 선택)

## 모노레포 구조

```
packages/
├── styles/      Tailwind theme + 토큰 CSS
├── ui/          shadcn/ui React 컴포넌트
├── elements/    Light DOM Web Components
└── storybook/   문서 사이트

examples/
├── react-nextjs/
├── vanilla-html/
└── thymeleaf-spring/
```

## 빌드

**의존 순서대로:**

```bash
pnpm install
pnpm --filter @dx/styles build
pnpm --filter @dx/ui build
pnpm --filter @dx/elements build
pnpm --filter storybook build
```

각 예제:
- `pnpm --filter @dx-examples/react-nextjs dev` (포트 3001)
- `pnpm example:html` (순수 HTML 로컬 서버)

## 컴포넌트 추가

### 간단 atom (Button 같은 타입)

1. **shadcn CLI:**
   ```bash
   cd packages/ui
   npx shadcn@latest add toggle
   ```

2. **class 문자열 분리:**
   - `packages/ui/src/components/ui/toggle.styles.ts` 신규 — baseClasses + variant 맵 export
   - `toggle.tsx` 를 `.styles.ts` import 하도록 수정

3. **sub-path export:**
   - `packages/ui/package.json` `exports` 에 `./styles/toggle` 추가
   - `packages/ui/tsup.config.ts` entry 에 `'styles/toggle': 'src/components/ui/toggle.styles.ts'` 추가

4. **Web Component:**
   - `packages/elements/src/ds-toggle.ts` 작성 (DxElement 상속 + baseClasses import)
   - `packages/elements/src/index.ts` 에 `define('ds-toggle', DsToggle)` 추가

5. **Storybook:**
   - `packages/storybook/stories/components/toggle.stories.tsx`
   - `packages/storybook/stories/components/toggle.mdx` — React / Thymeleaf / HTML 3 섹션

6. **예제에 시연 (선택):**
   - `examples/react-nextjs/app/page.tsx`
   - `examples/vanilla-html/index.html`
   - `examples/thymeleaf-spring/src/main/resources/templates/signup.html`

### 복잡한 컴포넌트 (Dialog/Select 등 Radix 의존)

- React 전용으로만 추가 (`@dx/elements` 에는 포함하지 않음).
- Storybook MDX 에 "HTML/Thymeleaf 대안: native `<select>`, Alpine.js" 로 안내.
- 예외: `ds-dialog` 처럼 native HTML element 기반으로 Light DOM 구현 가능하면 `@dx/elements` 에 프로토타입 추가 허용.

## 커밋 메시지

- **한글** 작성
- Conventional Commits 접두사 영문 (`feat`, `fix`, `docs`, `refactor`, `chore`)
- 예: `feat(elements): ds-toggle 추가`

## 리뷰 체크리스트

새 컴포넌트 PR:

- [ ] `@dx/ui/styles/<name>.ts` 생성 + sub-path export
- [ ] `@dx/elements/ds-<name>.ts` (atom 인 경우)
- [ ] Storybook stories + MDX (3 섹션 코드)
- [ ] 예제 3 개에 시연 (해당되는 경우)
- [ ] 빌드 의존 순서대로 전체 `pnpm build` 성공
- [ ] 다크모드 시각 점검
- [ ] `pnpm example:react` / `example:html` 브라우저 확인
- [ ] CLAUDE.md / README / architecture 영향 없는지 확인

## 참고

- 스펙: `docs/superpowers/specs/2026-04-20-shadcn-multiplatform-design.md`
- 플랜: `docs/superpowers/plans/2026-04-20-shadcn-multiplatform.md`
