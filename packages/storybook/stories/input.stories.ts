import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '텍스트 입력 컴포넌트. **Shoelace 내장 `label` prop은 사용하지 않는다.** ' +
          '대신 `<ds-label>` + `<ds-form-field>` + `<ds-helper-text>` 조합으로 조립한다. ' +
          '자세한 조립 방법은 `Compound/FormField & Label` 참고.',
      },
    },
    codeTabs: {
      html: `<div class="flex flex-col gap-2">
  <label for="email" class="text-sm font-medium">이메일</label>
  <input id="email" type="email" placeholder="name@company.com"
         class="h-10 px-3 rounded-md border border-gray-200" />
  <p class="text-xs text-gray-500">회사 이메일을 입력하세요</p>
</div>`,
      wc: `<ds-form-field>
  <ds-label html-for="email">이메일</ds-label>
  <ds-input id="email" type="email" placeholder="name@company.com"></ds-input>
  <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
</ds-form-field>`,
      thymeleaf: `<ds-form-field>
  <ds-label th:attr="html-for=\${id}" th:text="#{form.email.label}"></ds-label>
  <ds-input th:id="\${id}" type="email" th:value="\${user.email}"></ds-input>
  <ds-helper-text th:text="#{form.email.helper}"></ds-helper-text>
</ds-form-field>`,
      react: `import { FormField, Label, Input, HelperText } from '@dx/react';

<FormField>
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="name@company.com" />
  <HelperText>회사 이메일을 입력하세요</HelperText>
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-default">이름</ds-label>
      <ds-input id="input-default" placeholder="홍길동"></ds-input>
    </ds-form-field>
  `,
};

export const WithHelperText: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-helper">이메일</ds-label>
      <ds-input id="input-helper" type="email" placeholder="name@company.com"></ds-input>
      <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
    </ds-form-field>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-required" required>비밀번호</ds-label>
      <ds-input id="input-required" type="password"></ds-input>
    </ds-form-field>
  `,
};

export const WithError: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-error" required>이메일</ds-label>
      <ds-input id="input-error" type="email" value="invalid"></ds-input>
      <ds-error-message>올바른 이메일 형식이 아닙니다.</ds-error-message>
    </ds-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-disabled">이름</ds-label>
      <ds-input id="input-disabled" placeholder="비활성화됨" disabled></ds-input>
    </ds-form-field>
  `,
};

export const Password: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="input-pw" required>비밀번호</ds-label>
      <ds-input id="input-pw" type="password" password-toggle></ds-input>
      <ds-helper-text>8자 이상, 영문/숫자/특수문자 포함.</ds-helper-text>
    </ds-form-field>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px;">
      <ds-form-field>
        <ds-label html-for="input-sm">Small</ds-label>
        <ds-input id="input-sm" size="small" placeholder="작은 입력창"></ds-input>
      </ds-form-field>
      <ds-form-field>
        <ds-label html-for="input-md">Medium (기본)</ds-label>
        <ds-input id="input-md" size="medium" placeholder="기본 입력창"></ds-input>
      </ds-form-field>
      <ds-form-field>
        <ds-label html-for="input-lg">Large</ds-label>
        <ds-input id="input-lg" size="large" placeholder="큰 입력창"></ds-input>
      </ds-form-field>
    </div>
  `,
};
