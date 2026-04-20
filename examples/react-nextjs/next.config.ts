import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @dx/react 는 내부에서 Web Component 를 registerCustomElement 하므로
  // 서버 번들에 포함되지 않도록 transpilePackages 로 명시.
  transpilePackages: ['@dx/core', '@dx/react'],
};

export default nextConfig;
