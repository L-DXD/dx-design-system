import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Radio',
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
  parameters: {
    codeTabs: {
      html: `<fieldset>\n  <legend class="text-sm font-medium">배송 방법</legend>\n  <label class="flex items-center gap-2"><input type="radio" name="shipping" value="standard"> 일반 배송</label>\n  <label class="flex items-center gap-2"><input type="radio" name="shipping" value="express"> 빠른 배송</label>\n</fieldset>`,
      wc: `<ds-radio-group label="배송 방법" value="standard">\n  <ds-radio value="standard">일반 배송</ds-radio>\n  <ds-radio value="express">빠른 배송</ds-radio>\n</ds-radio-group>`,
      thymeleaf: `<ds-radio-group th:attr="label=\${label}, value=\${selectedValue}">\n  <ds-radio th:each="opt : \${options}" th:value="\${opt.value}" th:text="\${opt.label}"></ds-radio>\n</ds-radio-group>`,
      react: `import { RadioGroup, Radio } from '@dx/react';\n\n<RadioGroup label="배송 방법" value={shipping} onDsChange={(e) => setShipping(e.detail)}>\n  <Radio value="standard">일반 배송</Radio>\n  <Radio value="express">빠른 배송</Radio>\n</RadioGroup>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <ds-radio-group label="배송 방법" value="standard" size=${args.size || 'medium'}>
      <ds-radio value="standard">일반 배송</ds-radio>
      <ds-radio value="express">빠른 배송</ds-radio>
      <ds-radio value="pickup">직접 수령</ds-radio>
    </ds-radio-group>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-radio-group label="결제 방법" value="card" fieldset>
      <ds-radio value="card">신용카드</ds-radio>
      <ds-radio value="bank" disabled>계좌이체 (점검 중)</ds-radio>
      <ds-radio value="mobile">모바일 결제</ds-radio>
    </ds-radio-group>
  `,
};
