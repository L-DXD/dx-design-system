import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Checkbox',
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
      html: `<label class="flex items-center gap-2">\n  <input type="checkbox" class="h-4 w-4 rounded border-gray-300">\n  <span class="text-sm">이용약관에 동의합니다</span>\n</label>`,
      wc: `<ds-checkbox>이용약관에 동의합니다</ds-checkbox>`,
      thymeleaf: `<ds-checkbox th:checked="\${agreed}">[[#{terms.agree}]]</ds-checkbox>`,
      react: `import { Checkbox } from '@dx/react';\n\n<Checkbox checked={agreed} onDsChange={(e) => setAgreed(e.target.checked)}>\n  이용약관에 동의합니다\n</Checkbox>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-checkbox
      size=${args.size || 'medium'}
      ?checked=${args.checked}
      ?disabled=${args.disabled}
    >
      이용약관에 동의합니다
    </ds-checkbox>
  `,
};

export const Checked: Story = {
  render: () => html`<ds-checkbox checked>알림 수신 동의</ds-checkbox>`,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <ds-checkbox disabled>비활성화 (미선택)</ds-checkbox>
      <ds-checkbox disabled checked>비활성화 (선택됨)</ds-checkbox>
    </div>
  `,
};
