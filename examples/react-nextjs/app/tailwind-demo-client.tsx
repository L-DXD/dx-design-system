'use client';

import dynamic from 'next/dynamic';

// Web Component SSR 우회 (@dx/core 는 HTMLElement 를 필요로 하므로 클라이언트에서만 로드)
export const TailwindDemoClient = dynamic(
  () => import('./tailwind-demo').then((m) => m.TailwindDemo),
  { ssr: false },
);
