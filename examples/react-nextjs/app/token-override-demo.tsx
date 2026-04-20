"use client";

import { Badge, Button, Checkbox, FormField, Input, Label } from "@dx/react";

/**
 * Token 오버라이드 예시.
 *
 * - 서비스마다 브랜드 컬러가 달라 `--dx-color-primary` 같은 semantic 토큰을 재선언.
 * - 스코프 범위를 좁히려면 특정 wrapper 에만 class / 인라인 style 로 씌운다.
 * - 페이지 전체에 적용하려면 서비스의 `theme.css` 에서 `:root` 스코프로 선언 후
 *   `@dx/styles` 다음 순서로 로드.
 * - primitive 팔레트(`--dx-palette-*`) 는 건드리지 말고 semantic(`--dx-color-*`) 만 override.
 */

// 보라 브랜드 — 인라인 CSS 변수로 섹션만 재테마
const purpleBrand: React.CSSProperties = {
  "--dx-color-primary": "#8b5cf6",
  "--dx-color-primary-hover": "#7c3aed",
  "--dx-color-primary-foreground": "#ffffff",
  "--dx-color-primary-subtle": "#ede9fe",
  "--dx-color-ring": "#8b5cf6",
} as React.CSSProperties;

// 에메랄드 브랜드
const emeraldBrand: React.CSSProperties = {
  "--dx-color-primary": "#10b981",
  "--dx-color-primary-hover": "#059669",
  "--dx-color-primary-foreground": "#ffffff",
  "--dx-color-primary-subtle": "#d1fae5",
  "--dx-color-ring": "#10b981",
} as React.CSSProperties;

export function TokenOverrideDemo() {
  return (
    <section className="flex flex-col gap-4 p-6 rounded-xl border border-[color:var(--dx-color-border)]">
      <h2 className="text-xl font-semibold">Token 오버라이드</h2>
      <p className="text-sm text-[color:var(--dx-color-muted-foreground)]">
        같은 컴포넌트를 3개의 다른 브랜드 테마로 렌더. wrapper 에 CSS 변수만
        재선언하면 내부의 모든 ds-* 컴포넌트가 새 색을 따라간다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 기본 (DX 기본 blue) */}
        <ThemeCard label="기본 (DX 기본)" />

        {/* Purple 브랜드 */}
        <div style={purpleBrand}>
          <ThemeCard label="Purple 브랜드" />
        </div>

        {/* Emerald 브랜드 */}
        <div style={emeraldBrand}>
          <ThemeCard label="Emerald 브랜드" />
        </div>
      </div>
    </section>
  );
}

function ThemeCard({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-lg border border-[color:var(--dx-color-border)]">
      <Badge variant="primary">{label}</Badge>
      <FormField>
        <Label htmlFor={`email-${label}`} required>
          이메일
        </Label>
        <Input
          id={`email-${label}`}
          type="email"
          placeholder="name@company.com"
        />
      </FormField>
      <FormField orientation="horizontal">
        <Checkbox id={`agree-${label}`} />
        <Label htmlFor={`agree-${label}`}>동의</Label>
      </FormField>
      <Button variant="primary">가입하기</Button>
    </div>
  );
}
