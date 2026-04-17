import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/용어집',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Semantic 토큰의 역할과 사용 시점 정리. ' +
          '모든 컴포넌트/스타일링은 **semantic 토큰**을 참조해야 하며, primitive 팔레트(`--dx-palette-*`)는 직접 쓰지 않는다. ' +
          '이렇게 해야 서비스별 테마 오버라이드와 다크모드가 자동으로 적용된다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

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

const section = (title: string, tokens: TokenInfo[], isBg = true) => html`
  <section style="margin-bottom: 40px;">
    <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid var(--dx-color-border);">
      ${title}
    </h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 12px;">
      ${tokens.map((t) => tokenCard(t, isBg))}
    </div>
  </section>
`;

export const ColorTokens: Story = {
  render: () => html`
    <div style="max-width: 1200px;">
      ${section('Surface — 배경과 면', [
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

      ${section('Primary — 주요 액션', [
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

      ${section('Secondary — 보조 액션', [
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

      ${section('Status — 상태 전달', [
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

      ${section('Border / Input / Ring — 경계와 포커스', [
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

const typographyRows: Array<{ token: string; purpose: string; example: string }> = [
  { token: 'font-size-display', purpose: '가장 큰 타이포. 랜딩 페이지 Hero 등 강조가 필요한 자리.', example: '다람쥐 Ag' },
  { token: 'font-size-h1', purpose: '페이지의 최상위 제목.', example: '다람쥐 Ag' },
  { token: 'font-size-h2', purpose: '주요 섹션 제목.', example: '다람쥐 Ag' },
  { token: 'font-size-h3', purpose: '하위 섹션 제목.', example: '다람쥐 Ag' },
  { token: 'font-size-h4', purpose: 'Card 제목 등 컴포넌트 단위 제목.', example: '다람쥐 Ag' },
  { token: 'font-size-h5', purpose: '작은 제목/소제목.', example: '다람쥐 Ag' },
  { token: 'font-size-h6', purpose: '본문과 비슷한 크기의 짧은 제목.', example: '다람쥐 Ag' },
  { token: 'font-size-body', purpose: '본문 기본 크기. 대부분의 텍스트.', example: '다람쥐 Ag' },
  { token: 'font-size-body-sm', purpose: '부가 본문, 카드 내 설명, 표 셀 등 조금 작은 본문.', example: '다람쥐 Ag' },
  { token: 'font-size-caption', purpose: '가장 작은 보조 텍스트. 타임스탬프, 라벨, 저작권 표기 등.', example: '다람쥐 Ag' },
];

export const TypographyTokens: Story = {
  render: () => html`
    <div style="max-width: 900px;">
      <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">타이포그래피 용도</h2>
      <p style="font-size: 14px; color: var(--dx-color-muted-foreground); margin: 0 0 24px 0;">
        숫자 스케일(xs, sm 등)보다 <strong>의미 기반 토큰</strong>(h1, body, caption 등)을 우선 사용한다.
        의미 토큰은 디자이너 의도가 드러나고, DS가 업데이트되어도 호환된다.
      </p>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${typographyRows.map(
          (r) => html`
            <div
              style="
                display: grid;
                grid-template-columns: 200px 1fr 200px;
                gap: 16px;
                align-items: center;
                padding: 12px;
                border: 1px solid var(--dx-color-border);
                border-radius: 8px;
              "
            >
              <code style="font-size: 12px; font-family: var(--dx-font-mono); color: var(--dx-color-muted-foreground);">
                --dx-${r.token}
              </code>
              <div style="font-size: var(--dx-${r.token}); font-weight: 600;">${r.example}</div>
              <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
                ${r.purpose}
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

const weightRows = [
  { token: 'regular', value: 400, purpose: '본문 텍스트의 기본 굵기.' },
  { token: 'medium', value: 500, purpose: '약한 강조. 라벨, 메뉴 항목.' },
  { token: 'semibold', value: 600, purpose: '제목, 버튼 라벨, 강조 텍스트.' },
  { token: 'bold', value: 700, purpose: '가장 강한 강조. 주요 제목.' },
];

export const WeightTokens: Story = {
  render: () => html`
    <div style="max-width: 900px;">
      <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">Font Weight 용도</h2>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${weightRows.map(
          (w) => html`
            <div
              style="
                display: grid;
                grid-template-columns: 200px 60px 1fr 1fr;
                gap: 16px;
                align-items: center;
                padding: 12px;
                border: 1px solid var(--dx-color-border);
                border-radius: 8px;
              "
            >
              <code style="font-size: 12px; font-family: var(--dx-font-mono); color: var(--dx-color-muted-foreground);">
                --dx-font-weight-${w.token}
              </code>
              <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${w.value}</div>
              <div style="font-size: 18px; font-weight: var(--dx-font-weight-${w.token});">
                다람쥐 The quick brown fox
              </div>
              <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
                ${w.purpose}
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `,
};

const spacingRows = [
  { scale: '1', px: 4, purpose: '아이콘과 라벨 사이 같은 아주 가까운 간격.' },
  { scale: '2', px: 8, purpose: '버튼 내부 좌우 padding, inline 요소 간격.' },
  { scale: '3', px: 12, purpose: '작은 카드 padding, 리스트 항목 사이 간격.' },
  { scale: '4', px: 16, purpose: '기본 컴포넌트 padding, 표준 간격.' },
  { scale: '6', px: 24, purpose: 'Card 내부 padding, 섹션 내 요소 간격.' },
  { scale: '8', px: 32, purpose: '섹션 사이 수직 간격.' },
  { scale: '12', px: 48, purpose: '페이지 섹션 분리, 큰 섹션 헤더 위아래 여백.' },
  { scale: '16', px: 64, purpose: '페이지 최상단/최하단 큰 여백.' },
];

export const SpacingTokens: Story = {
  render: () => html`
    <div style="max-width: 900px;">
      <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px 0;">자주 쓰는 Spacing 가이드</h2>
      <p style="font-size: 14px; color: var(--dx-color-muted-foreground); margin: 0 0 24px 0;">
        4px 기반 스케일. 전체 스케일은 <code>Foundation/Spacing</code> 참고.
      </p>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${spacingRows.map(
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
    </div>
  `,
};
