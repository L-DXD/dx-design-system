# vanilla-html 예제

## 로드 리소스

- `@dx/styles/dist/styles-utilities.css` — 토큰 + 넓은 Tailwind utility safelist
- `https://unpkg.com/alpinejs@3` — Dialog 등 인터랙션 (선택)
- `@dx/elements/dist/dx-elements.mjs` — Light DOM Web Components

## 실행

```bash
# 루트에서
pnpm example:html
```

## Tailwind 오버라이드가 동작하는 조건

이 예제는 `styles-utilities.css` (safelist 포함) 을 로드하므로 `px-*`, `bg-*`, `rounded-*`,
`md:grid-cols-*` 등 safelist 범위의 Tailwind class 가 `<ds-*>` 에 걸렸을 때 tailwind-merge
로 내부 요소에 병합되어 적용됩니다.

서비스에 자체 Tailwind 빌드 파이프라인이 있다면 `content` 글롭에 HTML 템플릿을 포함시켜
`styles-utilities.css` 대신 자기 빌드 결과물을 쓰세요. 그러면 safelist 범위 바깥 class 도
자유롭게 사용 가능.

## 구성 섹션

1. 기본 사용 — 폼 atoms 조립
2. Token 오버라이드 — wrapper 의 `--primary` 등 CSS 변수만 재선언
3. Tailwind 오버라이드 — host 의 `class` 가 내부 요소에 tailwind-merge 로 병합
4. Dialog (Alpine.js) — native `<dialog>` + `x-show` 바인딩
