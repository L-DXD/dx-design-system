import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/ErrorMessage',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '유효성 검사 실패 메시지. `role="alert"`가 자동 적용되어 스크린 리더가 즉시 안내한다. ' +
          '내용이 비어있으면 자동으로 숨겨진다.',
      },
    },
    codeTabs: {
      html: `<p role="alert" class="text-xs text-red-600">유효하지 않은 이메일입니다</p>`,
      wc: `<ds-error-message>유효하지 않은 이메일입니다</ds-error-message>`,
      thymeleaf: `<ds-error-message th:if="\${#fields.hasErrors('email')}"
                  th:errors="*{email}"></ds-error-message>`,
      react: `import { ErrorMessage } from '@dx/react';

{errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<ds-error-message>유효하지 않은 이메일입니다</ds-error-message>`,
};
