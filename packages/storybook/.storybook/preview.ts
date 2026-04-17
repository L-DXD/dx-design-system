import '@dx/styles';
import '@dx/core';

import type { Preview } from '@storybook/web-components';
import { CodeTabsSource } from './CodeTabsSource';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    docs: {
      components: {
        // "Show code" 영역을 4탭 소스 컴포넌트로 교체
        // parameters.codeTabs가 있으면 4탭, 없으면 기본 Source 동작으로 폴백
        source: CodeTabsSource,
      },
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: '라이트/다크 모드 전환',
      defaultValue: 'light',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      const theme = context.globals.theme ?? 'light';
      const root = document.documentElement;
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');

      document.body.style.background = 'var(--dx-color-background)';
      document.body.style.color = 'var(--dx-color-foreground)';

      return story();
    },
  ],
};

export default preview;
