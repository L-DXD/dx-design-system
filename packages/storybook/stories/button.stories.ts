import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'neutral', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  parameters: {
    codeTabs: {
      html: `<button class="inline-flex items-center justify-center font-medium rounded-md h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">\n  저장하기\n</button>`,
      wc: `<ds-button variant="primary">저장하기</ds-button>`,
      thymeleaf: `<ds-button th:attr="variant=\${variant}">[[#{btn.save}]]</ds-button>`,
      react: `import { Button } from '@dx/react';\n\n<Button variant="primary" onClick={() => save()}>\n  저장하기\n</Button>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Primary: Story = {
  render: (args) => html`
    <ds-button
      variant=${args.variant || 'primary'}
      size=${args.size || 'medium'}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
    >
      저장하기
    </ds-button>
  `,
};

export const Secondary: Story = {
  render: () => html`<ds-button variant="neutral">취소</ds-button>`,
};

export const Danger: Story = {
  render: () => html`<ds-button variant="danger">삭제</ds-button>`,
};

export const Loading: Story = {
  render: () => html`<ds-button variant="primary" loading>로딩 중...</ds-button>`,
};

export const Disabled: Story = {
  render: () => html`<ds-button variant="primary" disabled>비활성화</ds-button>`,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-button size="small">Small</ds-button>
      <ds-button size="medium">Medium</ds-button>
      <ds-button size="large">Large</ds-button>
    </div>
  `,
};
