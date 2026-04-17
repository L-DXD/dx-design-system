import '@dx/styles';
import '@dx/core';

import type { Preview } from '@storybook/web-components';
import { CustomDocsPage } from './CustomDocsPage';

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
      // 기본 autodocs 페이지를 커스텀 페이지로 교체.
      // 각 스토리의 parameters.codeTabs가 있으면 4탭으로 렌더링된다.
      page: CustomDocsPage,
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
