import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'neutral', 'warning', 'danger'],
    },
  },
  parameters: {
    codeTabs: {
      html: `<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary text-primary-foreground">신규</span>`,
      wc: `<ds-badge variant="primary">신규</ds-badge>`,
      thymeleaf: `<ds-badge th:attr="variant=\${variant}">[[#{badge.label}]]</ds-badge>`,
      react: `import { Badge } from '@dx/react';\n\n<Badge variant="primary">신규</Badge>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-badge variant=${args.variant || 'primary'}>배지</ds-badge>
  `,
};

export const Primary: Story = {
  render: () => html`<ds-badge variant="primary">신규</ds-badge>`,
};

export const Success: Story = {
  render: () => html`<ds-badge variant="success">완료</ds-badge>`,
};

export const Danger: Story = {
  render: () => html`<ds-badge variant="danger">오류</ds-badge>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-badge variant="primary">Primary</ds-badge>
      <ds-badge variant="success">Success</ds-badge>
      <ds-badge variant="neutral">Neutral</ds-badge>
      <ds-badge variant="warning">Warning</ds-badge>
      <ds-badge variant="danger">Danger</ds-badge>
    </div>
  `,
};
