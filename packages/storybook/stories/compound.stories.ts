import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Molecules/FormField',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Compound 컴포넌트로 폼 필드를 조립한다. ' +
          '`Label`, `HelperText`, `ErrorMessage`를 별도로 작성하여 ' +
          '소비자가 위치/스타일을 자유롭게 제어할 수 있다. ' +
          'Input/Toggle에 `label` prop을 쓰는 대신 **항상 이 방식**으로 작성한다.',
      },
    },
    codeTabs: {
      html: `<div class="flex flex-col gap-2">
  <label for="email" class="text-sm font-medium">이메일</label>
  <input id="email" type="email" class="h-10 px-3 rounded-md border" />
  <p class="text-xs text-gray-500">회사 이메일을 입력하세요</p>
</div>`,
      wc: `<ds-form-field>
  <ds-label html-for="email">이메일</ds-label>
  <ds-input id="email" type="email"></ds-input>
  <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
</ds-form-field>`,
      thymeleaf: `<ds-form-field>
  <ds-label th:attr="html-for=\${id}" th:text="#{form.email.label}"></ds-label>
  <ds-input th:id="\${id}" type="email" th:value="\${user.email}"></ds-input>
  <ds-helper-text th:text="#{form.email.helper}"></ds-helper-text>
  <ds-error-message th:if="\${#fields.hasErrors('email')}"
                    th:errors="*{email}"></ds-error-message>
</ds-form-field>`,
      react: `import { FormField, Label, Input, HelperText, ErrorMessage } from '@dx/react';

<FormField>
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" />
  <HelperText>회사 이메일을 입력하세요</HelperText>
  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

/* ========================================================================
 *  기본 조립 (수직)
 * ======================================================================== */

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Label + Input + HelperText 기본 수직 조합. 가장 자주 쓰는 형태.',
      },
    },
  },
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="email-default">이메일</ds-label>
      <ds-input id="email-default" type="email" placeholder="name@company.com"></ds-input>
      <ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>
    </ds-form-field>
  `,
};

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story: '`required` 속성으로 필수 입력 표시(*)를 자동 추가.',
      },
    },
  },
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="name-req" required>이름</ds-label>
      <ds-input id="name-req" placeholder="홍길동"></ds-input>
    </ds-form-field>
  `,
};

export const WithError: Story = {
  parameters: {
    docs: {
      description: {
        story: '유효성 실패 시 ErrorMessage 추가. HelperText를 대체하거나 함께 표시 가능.',
      },
    },
  },
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="email-err" required>이메일</ds-label>
      <ds-input id="email-err" type="email" value="invalid-email"></ds-input>
      <ds-error-message>올바른 이메일 형식이 아닙니다.</ds-error-message>
    </ds-form-field>
  `,
};

/* ========================================================================
 *  Horizontal orientation (Toggle / Checkbox용)
 * ======================================================================== */

export const HorizontalToggle: Story = {
  name: 'Horizontal — Toggle',
  parameters: {
    docs: {
      description: {
        story: 'Toggle/Checkbox처럼 라벨이 옆에 붙는 경우 `orientation="horizontal"` 사용.',
      },
    },
  },
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-toggle id="toggle-notify"></ds-toggle>
      <ds-label html-for="toggle-notify">이메일 알림 받기</ds-label>
    </ds-form-field>
  `,
};

export const HorizontalCheckbox: Story = {
  name: 'Horizontal — Checkbox',
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-terms"></ds-checkbox>
        <ds-label html-for="cb-terms">이용약관에 동의합니다</ds-label>
      </ds-form-field>
      <ds-form-field orientation="horizontal">
        <ds-checkbox id="cb-marketing"></ds-checkbox>
        <ds-label html-for="cb-marketing">마케팅 정보 수신에 동의합니다</ds-label>
      </ds-form-field>
    </div>
  `,
};

/* ========================================================================
 *  Select, Radio 조합
 * ======================================================================== */

export const WithSelect: Story = {
  render: () => html`
    <ds-form-field style="max-width: 360px;">
      <ds-label html-for="country" required>국가</ds-label>
      <ds-select id="country" placeholder="선택하세요">
        <ds-option value="kr">대한민국</ds-option>
        <ds-option value="us">United States</ds-option>
        <ds-option value="jp">日本</ds-option>
      </ds-select>
      <ds-helper-text>서비스 제공 국가를 선택해 주세요.</ds-helper-text>
    </ds-form-field>
  `,
};

export const WithRadioGroup: Story = {
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

/* ========================================================================
 *  전체 폼 예시
 * ======================================================================== */

export const FullFormExample: Story = {
  name: 'Full Form Example',
  parameters: {
    docs: {
      description: {
        story: 'Compound 패턴으로 구성한 전체 회원가입 폼 예시.',
      },
    },
  },
  render: () => html`
    <form style="display: flex; flex-direction: column; gap: 20px; max-width: 420px; padding: 24px; border: 1px solid var(--dx-color-border); border-radius: 12px;">
      <h2 style="margin: 0; font-size: var(--dx-font-size-h3); font-weight: var(--dx-font-weight-semibold);">
        회원가입
      </h2>

      <ds-form-field>
        <ds-label html-for="form-name" required>이름</ds-label>
        <ds-input id="form-name" placeholder="홍길동"></ds-input>
      </ds-form-field>

      <ds-form-field>
        <ds-label html-for="form-email" required>이메일</ds-label>
        <ds-input id="form-email" type="email" placeholder="name@company.com"></ds-input>
        <ds-helper-text>로그인 시 사용할 이메일입니다.</ds-helper-text>
      </ds-form-field>

      <ds-form-field>
        <ds-label html-for="form-password" required>비밀번호</ds-label>
        <ds-input id="form-password" type="password"></ds-input>
        <ds-error-message>8자 이상, 영문/숫자/특수문자를 포함해야 합니다.</ds-error-message>
      </ds-form-field>

      <ds-form-field orientation="horizontal">
        <ds-checkbox id="form-terms"></ds-checkbox>
        <ds-label html-for="form-terms">
          <span>이용약관 및 개인정보처리방침에 동의합니다</span>
        </ds-label>
      </ds-form-field>

      <ds-button variant="primary" style="margin-top: 8px;">가입하기</ds-button>
    </form>
  `,
};
