'use client';

import { Badge, Button, Input } from '@dx/react';
import { cn } from '@/lib/utils';

/**
 * Tailwind 유틸리티 클래스로 ds-* 컴포넌트를 오버라이드하는 예시.
 *
 * - ds-* 컴포넌트는 호스트 요소에 `class` 를 그대로 반영.
 * - 호스트 레벨 속성(width, margin, display, position) 은 바로 적용됨.
 * - 내부 Shadow DOM 요소(input 자체 등) 는 Shoelace 의 `::part()` API 나 CSS 변수로 제어.
 * - `cn()` 은 shadcn/ui 관례. clsx + tailwind-merge 로 충돌하는 클래스를 자동으로 뒤 것이 이기게 한다.
 */

type ThemedButtonProps = React.ComponentProps<typeof Button>;

/** 호출부에서 `className` 을 마지막에 넘기면 기본 스타일을 덮어씀. */
function ThemedButton({ className, ...props }: ThemedButtonProps) {
  return (
    <Button
      {...props}
      className={cn('w-full', className)}
    />
  );
}

export function TailwindDemo() {
  return (
    <section className="flex flex-col gap-4 p-6 rounded-xl border border-[color:var(--dx-color-border)]">
      <h2 className="text-xl font-semibold">Tailwind 오버라이드 예시</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 기본 */}
        <Button variant="primary">기본 버튼</Button>

        {/* 폭·마진 오버라이드 — 호스트 레벨이라 바로 먹힘 */}
        <Button variant="primary" className="w-full mt-2">
          w-full mt-2
        </Button>

        {/* 재사용 가능한 wrapper 패턴 */}
        <ThemedButton variant="primary">ThemedButton 기본</ThemedButton>

        {/* 호출부에서 cn 으로 병합 — w-full 이 w-auto 로 override 됨 */}
        <ThemedButton variant="primary" className="w-auto ml-auto">
          호출부에서 override
        </ThemedButton>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Badge variant="primary" className="text-base">
          큰 뱃지
        </Badge>
        <Badge variant="success" className="px-4 py-1">
          넓은 패딩
        </Badge>
      </div>

      <Input
        type="email"
        placeholder="w-full 로 폭 조정"
        className="w-full"
      />
    </section>
  );
}
