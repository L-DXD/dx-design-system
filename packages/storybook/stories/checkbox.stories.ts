import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '체크박스. `<ds-form-field orientation="horizontal">`로 Label과 수평 배치한다. ' +
          'Shoelace 내장 슬롯에 라벨 텍스트를 직접 넣는 대신, 별도 `<ds-label>`을 사용한다.',
      },
    },
    codeTabs: {
      html: `<label class="flex items-center gap-2">
  <input type="checkbox" id="terms" class="h-4 w-4 rounded border-gray-300" />
  <span class="text-sm font-medium">이용약관에 동의합니다</span>
</label>`,
      wc: `<ds-form-field orientation="horizontal">
  <ds-checkbox id="terms"></ds-checkbox>
  <ds-label html-for="terms">이용약관에 동의합니다</ds-label>
</ds-form-field>`,
      thymeleaf: `<ds-form-field orientation="horizontal">
  <ds-checkbox th:id="\${id}" th:checked="\${agreed}"></ds-checkbox>
  <ds-label th:attr="html-for=\${id}" th:text="#{terms.agree}"></ds-label>
</ds-form-field>`,
      react: `import { FormField, Checkbox, Label } from '@dx/react';

<FormField orientation="horizontal">
  <Checkbox id="terms" onDsChange={(e) => setAgreed(e.target.checked)} />
  <Label htmlFor="terms">이용약관에 동의합니다</Label>
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-checkbox id="cb-default"></ds-checkbox>
      <ds-label html-for="cb-default">이용약관에 동의합니다</ds-label>
    </ds-form-field>
  `,
};

export const Checked: Story = {
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-checkbox id="cb-checked" checked></ds-checkbox>
      <ds-label html-for="cb-checked">알림 수신 동의</ds-label>
    </ds-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-checkbox id="cb-required"></ds-checkbox>
      <ds-label html-for="cb-required" required>필수 동의 항목</ds-label>
    </ds-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-dis-off" disabled></ds-checkbox>
        <ds-label html-for="cb-dis-off">비활성화 (미선택)</ds-label>
      </ds-form-field>
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-dis-on" disabled checked></ds-checkbox>
        <ds-label html-for="cb-dis-on">비활성화 (선택됨)</ds-label>
      </ds-form-field>
    </div>
  `,
};

export const Group: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Checkbox 여러 개를 그룹으로 보여줄 때는 위에 `<ds-label>`을 하나 두고 나열.',
      },
    },
  },
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label>수신 동의 항목</ds-label>
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-mkt"></ds-checkbox>
        <ds-label html-for="cb-mkt">마케팅 정보</ds-label>
      </ds-form-field>
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-news"></ds-checkbox>
        <ds-label html-for="cb-news">뉴스레터</ds-label>
      </ds-form-field>
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-event"></ds-checkbox>
        <ds-label html-for="cb-event">이벤트 알림</ds-label>
      </ds-form-field>
      <ds-helper-text>언제든 수신 설정에서 변경할 수 있습니다.</ds-helper-text>
    </ds-form-field>
  `,
};
