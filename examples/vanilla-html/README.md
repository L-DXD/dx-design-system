# vanilla-html 예제

빌드 툴 없이 `<script type="module">` 로 `@dx/core` 번들과 `@dx/styles` 를 직접 로드하는 가장 단순한 예제.

## 실행

사전 요구: `@dx/styles` 와 `@dx/core` 가 빌드되어 있어야 함.

```bash
# 워크스페이스 루트에서
pnpm --filter @dx/styles build
pnpm --filter @dx/core build

# 그다음 이 디렉터리의 index.html 을 브라우저로 열기
open examples/vanilla-html/index.html
# 또는 임의의 static 서버로 서빙
npx http-server examples/vanilla-html -p 5173
```

## 구조

- `index.html` — Button / FormField / Badge / 다크모드 토글을 사용하는 단일 페이지
- 로컬 상대 경로(`../../packages/core/dist/...`) 로 워크스페이스 산출물 참조. 실제 서비스에서는 CDN 또는 서버가 서빙하는 경로로 교체.

## 핵심 포인트

- `ds-*` 태그를 HTML 에 직접 작성. React 래퍼 필요 없음.
- `@dx/styles/dist/styles.css` 한 번만 로드하면 토큰·다크모드 모두 동작.
- 이벤트는 `ds-change` 등 `ds-*` 접두사 사용 (Shoelace 원본 `sl-*` 는 노출되지 않음).
