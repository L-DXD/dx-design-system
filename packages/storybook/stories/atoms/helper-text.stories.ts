import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/HelperText',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '입력창 하단의 부가 설명 텍스트. muted-foreground 색상의 작은 글씨. ' +
          '일반적으로 `<ds-form-field>` 안에서 `<ds-input>` 뒤에 배치한다.',
      },
    },
    codeTabs: {
      html: `<p class="text-xs text-gray-500">회사 이메일을 입력하세요</p>`,
      wc: `<ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>`,
      thymeleaf: `<ds-helper-text th:text="#{form.email.helper}"></ds-helper-text>`,
      react: `import { HelperText } from '@dx/react';

<HelperText>회사 이메일을 입력하세요</HelperText>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<ds-helper-text>회사 이메일을 입력하세요</ds-helper-text>`,
};
