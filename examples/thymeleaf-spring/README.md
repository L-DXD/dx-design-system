# thymeleaf-spring 예제

Spring Boot + Thymeleaf 에서 DX Design System 을 쓰는 최소 예제.

> **주의:** 이 디렉터리는 **템플릿·정적 리소스만** 포함한다. JVM/Gradle 빌드는 소비자 서비스에서 각자 구성한다. Node 워크스페이스와 빌드 흐름이 달라 pnpm 에 편입되지 않는다.

## 실행 가이드

1. 일반적인 Spring Boot 프로젝트를 생성한다 (`spring-initializr` 등, `spring-boot-starter-thymeleaf` 의존성 포함).
2. 이 디렉터리의 `src/main/resources/templates/` 아래 파일들을 프로젝트에 복사한다.
3. `src/main/resources/static/` 에 `@dx/core` 번들과 `@dx/styles` CSS 를 복사하거나, `templates/layout.html` 의 CDN 경로를 그대로 쓴다.

```bash
# 워크스페이스 루트에서 빌드 산출물을 static/ 으로 복사하는 예
pnpm --filter @dx/core build
pnpm --filter @dx/styles build

cp packages/core/dist/dx-core.bundle.js \
   <your-spring-project>/src/main/resources/static/js/
cp packages/styles/dist/styles.css \
   <your-spring-project>/src/main/resources/static/css/
```

4. Spring Boot 앱 실행 후 `/signup` (또는 매핑한 경로) 접속.

## 구조

- `src/main/resources/templates/layout.html` — `@dx/styles` 로드, 레이아웃 fragment
- `src/main/resources/templates/signup.html` — 회원가입 폼 (Thymeleaf `th:object`, `th:errors` 사용)

## 핵심 포인트

- **Thymeleaf 는 서버 렌더:** `<ds-*>` 태그는 브라우저에서 Web Component 로 업그레이드되기 전까지는 그냥 HTML 태그. 서버가 보낸 텍스트 콘텐츠는 `<slot>` 으로 흘러 들어간다.
- **폼 바인딩:** `th:field="*{email}"` 을 `<ds-input>` 에 그대로 쓸 수 있다. Shoelace 의 form participation 이 `ds-*` 래퍼에서도 보존된다.
- **에러 표시:** `<ds-error-message th:if="${#fields.hasErrors('email')}" th:errors="*{email}">` 로 Spring validation 결과를 바로 렌더.
- **다크모드:** `<html data-theme="...">` 에 유저 설정을 Thymeleaf 로 주입하면 서버 렌더 시점에 다크/라이트를 결정할 수 있다.

## Tailwind 오버라이드 패턴 (선택)

React 는 `cn()` (clsx + tailwind-merge) 유틸로 class 를 병합하지만, Thymeleaf 는 **서버 사이드 속성 조립** 으로 동일한 효과를 낸다. `signup.html` 하단 섹션에 4가지 패턴 예시가 있다.

| 패턴 | Thymeleaf 문법 | 용도 |
| --- | --- | --- |
| 정적 | `class="w-full"` | 항상 적용되는 class |
| 조건부 추가 | `th:classappend="${hasError} ? 'ring-2 ring-red-500'"` | 기본 class 를 유지하면서 조건부로 추가 |
| 동적 (리터럴 치환) | `th:class="\|w-full ${size}\|"` | Model 값을 class 문자열에 끼워넣기 |
| 동적 (삼항) | `th:variant="${isPrimary ? 'primary' : 'secondary'}"` | ds-* variant attribute 자체를 분기 |

### Spring Boot 에서 Tailwind 빌드

Tailwind 유틸 클래스를 쓰려면 Spring Boot 프로젝트에서 Tailwind CSS 를 별도로 빌드해 `static/css/tailwind.css` 에 떨어뜨린다. `@dx/styles` 는 DS 내부 스타일만 포함하므로 소비자 마크업의 `md:grid-cols-12` 같은 유틸은 소비자 프로젝트가 직접 생성해야 한다.

```js
// <project>/tailwind.config.js
export default {
  content: ['./src/main/resources/templates/**/*.html'],
};
```

`layout.html` 에서 `<link rel="stylesheet" th:href="@{/css/tailwind.css}" />` 로 로드.
