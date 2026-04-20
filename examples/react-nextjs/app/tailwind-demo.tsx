'use client';

import { Badge, Button, Input } from '@dx/react';

/**
 * Tailwind 오버라이드의 범위와 한계.
 *
 * ds-* 는 Shadow DOM 기반이라 Tailwind 유틸 class 는 **host 요소** 에 걸린다.
 * 내부 Shadow DOM 박스에는 한정적으로만 영향.
 *
 * ✅ 먹히는 것 (host 레벨 레이아웃)
 *    - width/height: w-full, w-64, h-10
 *    - margin: mt-2, ml-auto
 *    - display/grid/flex 배치
 *    - font-size (상속되어 내부 텍스트에도 적용): text-base, text-xs
 *    - position: absolute/fixed/sticky
 *
 * ⚠ 먹히지 않는 것 (내부 Shadow DOM 박스)
 *    - padding: px-*, py-* → host 여백만 늘어나 컴포넌트가 밀려 보임, 내부 박스는 그대로
 *    - background/text-color: bg-*, text-red-500 → Shoelace 가 자체 변수로 덮어씀
 *    - border-radius: rounded-* → host 에만, 내부 박스는 자체 radius 유지
 *
 * 내부 크기/색을 바꾸려면
 *    1. Shoelace 의 size prop: <Button size="large">
 *    2. 토큰 오버라이드: --dx-color-primary 등 (윗 섹션 "Token 오버라이드" 참고)
 *    3. ::part() CSS: ds-badge::part(base) { padding: 0.5rem 1rem }
 */

export function TailwindDemo() {
  return (
    <section className="flex flex-col gap-4 p-6 rounded-xl border border-[color:var(--dx-color-border)]">
      <h2 className="text-xl font-semibold">Tailwind 오버라이드 (host 레이아웃 전용)</h2>
      <p className="text-sm text-[color:var(--dx-color-muted-foreground)]">
        host 레벨 레이아웃(width · margin · 배치 · font-size) 은 먹지만, padding/색상 같은
        내부 박스는 토큰 오버라이드 또는 <code>::part()</code> 를 써야 함.
      </p>

      {/* ✅ host 레벨 — 바로 먹힘 */}
      <h3 className="text-base font-semibold mt-2">✅ host 레벨 — 바로 먹힘</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button variant="primary">기본</Button>
        <Button variant="primary" className="w-full">className="w-full"</Button>
        <Button variant="primary" className="w-full mt-4 shadow-lg">w-full mt-4 shadow-lg</Button>
        <Button variant="primary" className="w-auto ml-auto">w-auto ml-auto</Button>
      </div>

      <div className="flex gap-3 items-center mt-2">
        <Badge variant="primary" className="text-base">text-base (상속)</Badge>
        <Badge variant="primary" className="text-xs">text-xs</Badge>
      </div>

      <Input type="email" placeholder="className=&quot;w-full&quot;" className="w-full" />

      {/* ⚠ 내부 박스 — Tailwind 안 먹힘 */}
      <h3 className="text-base font-semibold mt-4">⚠ 내부 박스 — Tailwind 안 먹힘</h3>
      <p className="text-sm text-[color:var(--dx-color-muted-foreground)]">
        아래 badge 는 host 에 <code>px-14 py-2</code> 를 걸었지만 내부 박스가 커지는 게 아니라
        host 의 padding 공간만 늘어나 badge 가 오른쪽으로 밀려 보임.
      </p>
      <div className="flex items-start bg-[color:var(--dx-color-muted)] rounded-md">
        <Badge variant="success" className="px-14 py-2">
          px-14 py-2 (host 에만 적용)
        </Badge>
      </div>

      {/* 대안 */}
      <h3 className="text-base font-semibold mt-4">대안: Shoelace size prop</h3>
      <p className="text-sm text-[color:var(--dx-color-muted-foreground)]">
        내부 박스 크기는 Shoelace 가 이미 semantic size prop 으로 제공한다.
      </p>
      <div className="flex gap-2 flex-wrap items-center">
        <Button variant="primary" size="small">size="small"</Button>
        <Button variant="primary" size="medium">size="medium"</Button>
        <Button variant="primary" size="large">size="large"</Button>
      </div>
    </section>
  );
}
