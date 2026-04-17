import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Colors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '디자인 시스템의 컬러 시스템. OKLCH 색 공간 사용 (Tailwind v4 호환). ' +
          'Primitive 팔레트(50~950)는 DS 내부용이며, 서비스는 semantic 토큰만 오버라이드한다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const PALETTES = [
  { name: 'neutral', label: 'Neutral (slate)' },
  { name: 'primary', label: 'Primary (blue)' },
  { name: 'success', label: 'Success (green)' },
  { name: 'warning', label: 'Warning (amber)' },
  { name: 'danger', label: 'Danger (red)' },
];

const SHADES = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const SEMANTIC_TOKENS = [
  { name: '--dx-color-primary', label: 'primary' },
  { name: '--dx-color-primary-hover', label: 'primary-hover' },
  { name: '--dx-color-primary-foreground', label: 'primary-foreground' },
  { name: '--dx-color-primary-subtle', label: 'primary-subtle' },
  { name: '--dx-color-secondary', label: 'secondary' },
  { name: '--dx-color-success', label: 'success' },
  { name: '--dx-color-warning', label: 'warning' },
  { name: '--dx-color-danger', label: 'danger' },
  { name: '--dx-color-background', label: 'background' },
  { name: '--dx-color-foreground', label: 'foreground' },
  { name: '--dx-color-surface', label: 'surface' },
  { name: '--dx-color-muted', label: 'muted' },
  { name: '--dx-color-muted-foreground', label: 'muted-foreground' },
  { name: '--dx-color-border', label: 'border' },
  { name: '--dx-color-ring', label: 'ring' },
];

const swatch = (color: string, label: string, token: string) => html`
  <div style="display:flex;flex-direction:column;gap:4px;">
    <div
      style="
        width: 100%;
        aspect-ratio: 2/1;
        background: ${color};
        border-radius: 6px;
        border: 1px solid var(--dx-color-border);
      "
    ></div>
    <div style="font-size: 12px; font-weight: 600;">${label}</div>
    <div style="font-size: 11px; color: var(--dx-color-muted-foreground); font-family: var(--dx-font-mono);">
      ${token}
    </div>
  </div>
`;

export const PrimitivePalettes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 32px;">
      ${PALETTES.map(
        (palette) => html`
          <section>
            <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              ${palette.label}
            </h3>
            <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px;">
              ${SHADES.filter((s) => palette.name !== 'neutral' ? s !== 0 : true).map(
                (shade) => {
                  const tokenName = `--dx-palette-${palette.name}-${shade}`;
                  return swatch(`var(${tokenName})`, String(shade), tokenName);
                }
              )}
            </div>
          </section>
        `
      )}
    </div>
  `,
};

export const SemanticTokens: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
      ${SEMANTIC_TOKENS.map((token) =>
        swatch(`var(${token.name})`, token.label, token.name)
      )}
    </div>
  `,
};
