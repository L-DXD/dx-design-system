import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '타이포그래피 토큰. 숫자 스케일(xs, sm 등)보다 **의미 기반 토큰**(h1, body, caption 등)을 우선 사용한다. ' +
          '의미 토큰은 디자이너 의도가 드러나고, DS가 업데이트되어도 호환된다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ========================================================================
 *  1. Size Scale (숫자 기반)
 * ======================================================================== */

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

export const SizeScale: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'DS 내부용 숫자 스케일. 일반 화면에서는 아래 **Semantic Sizes(의미 토큰)** 를 우선 사용한다.',
      },
    },
  },
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

/* ========================================================================
 *  2. Semantic Sizes (역할 기반 + 용도 가이드)
 * ======================================================================== */

const SEMANTIC_SIZES = [
  {
    token: 'display',
    label: 'Display',
    sample: '가나다라 ABC 123',
    purpose: '가장 큰 타이포. 랜딩 페이지 Hero 등 강조가 필요한 자리.',
  },
  {
    token: 'h1',
    label: 'Heading 1',
    sample: '가나다라 ABC 123',
    purpose: '페이지의 최상위 제목. 페이지당 하나.',
  },
  {
    token: 'h2',
    label: 'Heading 2',
    sample: '가나다라 ABC 123',
    purpose: '주요 섹션 제목.',
  },
  {
    token: 'h3',
    label: 'Heading 3',
    sample: '가나다라 ABC 123',
    purpose: '하위 섹션 제목.',
  },
  {
    token: 'h4',
    label: 'Heading 4',
    sample: '가나다라 ABC 123',
    purpose: 'Card 제목 등 컴포넌트 단위 제목.',
  },
  {
    token: 'h5',
    label: 'Heading 5',
    sample: '가나다라 ABC 123',
    purpose: '작은 제목/소제목.',
  },
  {
    token: 'h6',
    label: 'Heading 6',
    sample: '가나다라 ABC 123',
    purpose: '본문과 비슷한 크기의 짧은 제목.',
  },
  {
    token: 'body',
    label: 'Body',
    sample: '다람쥐 헌 쳇바퀴에 타고파',
    purpose: '본문 기본 크기. 대부분의 텍스트.',
  },
  {
    token: 'body-sm',
    label: 'Body Small',
    sample: '다람쥐 헌 쳇바퀴에 타고파',
    purpose: '부가 본문, 카드 내 설명, 표 셀 등 조금 작은 본문.',
  },
  {
    token: 'caption',
    label: 'Caption',
    sample: '다람쥐 헌 쳇바퀴에 타고파',
    purpose: '가장 작은 보조 텍스트. 타임스탬프, 라벨, 저작권 표기 등.',
  },
];

export const SemanticSizes: Story = {
  parameters: {
    docs: {
      description: {
        story: '역할 기반 크기 토큰. 각 토큰의 용도가 명확하며, 서비스 전반에서 이 토큰을 사용한다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      ${SEMANTIC_SIZES.map(
        (s) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 1fr 320px;
              gap: 24px;
              align-items: center;
              padding: 16px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <code style="font-family: var(--dx-font-mono); font-size: 11px; color: var(--dx-color-muted-foreground);">
                --dx-font-size-${s.token}
              </code>
              <div style="font-size: var(--dx-font-size-${s.token}); font-weight: var(--dx-font-weight-semibold); line-height: var(--dx-line-height-snug);">
                ${s.label} — ${s.sample}
              </div>
            </div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.6;">
              <strong>언제 쓰나요?</strong><br/>${s.purpose}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

/* ========================================================================
 *  3. Weights (용도 포함)
 * ======================================================================== */

const WEIGHTS = [
  { name: 'regular', value: 400, purpose: '본문 텍스트의 기본 굵기.' },
  { name: 'medium', value: 500, purpose: '약한 강조. 라벨, 메뉴 항목.' },
  { name: 'semibold', value: 600, purpose: '제목, 버튼 라벨, 강조 텍스트.' },
  { name: 'bold', value: 700, purpose: '가장 강한 강조. 주요 제목.' },
];

export const Weights: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Font weight 4단계. 상황별 용도가 다르므로 아래 가이드를 따른다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${WEIGHTS.map(
        (w) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 180px 60px 1fr 280px;
              gap: 16px;
              align-items: center;
              padding: 12px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              --dx-font-weight-${w.name}
            </code>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${w.value}</div>
            <div style="font-size: 20px; font-weight: var(--dx-font-weight-${w.name});">
              다람쥐 The quick brown fox
            </div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${w.purpose}
            </div>
          </div>
        `
      )}
    </div>
  `,
};

/* ========================================================================
 *  4. Line Height & Letter Spacing
 * ======================================================================== */

const LINE_HEIGHTS = [
  { token: 'none', value: '1', purpose: '한 줄로 딱 맞추는 제목. 배지/버튼.' },
  { token: 'tight', value: '1.25', purpose: '제목(h1~h3). 간격 좁게.' },
  { token: 'snug', value: '1.375', purpose: 'h4~h6 등 작은 제목.' },
  { token: 'normal', value: '1.5', purpose: '본문 기본. 가독성과 밀도의 균형.' },
  { token: 'relaxed', value: '1.625', purpose: '긴 본문, 아티클 레이아웃.' },
  { token: 'loose', value: '2', purpose: '특수한 여백 강조 텍스트.' },
];

export const LineHeights: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${LINE_HEIGHTS.map(
        (lh) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 200px 60px 1fr;
              gap: 16px;
              align-items: start;
              padding: 16px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <div>
              <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground); display: block; margin-bottom: 4px;">
                --dx-line-height-${lh.token}
              </code>
              <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">
                ${lh.purpose}
              </div>
            </div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${lh.value}</div>
            <div style="font-size: 14px; line-height: var(--dx-line-height-${lh.token}); max-width: 500px;">
              다람쥐 헌 쳇바퀴에 타고파 다람쥐 헌 쳇바퀴에 타고파 다람쥐 헌 쳇바퀴에 타고파
              The quick brown fox jumps over the lazy dog.
            </div>
          </div>
        `
      )}
    </div>
  `,
};
