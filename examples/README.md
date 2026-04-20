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
