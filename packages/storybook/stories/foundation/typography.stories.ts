import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '타이포그래피 토큰. 기본 스케일(2xs~6xl)과 의미 기반(display/h1~h6/body/caption)을 함께 제공한다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const SIZE_SCALE = [
  { name: '6xl', px: 60 },
  { name: '5xl', px: 48 },
  { name: '4xl', px: 36 },
  { name: '3xl', px: 30 },
  { name: '2xl', px: 24 },
  { name: 'xl', px: 20 },
  { name: 'lg', px: 18 },
  { name: 'base', px: 16 },
  { name: 'sm', px: 14 },
  { name: 'xs', px: 12 },
  { name: '2xs', px: 10 },
];

const SEMANTIC_SIZES = [
  { token: 'display', label: 'Display', sample: '가나다라 ABC 123' },
  { token: 'h1', label: 'Heading 1', sample: '가나다라 ABC 123' },
  { token: 'h2', label: 'Heading 2', sample: '가나다라 ABC 123' },
  { token: 'h3', label: 'Heading 3', sample: '가나다라 ABC 123' },
  { token: 'h4', label: 'Heading 4', sample: '가나다라 ABC 123' },
  { token: 'h5', label: 'Heading 5', sample: '가나다라 ABC 123' },
  { token: 'h6', label: 'Heading 6', sample: '가나다라 ABC 123' },
  { token: 'body', label: 'Body', sample: '다람쥐 헌 쳇바퀴에 타고파' },
  { token: 'body-sm', label: 'Body Small', sample: '다람쥐 헌 쳇바퀴에 타고파' },
  { token: 'caption', label: 'Caption', sample: '다람쥐 헌 쳇바퀴에 타고파' },
];

const WEIGHTS = [
  { name: 'regular', value: 400 },
  { name: 'medium', value: 500 },
  { name: 'semibold', value: 600 },
  { name: 'bold', value: 700 },
];

export const SizeScale: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${SIZE_SCALE.map(
        (size) => html`
          <div style="display: flex; align-items: baseline; gap: 24px; border-bottom: 1px solid var(--dx-color-border); padding-bottom: 12px;">
            <div style="flex: 0 0 80px; font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              ${size.name} · ${size.px}px
            </div>
            <div style="font-size: var(--dx-font-size-${size.name});">
              다람쥐 헌 쳇바퀴에 타고파 Ag
            </div>
          </div>
        `
      )}
    </div>
  `,
};

export const SemanticSizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 20px;">
      ${SEMANTIC_SIZES.map(
        (s) => html`
          <div>
            <div style="font-family: var(--dx-font-mono); font-size: 11px; color: var(--dx-color-muted-foreground); margin-bottom: 4px;">
              --dx-font-size-${s.token}
            </div>
            <div style="font-size: var(--dx-font-size-${s.token}); font-weight: var(--dx-font-weight-semibold); line-height: var(--dx-line-height-snug);">
              ${s.label} — ${s.sample}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

export const Weights: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${WEIGHTS.map(
        (w) => html`
          <div style="display: flex; align-items: baseline; gap: 24px;">
            <div style="flex: 0 0 140px; font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              ${w.name} (${w.value})
            </div>
            <div style="font-size: 20px; font-weight: var(--dx-font-weight-${w.name});">
              다람쥐 헌 쳇바퀴에 타고파 The quick brown fox
            </div>
          </div>
        `
      )}
    </div>
  `,
};
