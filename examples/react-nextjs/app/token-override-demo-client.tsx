'use client';

import dynamic from 'next/dynamic';

// Web Component SSR 우회
export const TokenOverrideDemoClient = dynamic(
  () => import('./token-override-demo').then((m) => m.TokenOverrideDemo),
  { ssr: false },
);
