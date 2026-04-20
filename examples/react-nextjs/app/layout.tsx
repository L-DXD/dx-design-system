import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DX Design System — React/Next.js 예제',
  description: '@dx/react 래퍼로 Web Component 를 React 에서 쓰는 최소 예제',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans text-[color:var(--dx-color-foreground)] bg-[color:var(--dx-color-background)] m-0 p-12">
        {children}
      </body>
    </html>
  );
}
