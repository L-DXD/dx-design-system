# 아키텍처

## 3 패키지 구조

### `@dx/styles`
- Tailwind v4 theme + semantic 토큰 CSS.
- 2 빌드 아웃풋:
  - `dist/styles.css` — 슬림 (토큰 + 실제 사용된 utility 만).
  - `dist/styles-utilities.css` — fat safelist 번들 (소비자가 Tailwind 빌드 없이도 임의 class 일부 사용 가능).
- shadcn 표준 변수명: `--primary`, `--background`, `--foreground`, 등.
- 3 브랜드: `primary` / `secondary` / `tertiary` + 각 `-foreground`.

### `@dx/ui`
- shadcn/ui React 컴포넌트. 공식 레시피 그대로 사용 + 자체 compound (`FormField`, `HelperText`, `ErrorMessage`) 추가.
- **baseClasses 는 `*.styles.ts` 로 분리**하여 `@dx/ui/styles/<name>` sub-path 로 export.
  - `@dx/elements` 가 동일 문자열을 import 하여 React 와 WC 스타일 일관성 보장.
- 구성: Button / Input / Label / Checkbox / Badge / FormField (compound).
- 복잡한 컴포넌트 (Dialog/Select/Popover/Tooltip/DropdownMenu/Toast/Tabs) 는 React 전용.

### `@dx/elements`
- Light DOM Web Components (Thymeleaf/HTML 전용).
- 6 atoms: `<ds-button>`, `<ds-input>`, `<ds-label>`, `<ds-badge>`, `<ds-helper-text>`, `<ds-error-message>`.
- 1 프로토타입: `<ds-dialog>` (native `<dialog>` + Alpine.js 통합).
- 동작 원리:
  1. `connectedCallback` 에서 `@dx/ui/styles/*` import 된 baseClasses + host 의 `class` 를 `tailwind-merge` 로 병합.
  2. 내부에 native 요소 (`<button>`/`<input>` 등) 를 Light DOM 으로 렌더.
  3. host 에 `display: contents` 로 시각적 투명화.
  4. control-level attribute (id, name, value, aria-*, etc.) 는 host 에서 inner 로 MOVE.
  5. `observedAttributes` + `attributeChangedCallback` 으로 class/variant/size 동적 변경 대응.
  6. `DOMContentLoaded` 지연 등록으로 parser race 회피.

## 왜 이 구조인가

1. **React 와 HTML/Thymeleaf 는 배포 모델이 다르다** (npm 모듈 vs. script 태그). 물리적 분리가 자연스럽다.
2. **shadcn + Light DOM WC = Tailwind 완전 호환.** v0.1.0 의 Shoelace Shadow DOM 접근법은 `<ds-input class="px-5">` 의 class 가 host padding 에만 적용돼 내부 박스가 변하지 않는 구조적 한계를 가졌다.
3. **토큰은 shadcn 표준을 따른다.** 커뮤니티 예제·문서 그대로 적용 가능. 브랜드 변경은 CSS 변수 1개 값만 바꾸면 opacity modifier (`primary/90`) 로 자동 전파.

## Thymeleaf `th:field` 주의

Thymeleaf `th:field` 는 tag name 기반 dispatch (`<input>`, `<select>`, `<textarea>`) 이므로 custom element `<ds-input>` 에서 fallthrough 해 `field="value"` 라는 잘못된 attribute 를 부착합니다.

**해결:** `th:value` + `name` 을 개별적으로 지정.

```html
<ds-input id="email" name="email" type="email" th:value="*{email}"/>
```

## 변경 이력 (History)

### v0.1.0 (폐기) — Shoelace Web Components

- Shoelace (Lit) 기반 `ds-*` 래퍼 15 개 + `@dx/react` 래퍼.
- **폐기 이유:**
  - Shadow DOM 과 Tailwind 오버라이드 구조적 충돌 (`<ds-input class="px-5">` → host padding 만 변함, 내부 박스 유지).
  - `@lit/react` 타입 체계 + Shoelace 라이브러리 타입 버그 누적.
  - 빌드 툴체인 복잡도 (PostCSS + Vite + @lit/react + tsc --emitDeclarationOnly + workspace 링크).
- `feat/v0.1.0-setup` 브랜치에 보존 (참고용).

### v0.2.0 — shadcn + Light DOM WC (현재)

- React 는 shadcn 공식 레시피, HTML/Thymeleaf 는 Light DOM WC.
- 토큰은 shadcn 표준 + 3 브랜드.
- 빌드 의존 순서: `@dx/styles → @dx/ui → @dx/elements`.
