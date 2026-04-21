# thymeleaf-spring 예제

Spring Boot + Thymeleaf 에서 DX Design System 사용 예.

## 의존성 배치

DS 산출물을 Spring 프로젝트의 static 디렉터리로 복사:

```bash
# 루트에서 DS 빌드
pnpm --filter @dx/styles build
pnpm --filter @dx/elements build

# Spring 프로젝트로 복사
cp packages/styles/dist/styles-utilities.css <spring-project>/src/main/resources/static/css/
cp packages/elements/dist/dx-elements.mjs <spring-project>/src/main/resources/static/js/
```

`layout.html` 에서 `th:href="@{/css/styles-utilities.css}"` 와 `th:src="@{/js/dx-elements.mjs}"` 로 로드.

## ⚠ th:field 사용 불가

Thymeleaf 의 `th:field` 는 `<input>`/`<select>`/`<textarea>` 태그만 인식합니다. `<ds-input>` 같은 custom element 에 `th:field` 를 걸면 fallthrough 로 동작해 `<ds-input field="value">` 라는 잘못된 속성이 생성됩니다.

**대신 아래 패턴을 사용:**

```html
<!-- ✅ 정상 -->
<ds-input id="email"
          name="email"
          type="email"
          th:value="*{email}"/>

<!-- ❌ 동작하지 않음 -->
<ds-input th:field="*{email}" type="email"/>
```

에러 메시지는 `th:errors` 그대로 가능 (`<ds-error-message>` 에):

```html
<ds-error-message th:if="${#fields.hasErrors('email')}"
                  th:errors="*{email}"></ds-error-message>
```

## Tailwind 오버라이드 3 경로

| 환경 | CSS 로드 | 자유도 |
| --- | --- | --- |
| Spring + 자체 Tailwind 빌드 | 자기 `tailwind.css` | 무제한 |
| Spring + safelist 번들 | `@dx/styles/dist/styles-utilities.css` | safelist 범위 |
| CDN | `https://cdn.jsdelivr.net/...` | 위와 동일 |

## 파일 구조

- `src/main/resources/templates/layout.html` — 공통 레이아웃 (head, body wrapper)
- `src/main/resources/templates/signup.html` — 회원가입 폼 fragment

## 핵심 포인트

- Spring Boot 가 render 한 HTML 을 브라우저에서 `@dx/elements` 가 upgrade → `<ds-input>` 안에 `<input>` 이 생성됨.
- form submit 은 내부 `<input name="email">` 이 참여 → 일반 Spring controller 가 그대로 받음.
- Alpine.js 는 `x-on:click`, `x-show`, `x-data` 로 Thymeleaf 속성과 공존.
