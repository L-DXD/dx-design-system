import { SignupFormClient } from './signup-form-client';
import { TailwindDemoClient } from './tailwind-demo-client';

export default function Page() {
  return (
    <main className="max-w-[var(--dx-container-md)] mx-auto flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold m-0">DX Design System</h1>
        <p className="text-[color:var(--dx-color-muted-foreground)] mt-2">
          React/Next.js App Router 최소 예제
        </p>
      </header>

      <SignupFormClient />
      <TailwindDemoClient />
    </main>
  );
}
