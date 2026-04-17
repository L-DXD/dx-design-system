import '@dx/styles';
import '@dx/core';

import type { Preview } from '@storybook/web-components';

type CodeTabs = {
  html?: string;
  wc?: string;
  thymeleaf?: string;
  react?: string;
};

/**
 * Docs 'Show code' 에 4가지 환경의 코드를 한 번에 표시.
 * Storybook 의 Canvas 내부 Source 를 완전히 4탭 UI로 교체하는 안정적인
 * 공식 API가 없어서, 하나의 코드 블록에 섹션 구분자로 4개 스니펫을 출력한다.
 * (진짜 탭 UI는 하단 패널의 Code addon 에서 볼 수 있다.)
 */
const formatCodeTabs = (tabs: CodeTabs): string => {
  const sections: string[] = [];
  if (tabs.wc) {
    sections.push('<!-- ══════════ Web Component ══════════ -->');
    sections.push(tabs.wc.trim());
  }
  if (tabs.react) {
    sections.push('');
    sections.push('<!-- ══════════ React ══════════ -->');
    sections.push(tabs.react.trim());
  }
  if (tabs.thymeleaf) {
    sections.push('');
    sections.push('<!-- ══════════ Thymeleaf ══════════ -->');
    sections.push(tabs.thymeleaf.trim());
  }
  if (tabs.html) {
    sections.push('');
    sections.push('<!-- ══════════ HTML/CSS (no-JS fallback) ══════════ -->');
    sections.push(tabs.html.trim());
  }
  return sections.join('\n');
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
        transform: (code: string, storyContext: { parameters?: { codeTabs?: CodeTabs } }) => {
          const tabs = storyContext?.parameters?.codeTabs;
          if (tabs && (tabs.wc || tabs.react || tabs.thymeleaf || tabs.html)) {
            return formatCodeTabs(tabs);
          }
          return code;
        },
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
