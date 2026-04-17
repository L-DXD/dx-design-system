import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
  argTypes: {
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
      html: `<select class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">\n  <option value="">선택하세요</option>\n  <option value="1">옵션 1</option>\n  <option value="2">옵션 2</option>\n</select>`,
      wc: `<ds-select label="과일" placeholder="선택하세요">\n  <ds-option value="apple">사과</ds-option>\n  <ds-option value="banana">바나나</ds-option>\n  <ds-option value="orange">오렌지</ds-option>\n</ds-select>`,
      thymeleaf: `<ds-select th:attr="label=\${label}, placeholder=\${placeholder}">\n  <ds-option th:each="item : \${items}" th:value="\${item.value}" th:text="\${item.label}"></ds-option>\n</ds-select>`,
      react: `import { Select, Option } from '@dx/react';\n\n<Select label="과일" placeholder="선택하세요" onDsChange={(e) => setValue(e.detail)}>\n  <Option value="apple">사과</Option>\n  <Option value="banana">바나나</Option>\n</Select>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-select
      size=${args.size || 'medium'}
      label=${args.label || '과일'}
      placeholder=${args.placeholder || '선택하세요'}
      ?disabled=${args.disabled}
    >
      <ds-option value="apple">사과</ds-option>
      <ds-option value="banana">바나나</ds-option>
      <ds-option value="orange">오렌지</ds-option>
    </ds-select>
  `,
};

export const WithPlaceholder: Story = {
  render: () => html`
    <ds-select placeholder="카테고리를 선택하세요">
      <ds-option value="frontend">프론트엔드</ds-option>
      <ds-option value="backend">백엔드</ds-option>
      <ds-option value="devops">데브옵스</ds-option>
    </ds-select>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-select label="부서" placeholder="선택 불가" disabled>
      <ds-option value="hr">인사팀</ds-option>
      <ds-option value="dev">개발팀</ds-option>
    </ds-select>
  `,
};
