import '@dx/styles';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DX Design System — React/Next.js 예제',
  description: '@dx/react 래퍼로 Web Component 를 React 에서 쓰는 최소 예제',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body
        style={{
          fontFamily: 'var(--dx-font-sans)',
          color: 'var(--dx-color-foreground)',
          background: 'var(--dx-color-background)',
          margin: 0,
          padding: '48px 24px',
        }}
      >
        {children}
      </body>
    </html>
  );
}
