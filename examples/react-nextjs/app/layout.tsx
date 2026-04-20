import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DX Design System — shadcn 예제',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-background text-foreground font-sans antialiased m-0 p-12">
        {children}
      </body>
    </html>
  );
}
