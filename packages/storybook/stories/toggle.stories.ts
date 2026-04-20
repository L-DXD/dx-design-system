import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import '@dx/core';

const meta: Meta = {
  title: 'Atoms/Toggle',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'On/Off 스위치. Checkbox와 동일하게 `<ds-form-field orientation="horizontal">` 로 Label과 조립.',
      },
    },
    codeTabs: {
      html: `<label class="inline-flex items-center gap-2 cursor-pointer">
  <input type="checkbox" id="notify" role="switch" class="sr-only peer" />
  <div class="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary"></div>
  <span class="text-sm font-medium">알림 수신</span>
</label>`,
      wc: `<ds-form-field orientation="horizontal">
  <ds-toggle id="notify"></ds-toggle>
  <ds-label html-for="notify">알림 수신</ds-label>
</ds-form-field>`,
      thymeleaf: `<ds-form-field orientation="horizontal">
  <ds-toggle th:id="\${id}" th:checked="\${enabled}"></ds-toggle>
  <ds-label th:attr="html-for=\${id}" th:text="#{setting.notifications}"></ds-label>
</ds-form-field>`,
      react: `import { FormField, Toggle, Label } from '@dx/react';

<FormField orientation="horizontal">
  <Toggle id="notify" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
  <Label htmlFor="notify">알림 수신</Label>
</FormField>`,
    },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-toggle id="toggle-default"></ds-toggle>
      <ds-label html-for="toggle-default">알림 수신</ds-label>
    </ds-form-field>
  `,
};

export const Checked: Story = {
  render: () => html`
    <ds-form-field orientation="horizontal">
      <ds-toggle id="toggle-checked" checked></ds-toggle>
      <ds-label html-for="toggle-checked">다크 모드 활성화</ds-label>
    </ds-form-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <ds-form-field orientation="horizontal">
        <ds-toggle id="toggle-dis-off" disabled></ds-toggle>
        <ds-label html-for="toggle-dis-off">비활성화 (꺼짐)</ds-label>
      </ds-form-field>
      <ds-form-field orientation="horizontal">
        <ds-toggle id="toggle-dis-on" disabled checked></ds-toggle>
        <ds-label html-for="toggle-dis-on">비활성화 (켜짐)</ds-label>
      </ds-form-field>
    </div>
  `,
};

export const SettingsPanel: Story = {
  parameters: {
    docs: {
      description: {
        story: '설정 패널에서 자주 쓰이는 Toggle + Label + HelperText 조합.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 420px;">
      <ds-form-field>
        <ds-form-field orientation="horizontal">
          <ds-toggle id="s-notify" checked></ds-toggle>
          <ds-label html-for="s-notify">이메일 알림</ds-label>
        </ds-form-field>
        <ds-helper-text>새 댓글, 멘션, 할당 등 중요한 이벤트를 이메일로 받습니다.</ds-helper-text>
      </ds-form-field>

      <ds-form-field>
        <ds-form-field orientation="horizontal">
          <ds-toggle id="s-push"></ds-toggle>
          <ds-label html-for="s-push">푸시 알림</ds-label>
        </ds-form-field>
        <ds-helper-text>브라우저 푸시 알림을 허용해야 동작합니다.</ds-helper-text>
      </ds-form-field>

      <ds-form-field>
        <ds-form-field orientation="horizontal">
          <ds-toggle id="s-dark"></ds-toggle>
          <ds-label html-for="s-dark">다크 모드</ds-label>
        </ds-form-field>
        <ds-helper-text>시스템 설정과 독립적으로 사용할 수 있습니다.</ds-helper-text>
      </ds-form-field>
    </div>
  `,
};
