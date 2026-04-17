import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '4px 기반 간격 스케일. Tailwind와 동일. 컴포넌트 간격, 패딩, 마진의 기준.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SPACING_SCALE = [
  { name: '0', px: 0 },
  { name: '0-5', px: 2 },
  { name: '1', px: 4 },
  { name: '1-5', px: 6 },
  { name: '2', px: 8 },
  { name: '2-5', px: 10 },
  { name: '3', px: 12 },
  { name: '3-5', px: 14 },
  { name: '4', px: 16 },
  { name: '5', px: 20 },
  { name: '6', px: 24 },
  { name: '7', px: 28 },
  { name: '8', px: 32 },
  { name: '10', px: 40 },
  { name: '12', px: 48 },
  { name: '14', px: 56 },
  { name: '16', px: 64 },
  { name: '20', px: 80 },
  { name: '24', px: 96 },
];

const RADIUS_SCALE = [
  { name: 'none', px: 0 },
  { name: 'sm', px: 4 },
  { name: 'md', px: 8 },
  { name: 'lg', px: 12 },
  { name: 'xl', px: 16 },
  { name: '2xl', px: 24 },
  { name: 'full', px: 9999 },
];

export const Scale: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${SPACING_SCALE.map(
        (s) => html`
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="flex: 0 0 80px; font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              space-${s.name}
            </div>
            <div style="flex: 0 0 60px; font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              ${s.px}px
            </div>
            <div
              style="
                height: 16px;
                width: var(--dx-space-${s.name});
                background: var(--dx-color-primary);
                border-radius: 2px;
              "
            ></div>
          </div>
        `
      )}
    </div>
  `,
};

export const Radius: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px;">
      ${RADIUS_SCALE.map(
        (r) => html`
          <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <div
              style="
                width: 80px;
                height: 80px;
                background: var(--dx-color-primary-subtle);
                border: 1px solid var(--dx-color-primary);
                border-radius: var(--dx-radius-${r.name === 'md' ? '' : r.name});
              "
            ></div>
            <div style="font-family: var(--dx-font-mono); font-size: 11px; color: var(--dx-color-muted-foreground); text-align: center;">
              radius-${r.name}<br/>${r.px === 9999 ? '∞' : `${r.px}px`}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

export const Shadows: Story = {
  render: () => {
    const shadows = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    return html`
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 32px; padding: 16px;">
        ${shadows.map(
          (s) => html`
            <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
              <div
                style="
                  width: 120px;
                  height: 120px;
                  background: var(--dx-color-background);
                  border-radius: var(--dx-radius);
                  box-shadow: var(--dx-shadow-${s});
                "
              ></div>
              <div style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
                shadow-${s}
              </div>
            </div>
          `
        )}
      </div>
    `;
  },
};
