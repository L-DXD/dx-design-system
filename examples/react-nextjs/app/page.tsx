import { SignupFormClient } from './signup-form-client';

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 'var(--dx-container-md)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <header>
        <h1 style={{ fontSize: 'var(--dx-font-size-h1)', margin: 0 }}>DX Design System</h1>
        <p style={{ color: 'var(--dx-color-muted-foreground)', marginTop: 8 }}>
          React/Next.js App Router 최소 예제
        </p>
      </header>

      <SignupFormClient />
    </main>
  );
}
