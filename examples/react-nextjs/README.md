# react-nextjs 예제

Next.js 15 App Router 환경에서 `@dx/react` 래퍼를 쓰는 최소 예제.

## 실행

```bash
# 워크스페이스 루트에서 전 패키지 빌드 (최초 1회)
pnpm --filter @dx/styles build
pnpm --filter @dx/core build
pnpm --filter @dx/react build

# 이 예제 개발 서버 실행 (포트 3001)
pnpm --filter @dx-examples/react-nextjs dev
```

브라우저에서 <http://localhost:3001> 접속.

## 구조

- `app/layout.tsx` — RSC. `@dx/styles` 를 한 번만 import.
- `app/page.tsx` — RSC. 레이아웃과 정적 콘텐츠.
- `app/signup-form.tsx` — `'use client'` leaf. Web Component 를 쓰는 부분만 클라이언트 분리.
- `next.config.ts` — `@dx/core`, `@dx/react` 를 `transpilePackages` 에 등록.

## 핵심 포인트

- **SSR 안전 패턴:** Web Component 는 브라우저 API 에 의존하므로 레이아웃/페이지는 RSC 로 두고, `@dx/react` 를 쓰는 leaf 만 `'use client'` 로 분리한다.
- **이벤트 네이밍:** React 래퍼는 `ds-input` 이벤트를 `onDsInput` prop 으로 노출한다 (`ds-*` → `onDs*` 카멜케이스).
- **Compound 패턴:** `<Label>`, `<Input>`, `<HelperText>` 를 `<FormField>` 로 감싸 조립한다. `<Input label="...">` 처럼 prop 으로 넣지 않는다.
