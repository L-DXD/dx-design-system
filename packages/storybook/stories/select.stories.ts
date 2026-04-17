import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '드롭다운 선택 컴포넌트. `label`은 `<ds-label>`로 분리하여 조립한다. ' +
          '`<ds-option>`을 자식으로 전달하여 옵션을 구성한다.',
      },
    },
    codeTabs: {
      html: `<div class="flex flex-col gap-2">
  <label for="country" class="text-sm font-medium">국가</label>
  <select id="country" class="h-10 px-3 rounded-md border border-gray-200">
    <option value="">선택하세요</option>
    <option value="kr">대한민국</option>
    <option value="us">United States</option>
  </select>
</div>`,
      wc: `<ds-form-field>
  <ds-label html-for="country">국가</ds-label>
  <ds-select id="country" placeholder="선택하세요">
    <ds-option value="kr">대한민국</ds-option>
    <ds-option value="us">United States</ds-option>
  </ds-select>
</ds-form-field>`,
      thymeleaf: `<ds-form-field>
  <ds-label th:attr="html-for=\${id}" th:text="#{form.country.label}"></ds-label>
  <ds-select th:id="\${id}" th:attr="placeholder=#{form.country.placeholder}">
    <ds-option th:each="c : \${countries}"
               th:value="\${c.code}" th:text="\${c.name}"></ds-option>
  </ds-select>
</ds-form-field>`,
      react: `import { FormField, Label, Select, Option } from '@dx/react';

<FormField>
  <Label htmlFor="country">국가</Label>
  <Select id="country" placeholder="선택하세요" onDsChange={(e) => setValue(e.detail)}>
    <Option value="kr">대한민국</Option>
    <Option value="us">United States</Option>
  </Select>
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="select-default">국가</ds-label>
      <ds-select id="select-default" placeholder="선택하세요">
        <ds-option value="kr">대한민국</ds-option>
        <ds-option value="us">United States</ds-option>
        <ds-option value="jp">日本</ds-option>
      </ds-select>
    </ds-form-field>
  `,
};

export const WithHelperText: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="select-category">카테고리</ds-label>
      <ds-select id="select-category" placeholder="선택하세요">
        <ds-option value="frontend">프론트엔드</ds-option>
        <ds-option value="backend">백엔드</ds-option>
        <ds-option value="devops">데브옵스</ds-option>
      </ds-select>
      <ds-helper-text>주로 관심 있는 분야를 선택해 주세요.</ds-helper-text>
    </ds-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="select-req" required>부서</ds-label>
      <ds-select id="select-req" placeholder="선택하세요">
        <ds-option value="hr">인사팀</ds-option>
        <ds-option value="dev">개발팀</ds-option>
        <ds-option value="design">디자인팀</ds-option>
      </ds-select>
    </ds-form-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="select-err" required>국가</ds-label>
      <ds-select id="select-err" placeholder="선택하세요"></ds-select>
      <ds-error-message>국가를 선택해 주세요.</ds-error-message>
    </ds-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="select-disabled">부서</ds-label>
      <ds-select id="select-disabled" placeholder="선택 불가" disabled>
        <ds-option value="hr">인사팀</ds-option>
        <ds-option value="dev">개발팀</ds-option>
      </ds-select>
    </ds-form-field>
  `,
};
