import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Input',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  parameters: {
    codeTabs: {
      html: `<input type="text" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="이름을 입력하세요">`,
      wc: `<ds-input label="이름" placeholder="이름을 입력하세요"></ds-input>`,
      thymeleaf: `<ds-input th:attr="label=\${label}, placeholder=\${placeholder}" th:value="\${value}"></ds-input>`,
      react: `import { Input } from '@dx/react';\n\n<Input label="이름" placeholder="이름을 입력하세요" onDsChange={(e) => setValue(e.detail)} />`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-input
      type=${args.type || 'text'}
      size=${args.size || 'medium'}
      label=${args.label || '이름'}
      placeholder=${args.placeholder || '이름을 입력하세요'}
      ?disabled=${args.disabled}
    ></ds-input>
  `,
};

export const Placeholder: Story = {
  render: () => html`<ds-input placeholder="검색어를 입력하세요"></ds-input>`,
};

export const WithLabel: Story = {
  render: () => html`<ds-input label="이메일" placeholder="email@example.com" type="email"></ds-input>`,
};

export const Error: Story = {
  render: () => html`
    <ds-input label="이메일" placeholder="email@example.com" help-text="올바른 이메일 주소를 입력하세요.">
      <div slot="help-text" style="color: var(--sl-color-danger-600);">올바른 이메일 주소를 입력하세요.</div>
    </ds-input>
  `,
};

export const Disabled: Story = {
  render: () => html`<ds-input label="이름" placeholder="비활성화됨" disabled></ds-input>`,
};

export const Password: Story = {
  render: () => html`<ds-input type="password" label="비밀번호" placeholder="비밀번호를 입력하세요" password-toggle></ds-input>`,
};
