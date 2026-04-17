import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Label',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '폼 컨트롤에 붙는 라벨. `html-for` 속성으로 id를 연결하면 클릭 시 해당 컨트롤에 포커스가 간다. ' +
          '`required` 속성이 있으면 `*` 표시가 자동 추가된다.',
      },
    },
    codeTabs: {
      html: `<label for="email" class="text-sm font-medium">이메일</label>`,
      wc: `<ds-label html-for="email">이메일</ds-label>`,
      thymeleaf: `<ds-label th:attr="html-for=\${id}" th:text="#{form.email}"></ds-label>`,
      react: `import { Label } from '@dx/react';

<Label htmlFor="email">이메일</Label>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`<ds-label html-for="in-1">이메일</ds-label>`,
};

export const Required: Story = {
  render: () => html`<ds-label html-for="in-2" required>이름</ds-label>`,
};

export const WithInput: Story = {
  parameters: {
    docs: {
      description: {
        story: '`html-for`로 연결하면 라벨 클릭 시 입력창에 포커스가 간다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px; max-width: 320px;">
      <ds-label html-for="in-3">이메일</ds-label>
      <ds-input id="in-3" type="email"></ds-input>
    </div>
  `,
};
