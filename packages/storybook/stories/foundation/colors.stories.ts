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
          'Primitive 팔레트(50~950)는 DS 내부용이며, 서비스는 semantic 토큰만 오버라이드한다. ' +
          '다크모드는 `.dark` 클래스 또는 `[data-theme="dark"]` 로 활성화된다.',
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

/* ========================================================================
 *  1. Primitive Palettes
 * ======================================================================== */

export const PrimitivePalettes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'DS 내부용 원시 팔레트. 모든 primitive 팔레트는 DS 개발용으로만 사용하고, ' +
          '일반 컴포넌트/화면에서는 직접 참조하지 않는다. 서비스 테마를 만들 때 semantic 토큰이 ' +
          'primitive를 가리키도록 설정한다.',
      },
    },
  },
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

/* ========================================================================
 *  2. Semantic Tokens (요약 스와치)
 * ======================================================================== */

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

export const SemanticTokens: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '역할(role) 기반 토큰. 컴포넌트와 화면에서 **항상 이 토큰을 사용**해야 다크모드와 ' +
          '서비스 테마 오버라이드가 자동 적용된다. 각 토큰의 의미는 아래 용도 가이드를 참고.',
      },
    },
  },
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
      ${SEMANTIC_TOKENS.map((token) =>
        swatch(`var(${token.name})`, token.label, token.name)
      )}
    </div>
  `,
};

/* ========================================================================
 *  3. 용도 가이드
 * ======================================================================== */

type TokenInfo = {
  name: string;
  token: string;
  description: string;
  whenToUse: string;
  example?: string;
};

const tokenCard = (info: TokenInfo, isBg = true) => {
  const bg = isBg ? `var(${info.token})` : 'var(--dx-color-background)';
  const fg = isBg ? 'var(--dx-color-foreground)' : `var(${info.token})`;
  const border = `1px solid var(--dx-color-border)`;

  return html`
    <div
      style="
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 16px;
        padding: 16px;
        border: ${border};
        border-radius: 8px;
        background: var(--dx-color-background);
      "
    >
      <div
        style="
          aspect-ratio: 1;
          background: ${bg};
          border: ${border};
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: ${fg};
        "
      >
        ${info.example ?? 'Aa'}
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <div style="font-weight: 600; font-size: 14px;">${info.name}</div>
        <code style="font-size: 11px; color: var(--dx-color-muted-foreground); font-family: var(--dx-font-mono);">
          ${info.token}
        </code>
        <div style="font-size: 13px; line-height: 1.5;">${info.description}</div>
        <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
          <strong>언제 쓰나요?</strong> ${info.whenToUse}
        </div>
      </div>
    </div>
  `;
};

const guideSection = (title: string, tokens: TokenInfo[], isBg = true) => html`
  <section style="margin-bottom: 40px;">
    <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid var(--dx-color-border);">
      ${title}
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 12px;">
      ${tokens.map((t) => tokenCard(t, isBg))}
    </div>
  </section>
`;

export const UsageGuide: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Semantic 토큰의 역할과 실무 사용 시점 정리. 처음 디자인 시스템을 쓰는 사람을 위한 참고 자료.',
      },
    },
  },
  render: () => html`
    <div style="max-width: 1200px;">
      ${guideSection('Surface — 배경과 면', [
        {
          name: 'Background',
          token: '--dx-color-background',
          description: '페이지와 컴포넌트의 가장 바깥쪽 기본 배경.',
          whenToUse: 'body, 최상위 컨테이너, 다이얼로그 내부 기본 배경. 거의 모든 화면의 바탕.',
        },
        {
          name: 'Foreground',
          token: '--dx-color-foreground',
          description: 'Background 위에 올라가는 주요 텍스트 색상.',
          whenToUse: '본문 텍스트, 제목 등 가독성이 가장 중요한 콘텐츠.',
          example: 'Aa',
        },
        {
          name: 'Surface',
          token: '--dx-color-surface',
          description: 'Background보다 살짝 뜬 면. Card/Panel 내부 배경.',
          whenToUse: '카드, 패널, 목록 항목처럼 배경과 살짝 구분되는 영역.',
        },
        {
          name: 'Surface Foreground',
          token: '--dx-color-surface-foreground',
          description: 'Surface 위에 올라가는 텍스트. 기본적으로 foreground와 동일.',
          whenToUse: '카드 내부 텍스트. 필요 시 별도 커스터마이징 가능.',
          example: 'Aa',
        },
        {
          name: 'Muted',
          token: '--dx-color-muted',
          description: '비활성/부가 정보용 배경. 회색톤의 옅은 배경.',
          whenToUse: 'Disabled 버튼 배경, 코드 블록 배경, 비활성 탭 배경, skeleton 배경 등.',
        },
        {
          name: 'Muted Foreground',
          token: '--dx-color-muted-foreground',
          description: '덜 중요한 텍스트. 부가 설명, placeholder, 보조 라벨.',
          whenToUse: '설명문, 힌트 텍스트, placeholder, timestamp, 캡션, 보조 정보.',
          example: 'Aa',
        },
      ])}

      ${guideSection('Primary — 주요 액션', [
        {
          name: 'Primary',
          token: '--dx-color-primary',
          description: '브랜드/서비스의 대표색. 가장 중요한 액션에 사용.',
          whenToUse: '주요 버튼(저장/제출/확인), 선택된 탭 강조, 링크, 활성 상태, 포커스 강조.',
        },
        {
          name: 'Primary Hover',
          token: '--dx-color-primary-hover',
          description: 'Primary의 hover 상태. 약간 더 짙은 톤.',
          whenToUse: 'Primary 버튼/링크의 :hover 상태.',
        },
        {
          name: 'Primary Foreground',
          token: '--dx-color-primary-foreground',
          description: 'Primary 배경 위 텍스트. 라이트모드에서 흰색.',
          whenToUse: 'Primary 버튼의 라벨 텍스트, Primary 배지의 텍스트.',
          example: 'Aa',
        },
        {
          name: 'Primary Subtle',
          token: '--dx-color-primary-subtle',
          description: 'Primary의 옅은 배경 톤. 영역 강조용.',
          whenToUse: 'Info 알림 배경, 선택된 아이템 배경, 태그 배경 등 Primary 톤의 영역 강조.',
        },
      ])}

      ${guideSection('Secondary — 보조 액션', [
        {
          name: 'Secondary',
          token: '--dx-color-secondary',
          description: '보조적인 액션을 나타내는 중성 톤.',
          whenToUse: '취소 버튼, 덜 중요한 액션, 보조 링크.',
        },
        {
          name: 'Secondary Hover',
          token: '--dx-color-secondary-hover',
          description: 'Secondary의 hover 상태.',
          whenToUse: 'Secondary 버튼의 :hover.',
        },
        {
          name: 'Secondary Foreground',
          token: '--dx-color-secondary-foreground',
          description: 'Secondary 배경 위 텍스트.',
          whenToUse: 'Secondary 버튼의 라벨.',
          example: 'Aa',
        },
      ])}

      ${guideSection('Status — 상태 전달', [
        {
          name: 'Success',
          token: '--dx-color-success',
          description: '성공/완료/긍정 상태를 나타내는 녹색.',
          whenToUse: '완료 배지, 성공 아이콘, 유효성 통과 표시, 온라인 상태 표시.',
        },
        {
          name: 'Success Subtle',
          token: '--dx-color-success-subtle',
          description: 'Success의 옅은 배경.',
          whenToUse: '성공 알림 영역 배경, "승인됨" 같은 긍정 태그 배경.',
        },
        {
          name: 'Warning',
          token: '--dx-color-warning',
          description: '경고/주의가 필요한 상태를 나타내는 호박색.',
          whenToUse: '경고 배지, 주의 필요 알림, "진행 중/대기" 같은 중간 상태 표시.',
        },
        {
          name: 'Warning Subtle',
          token: '--dx-color-warning-subtle',
          description: 'Warning의 옅은 배경.',
          whenToUse: '경고 알림 영역 배경.',
        },
        {
          name: 'Danger',
          token: '--dx-color-danger',
          description: '오류/위험/삭제 같은 부정적 의미의 빨간색.',
          whenToUse: '삭제 버튼, 유효성 오류 메시지, 에러 아이콘, "실패" 배지.',
        },
        {
          name: 'Danger Hover',
          token: '--dx-color-danger-hover',
          description: 'Danger의 hover 상태.',
          whenToUse: '삭제 버튼의 :hover.',
        },
        {
          name: 'Danger Subtle',
          token: '--dx-color-danger-subtle',
          description: 'Danger의 옅은 배경.',
          whenToUse: '에러 메시지 영역 배경, 삭제 확인 영역 배경.',
        },
      ])}

      ${guideSection('Border / Input / Ring — 경계와 포커스', [
        {
          name: 'Border',
          token: '--dx-color-border',
          description: '일반적인 경계선 색상.',
          whenToUse: 'Card 테두리, divider, 표 경계, 섹션 구분선 등 일반 border.',
        },
        {
          name: 'Input',
          token: '--dx-color-input',
          description: '입력창(Input/Select/Textarea 등)의 경계선.',
          whenToUse: 'Input, Select, Textarea, Checkbox, Radio의 테두리.',
        },
        {
          name: 'Ring',
          token: '--dx-color-ring',
          description: '포커스 링 색상 (키보드 탐색 시 나타나는 outline).',
          whenToUse: ':focus-visible 상태의 outline/box-shadow.',
        },
      ])}
    </div>
  `,
};

/* ========================================================================
 *  4. 서비스 테마 오버라이드 가이드
 * ======================================================================== */

export const ThemeOverride: Story = {
  name: 'Theme Override',
  parameters: {
    docs: {
      description: {
        story:
          '서비스에서 브랜드 컬러를 바꾸는 방법. Tailwind를 함께 사용하면 22개 팔레트 중 선택 가능.',
      },
    },
  },
  render: () => html`
    <div style="max-width: 900px; display: flex; flex-direction: column; gap: 24px;">
      <section>
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">방법 1: Tailwind 팔레트 사용 (권장)</h3>
        <p style="font-size: 13px; color: var(--dx-color-muted-foreground); margin: 0 0 12px 0; line-height: 1.6;">
          서비스에서 Tailwind CSS를 import하면 Tailwind의 22개 컬러 팔레트
          (<code>--color-indigo-600</code>, <code>--color-rose-500</code> 등)를
          바로 쓸 수 있다. 원하는 팔레트를 선택해 DS의 semantic 토큰을 오버라이드한다.
        </p>
        <pre style="margin: 0; padding: 16px; background: var(--dx-color-muted); border-radius: 6px; overflow: auto; font-size: 12px; font-family: var(--dx-font-mono);"><code>/* theme.css */
:root {
  --dx-color-primary: var(--color-indigo-600);
  --dx-color-primary-hover: var(--color-indigo-700);
  --dx-color-primary-foreground: var(--color-white);
  --dx-color-ring: var(--color-indigo-500);
}</code></pre>
      </section>

      <section>
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">방법 2: OKLCH 값 직접 지정</h3>
        <p style="font-size: 13px; color: var(--dx-color-muted-foreground); margin: 0 0 12px 0; line-height: 1.6;">
          특정 브랜드 컬러(#RRGGBB 또는 oklch 값)가 있다면 직접 지정.
        </p>
        <pre style="margin: 0; padding: 16px; background: var(--dx-color-muted); border-radius: 6px; overflow: auto; font-size: 12px; font-family: var(--dx-font-mono);"><code>/* theme.css */
:root {
  --dx-color-primary: oklch(0.55 0.25 255);
  --dx-color-primary-hover: oklch(0.48 0.25 255);
}</code></pre>
      </section>

      <section>
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">방법 3: DS primitive 팔레트 사용</h3>
        <p style="font-size: 13px; color: var(--dx-color-muted-foreground); margin: 0 0 12px 0; line-height: 1.6;">
          DS가 기본 제공하는 5개 팔레트(neutral/primary/success/warning/danger) 안에서 다른 shade를 선택.
        </p>
        <pre style="margin: 0; padding: 16px; background: var(--dx-color-muted); border-radius: 6px; overflow: auto; font-size: 12px; font-family: var(--dx-font-mono);"><code>/* theme.css */
:root {
  --dx-color-primary: var(--dx-palette-primary-700);
  --dx-color-primary-hover: var(--dx-palette-primary-800);
}</code></pre>
      </section>
    </div>
  `,
};
