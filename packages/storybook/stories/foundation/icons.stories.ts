import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Foundation/Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '`<ds-icon>` 컴포넌트. Lucide 아이콘 세트를 Light DOM으로 렌더링한다. ' +
          '`class`로 Tailwind 유틸리티 적용 가능 (`w-6 h-6 text-red-500`). ' +
          '`name`은 kebab-case Lucide 아이콘 이름 (예: `chevron-down`, `check-circle`).',
      },
    },
    codeTabs: {
      html: `<!-- Lucide SVG를 직접 사용 -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-blue-600">
  <polyline points="20 6 9 17 4 12" />
</svg>`,
      wc: `<ds-icon name="check" class="w-6 h-6 text-blue-600"></ds-icon>`,
      thymeleaf: `<ds-icon th:attr="name=\${iconName}" class="w-6 h-6 text-blue-600"></ds-icon>`,
      react: `import { Icon } from '@dx/react';

<Icon name="check" className="w-6 h-6 text-blue-600" />`,
    },
  },
};

export default meta;
type Story = StoryObj;

const COMMON_ICONS = [
  'check', 'x', 'plus', 'minus', 'search', 'settings',
  'user', 'mail', 'bell', 'home', 'calendar', 'clock',
  'edit', 'trash-2', 'download', 'upload', 'copy', 'share-2',
  'chevron-down', 'chevron-up', 'chevron-left', 'chevron-right',
  'arrow-right', 'arrow-left', 'external-link', 'link',
  'info', 'alert-circle', 'check-circle', 'x-circle',
  'heart', 'star', 'bookmark', 'eye', 'eye-off',
  'menu', 'more-vertical', 'more-horizontal', 'filter',
];

export const Default: Story = {
  render: () => html`<ds-icon name="check" style="font-size: 24px;"></ds-icon>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 16px;">
      <ds-icon name="heart" style="font-size: 12px;"></ds-icon>
      <ds-icon name="heart" style="font-size: 16px;"></ds-icon>
      <ds-icon name="heart" style="font-size: 24px;"></ds-icon>
      <ds-icon name="heart" style="font-size: 32px;"></ds-icon>
      <ds-icon name="heart" style="font-size: 48px;"></ds-icon>
    </div>
  `,
};

export const Colors: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 16px; font-size: 24px;">
      <ds-icon name="bell" style="color: var(--dx-color-foreground);"></ds-icon>
      <ds-icon name="bell" style="color: var(--dx-color-primary);"></ds-icon>
      <ds-icon name="bell" style="color: var(--dx-color-success);"></ds-icon>
      <ds-icon name="bell" style="color: var(--dx-color-warning);"></ds-icon>
      <ds-icon name="bell" style="color: var(--dx-color-danger);"></ds-icon>
    </div>
  `,
};

export const Gallery: Story = {
  parameters: {
    docs: {
      description: {
        story: '자주 쓰이는 아이콘 목록. 전체 Lucide 아이콘은 https://lucide.dev/icons 에서 확인.',
      },
    },
  },
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 16px;">
      ${COMMON_ICONS.map(
        (name) => html`
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 6px;
              padding: 12px;
              border: 1px solid var(--dx-color-border);
              border-radius: 6px;
              font-size: 24px;
            "
          >
            <ds-icon name="${name}"></ds-icon>
            <code style="font-size: 10px; color: var(--dx-color-muted-foreground);">${name}</code>
          </div>
        `
      )}
    </div>
  `,
};
