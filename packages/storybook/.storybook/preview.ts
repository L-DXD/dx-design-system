import '@dx/styles';
import '@dx/core';

import type { Preview } from '@storybook/web-components';

type FrameworkKey = 'wc' | 'react' | 'thymeleaf' | 'html';

type CodeTabs = {
  html?: string;
  wc?: string;
  thymeleaf?: string;
  react?: string;
};

const FRAMEWORK_LABELS: Record<FrameworkKey, string> = {
  wc: 'Web Component',
  react: 'React',
  thymeleaf: 'Thymeleaf',
  html: 'HTML/CSS',
};

const FRAMEWORK_ORDER: FrameworkKey[] = ['wc', 'react', 'thymeleaf', 'html'];

const pickCode = (tabs: CodeTabs, framework: FrameworkKey): string | undefined => {
  if (tabs[framework]) return tabs[framework];
  // 선택된 프레임워크 코드가 없으면 다음 순서로 폴백
  for (const fb of FRAMEWORK_ORDER) {
    if (tabs[fb]) return tabs[fb];
  }
  return undefined;
};

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
      source: {
        /**
         * 툴바에서 선택된 프레임워크의 코드 한 개만 'Show code' 영역에 표시.
         * 툴바 선택이 바뀌면 자동으로 Docs 페이지의 표시 언어/코드가 교체되고,
         * Storybook 기본 Copy 버튼이 해당 코드만 복사한다.
         */
        transform: (
          code: string,
          storyContext: {
            parameters?: { codeTabs?: CodeTabs };
            globals?: { framework?: FrameworkKey };
          },
        ) => {
          const tabs = storyContext?.parameters?.codeTabs;
          if (!tabs) return code;
          const selected = storyContext?.globals?.framework ?? 'wc';
          return pickCode(tabs, selected) ?? code;
        },
        language: 'html', // 기본; 아래 render 시 framework에 따라 컨트롤 가능
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
    framework: {
      name: 'Framework',
      description: 'Docs "Show code" 에 표시할 프레임워크 선택',
      defaultValue: 'wc',
      toolbar: {
        icon: 'code',
        items: FRAMEWORK_ORDER.map((value) => ({
          value,
          title: FRAMEWORK_LABELS[value],
        })),
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
