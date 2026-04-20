# Examples

DX Design System 을 실제 환경에서 쓰는 최소 참조 예제 모음.

각 예제는 **복붙해서 돌려볼 수 있는 작은 앱** 이며, Storybook 4탭 코드 뷰(복사 전용) 와는 역할이 다르다.

| 디렉터리 | 환경 | 실행 (루트에서) |
| --- | --- | --- |
| [`vanilla-html/`](./vanilla-html) | 빌드 툴 없이 `<script type="module">` 로 직접 로드 | `pnpm example:html` |
| [`react-nextjs/`](./react-nextjs) | Next.js 15 App Router + `@dx/react` | `pnpm example:react` |
| [`thymeleaf-spring/`](./thymeleaf-spring) | Spring Boot + Thymeleaf (템플릿만, JVM 빌드는 각자) | `pnpm example:thymeleaf` (안내) |

## 사전 준비

각 예제는 워크스페이스의 빌드 산출물에 의존합니다. 최초 1회 다음 명령을 실행하세요.

```bash
pnpm install
pnpm --filter @dx/styles build
pnpm --filter @dx/core build
pnpm --filter @dx/react build
```

## Thymeleaf 가 별도 취급인 이유

Spring Boot 는 JVM + Gradle 로 빌드되므로 pnpm workspace 에 편입되지 않습니다. `examples/thymeleaf-spring/` 은 **템플릿·정적 리소스만** 제공하고, 소비자 서비스가 각자의 Spring Boot 프로젝트에 복사해 쓰는 방식입니다.

## 각 예제의 3섹션 구성

프레임워크별 사용법을 **기본 / Token 오버라이드 / Tailwind 오버라이드** 세 단계로 보여줍니다.

| 섹션 | 목적 | 환경별 구현 |
| --- | --- | --- |
| **1. 기본** | DX 기본 토큰 그대로 사용 | 모두 동일 |
| **2. Token 오버라이드** | 서비스 브랜드 컬러로 `--dx-color-*` semantic 토큰 재선언 | React: 인라인 `style={{ '--dx-color-primary': '#8b5cf6' }}`  ·  Thymeleaf/HTML: `<style>` 의 `.brand-purple { --dx-color-primary: ... }` + `class="brand-purple"` |
| **3. Tailwind 오버라이드** | 호스트 레벨 유틸(width/margin/shadow) | React: `className={cn("w-full", className)}`  ·  Thymeleaf: `class` / `th:classappend` / `th:class="\|...\|"`  ·  HTML: `class` / `element.classList.toggle()` |

### Token 오버라이드 주의

- `--dx-color-primary` 같은 **semantic** 토큰만 재선언. primitive 팔레트(`--dx-palette-*`) 는 DS 내부용.
- 페이지 전체 재테마는 서비스 `theme.css` 에 `:root` 로 선언 후 `@dx/styles` 다음 순서로 로드.
- 특정 구역만 재테마는 wrapper 에 class / 인라인 style 로 스코프 제한.
- 다크모드도 따로 오버라이드하려면 `.dark .brand-xxx { ... }` 로 분기.

### Tailwind 오버라이드 주의

- `ds-*` 호스트 요소에 class 를 걸면 호스트 레벨 속성(width, margin, position, display, shadow) 은 바로 반영.
- **내부 Shadow DOM** 요소(`<ds-input>` 내부 `<input>`) 는 Tailwind 로 못 건드림. Shoelace 의 `::part()` 또는 `--dx-*` 토큰 오버라이드 사용.
