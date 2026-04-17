import type { StorybookConfig } from '@storybook/web-components-vite';
import { resolve } from 'path';

/**
 * addons 배열의 등록 순서가 하단 패널 탭 순서에 영향을 준다.
 * 우리 Code preset 을 addon-essentials 바로 뒤에 두어 Controls/Actions/
 * Interactions 다음 자리에 오도록 한다. a11y 는 맨 뒤.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    resolve(__dirname, 'addons/code-tabs/preset'),
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
