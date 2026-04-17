import type { StorybookConfig } from '@storybook/web-components-vite';
import { resolve } from 'path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.ts'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    resolve(__dirname, 'addons/code-tabs/preset'),
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
};

export default config;
