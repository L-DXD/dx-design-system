import { SignupFormClient } from './signup-form-client';
import { TailwindDemoClient } from './tailwind-demo-client';
import { TokenOverrideDemoClient } from './token-override-demo-client';

export default function Page() {
  return (
    <main className="max-w-[var(--dx-container-md)] mx-auto flex flex-col gap-10">
      <header>
        <h1 className="text-4xl font-bold m-0">DX Design System</h1>
        <p className="text-[color:var(--dx-color-muted-foreground)] mt-2">
          React/Next.js App Router 예제 — 기본 사용 / Token 오버라이드 / Tailwind 오버라이드
        </p>
      </header>

      {/* 1. 기본 사용 */}
      <section className="flex flex-col gap-4 p-6 rounded-xl border border-[color:var(--dx-color-border)]">
        <h2 className="text-xl font-semibold">1. 기본 사용 (override 없음)</h2>
        <SignupFormClient />
      </section>

      {/* 2. Token 오버라이드 (브랜드 컬러) */}
      <TokenOverrideDemoClient />

      {/* 3. Tailwind classname 오버라이드 */}
      <TailwindDemoClient />
    </main>
  );
}
