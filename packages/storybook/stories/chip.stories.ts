import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Chip',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'neutral', 'warning', 'danger'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    removable: { control: 'boolean' },
  },
  parameters: {
    codeTabs: {
      html: `<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">태그</span>`,
      wc: `<ds-chip variant="primary">태그</ds-chip>\n<ds-chip removable>삭제 가능</ds-chip>`,
      thymeleaf: `<ds-chip th:each="tag : \${tags}" th:attr="variant=\${tag.variant}" removable>[[#{\${tag.label}}]]</ds-chip>`,
      react: `import { Chip } from '@dx/react';\n\n<Chip variant="primary">태그</Chip>\n<Chip removable onDsRemove={() => handleRemove()}>삭제 가능</Chip>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-chip
      variant=${args.variant || 'neutral'}
      size=${args.size || 'medium'}
      ?removable=${args.removable}
    >
      태그
    </ds-chip>
  `,
};

export const Removable: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-chip removable>React</ds-chip>
      <ds-chip removable>TypeScript</ds-chip>
      <ds-chip removable>Storybook</ds-chip>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-chip size="small">Small</ds-chip>
      <ds-chip size="medium">Medium</ds-chip>
      <ds-chip size="large">Large</ds-chip>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 8px; align-items: center;">
      <ds-chip variant="primary">Primary</ds-chip>
      <ds-chip variant="success">Success</ds-chip>
      <ds-chip variant="neutral">Neutral</ds-chip>
      <ds-chip variant="warning">Warning</ds-chip>
      <ds-chip variant="danger">Danger</ds-chip>
    </div>
  `,
};
