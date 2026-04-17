import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    codeTabs: {
      html: `<label class="inline-flex items-center cursor-pointer gap-2">\n  <input type="checkbox" role="switch" class="sr-only peer">\n  <div class="relative w-11 h-6 bg-gray-200 peer-focus:ring-4 rounded-full peer peer-checked:bg-primary"></div>\n  <span class="text-sm">알림 수신</span>\n</label>`,
      wc: `<ds-toggle>알림 수신</ds-toggle>\n<ds-toggle checked>다크모드</ds-toggle>`,
      thymeleaf: `<ds-toggle th:checked="\${enabled}">[[#{setting.notifications}]]</ds-toggle>`,
      react: `import { Toggle } from '@dx/react';\n\n<Toggle checked={enabled} onDsChange={(e) => setEnabled(e.target.checked)}>\n  알림 수신\n</Toggle>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-toggle
      size=${args.size || 'medium'}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
    >
      알림 수신
    </ds-toggle>
  `,
};

export const Checked: Story = {
  render: () => html`<ds-toggle checked>다크 모드 활성화</ds-toggle>`,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <ds-toggle disabled>비활성화 (꺼짐)</ds-toggle>
      <ds-toggle disabled checked>비활성화 (켜짐)</ds-toggle>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center;">
      <ds-toggle size="small">Small</ds-toggle>
      <ds-toggle size="medium">Medium</ds-toggle>
      <ds-toggle size="large">Large</ds-toggle>
    </div>
  `,
};
