import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Spacing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '4px 기반 간격 스케일. 컴포넌트 간격, 패딩, 마진의 기준. 자주 쓰는 값은 하단 **Usage Guide** 참고.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ========================================================================
 *  1. Scale — 전체 간격 스케일
 * ======================================================================== */

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

export const Scale: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 8px;">
      ${SPACING_SCALE.map(
        (s) => html`
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="flex: 0 0 100px; font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
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

/* ========================================================================
 *  2. Spacing Usage Guide — 자주 쓰는 간격과 용도
 * ======================================================================== */

const SPACING_USAGE = [
  { scale: '1', px: 4, purpose: '아이콘과 라벨 사이 같은 아주 가까운 간격.' },
  { scale: '2', px: 8, purpose: '버튼 내부 좌우 padding, inline 요소 간격.' },
  { scale: '3', px: 12, purpose: '작은 카드 padding, 리스트 항목 사이 간격.' },
  { scale: '4', px: 16, purpose: '기본 컴포넌트 padding, 표준 간격.' },
  { scale: '6', px: 24, purpose: 'Card 내부 padding, 섹션 내 요소 간격.' },
  { scale: '8', px: 32, purpose: '섹션 사이 수직 간격.' },
  { scale: '12', px: 48, purpose: '페이지 섹션 분리, 큰 섹션 헤더 위아래 여백.' },
  { scale: '16', px: 64, purpose: '페이지 최상단/최하단 큰 여백.' },
];

export const UsageGuide: Story = {
  parameters: {
    docs: {
      description: {
        story: '자주 쓰는 간격 값과 적용 시점. 4px 기반 스케일에서 골라 쓰되, 아래 값을 기본으로 삼는다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${SPACING_USAGE.map(
        (s) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 140px 60px 120px 1fr;
              gap: 16px;
              align-items: center;
              padding: 12px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <code style="font-size: 12px; font-family: var(--dx-font-mono); color: var(--dx-color-muted-foreground);">
              --dx-space-${s.scale}
            </code>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${s.px}px</div>
            <div
              style="
                height: 12px;
                width: var(--dx-space-${s.scale});
                background: var(--dx-color-primary);
                border-radius: 2px;
              "
            ></div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${s.purpose}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

/* ========================================================================
 *  3. Radius (용도 포함)
 * ======================================================================== */

const RADIUS_SCALE = [
  { name: 'none', px: 0, purpose: '직각 모서리. 코드 블록, 표 내부 등.' },
  { name: 'sm', px: 4, purpose: '배지, 작은 태그.' },
  { name: 'md', px: 8, purpose: '기본값. 버튼, 입력창, Card.' },
  { name: 'lg', px: 12, purpose: '큰 카드, 모달.' },
  { name: 'xl', px: 16, purpose: '강조된 이미지/카드.' },
  { name: '2xl', px: 24, purpose: '대형 히어로 섹션.' },
  { name: 'full', px: 9999, purpose: '원형 아바타, pill 버튼.' },
];

export const Radius: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
      ${RADIUS_SCALE.map(
        (r) => html`
          <div
            style="
              display: flex;
              flex-direction: column;
              gap: 8px;
              padding: 16px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <div
              style="
                width: 100%;
                aspect-ratio: 3/2;
                background: var(--dx-color-primary-subtle);
                border: 1px solid var(--dx-color-primary);
                border-radius: var(--dx-radius-${r.name === 'md' ? '' : r.name});
              "
            ></div>
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <code style="font-family: var(--dx-font-mono); font-size: 11px; color: var(--dx-color-muted-foreground);">
                radius-${r.name}
              </code>
              <span style="font-size: 11px; color: var(--dx-color-muted-foreground);">
                ${r.px === 9999 ? '∞' : `${r.px}px`}
              </span>
            </div>
            <div style="font-size: 11px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${r.purpose}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

/* ========================================================================
 *  4. Shadows (용도 포함)
 * ======================================================================== */

const SHADOWS = [
  { name: 'xs', purpose: '거의 보이지 않는 그림자. hover 약간 뜬 느낌.' },
  { name: 'sm', purpose: '버튼 hover, 작은 카드.' },
  { name: 'md', purpose: 'Card 기본 그림자.' },
  { name: 'lg', purpose: 'Dropdown, Popover.' },
  { name: 'xl', purpose: 'Modal.' },
  { name: '2xl', purpose: '가장 큰 레이어 (풀스크린 오버레이 위 다이얼로그 등).' },
];

export const Shadows: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 32px; padding: 16px;">
      ${SHADOWS.map(
        (s) => html`
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div
              style="
                width: 100%;
                height: 120px;
                background: var(--dx-color-background);
                border-radius: var(--dx-radius);
                box-shadow: var(--dx-shadow-${s.name});
              "
            ></div>
            <div>
              <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
                --dx-shadow-${s.name}
              </code>
            </div>
            <div style="font-size: 11px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${s.purpose}
            </div>
          </div>
        `
      )}
    </div>
  `,
};
