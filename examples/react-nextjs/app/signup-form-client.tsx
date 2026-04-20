'use client';

import dynamic from 'next/dynamic';

// @dx/core 는 모듈 로드 시 customElements.define 을 실행하므로 Node SSR 환경에서는
// import 자체가 실패(`HTMLElement is not defined`)한다. Web Component 는 브라우저 전용이니
// ssr: false 로 클라이언트에서만 로드한다.
export const SignupFormClient = dynamic(
  () => import('./signup-form').then((m) => m.SignupForm),
  { ssr: false },
);
