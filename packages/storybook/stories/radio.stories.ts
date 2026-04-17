import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '라디오 버튼 그룹. `<ds-radio-group>`의 `label` prop은 사용하지 않고, ' +
          '외부에 `<ds-label>`을 배치해 Compound 패턴으로 조립한다.',
      },
    },
    codeTabs: {
      html: `<fieldset class="flex flex-col gap-2">
  <legend class="text-sm font-medium">배송 방법</legend>
  <label class="flex items-center gap-2">
    <input type="radio" name="shipping" value="standard" /> 일반 배송
  </label>
  <label class="flex items-center gap-2">
    <input type="radio" name="shipping" value="express" /> 빠른 배송
  </label>
</fieldset>`,
      wc: `<ds-form-field>
  <ds-label>배송 방법</ds-label>
  <ds-radio-group name="shipping" value="standard">
    <ds-radio value="standard">일반 배송</ds-radio>
    <ds-radio value="express">빠른 배송</ds-radio>
  </ds-radio-group>
</ds-form-field>`,
      thymeleaf: `<ds-form-field>
  <ds-label th:text="#{shipping.label}"></ds-label>
  <ds-radio-group name="shipping" th:attr="value=\${selected}">
    <ds-radio th:each="opt : \${options}"
              th:value="\${opt.value}" th:text="\${opt.label}"></ds-radio>
  </ds-radio-group>
</ds-form-field>`,
      react: `import { FormField, Label, RadioGroup, Radio } from '@dx/react';

<FormField>
  <Label>배송 방법</Label>
  <RadioGroup name="shipping" value={shipping} onDsChange={(e) => setShipping(e.detail)}>
    <Radio value="standard">일반 배송</Radio>
    <Radio value="express">빠른 배송</Radio>
  </RadioGroup>
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label>배송 방법</ds-label>
      <ds-radio-group name="shipping" value="standard">
        <ds-radio value="standard">일반 배송</ds-radio>
        <ds-radio value="express">빠른 배송</ds-radio>
        <ds-radio value="pickup">직접 수령</ds-radio>
      </ds-radio-group>
    </ds-form-field>
  `,
};

export const WithHelperText: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label>요금제</ds-label>
      <ds-radio-group name="plan" value="pro">
        <ds-radio value="free">Free</ds-radio>
        <ds-radio value="pro">Pro</ds-radio>
        <ds-radio value="enterprise">Enterprise</ds-radio>
      </ds-radio-group>
      <ds-helper-text>언제든 변경할 수 있습니다.</ds-helper-text>
    </ds-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label required>결제 방법</ds-label>
      <ds-radio-group name="payment">
        <ds-radio value="card">신용카드</ds-radio>
        <ds-radio value="bank">계좌이체</ds-radio>
        <ds-radio value="mobile">모바일 결제</ds-radio>
      </ds-radio-group>
    </ds-form-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label required>결제 방법</ds-label>
      <ds-radio-group name="payment"></ds-radio-group>
      <ds-error-message>결제 방법을 선택해 주세요.</ds-error-message>
    </ds-form-field>
  `,
};

export const WithDisabledItem: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label>결제 방법</ds-label>
      <ds-radio-group name="payment-disabled" value="card">
        <ds-radio value="card">신용카드</ds-radio>
        <ds-radio value="bank" disabled>계좌이체 (점검 중)</ds-radio>
        <ds-radio value="mobile">모바일 결제</ds-radio>
      </ds-radio-group>
    </ds-form-field>
  `,
};
