import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

const meta: Meta = {
  title: 'Foundation/Grid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Breakpoint · Container · Grid 토큰. Tailwind v4 기본값과 정렬되어 있다. ' +
          'CSS 변수는 `@media` 인자로 직접 쓸 수 없으므로, 실제 반응형 분기는 ' +
          '`@media (min-width: 768px)` 리터럴 또는 Tailwind `md:` 접두사로 작성한다. ' +
          '토큰은 ① 값의 SSOT, ② JavaScript 런타임 참조, ③ 테마 오버라이드 일관성 용도.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* ========================================================================
 *  1. Breakpoints — Tailwind v4 기본값과 정렬된 5단계
 * ======================================================================== */

const BREAKPOINTS = [
  { name: 'sm', token: '--dx-breakpoint-sm', px: 640, device: '모바일 가로', usage: '한 줄 레이아웃 시작점' },
  { name: 'md', token: '--dx-breakpoint-md', px: 768, device: '태블릿 세로', usage: '2-column 레이아웃 분기' },
  { name: 'lg', token: '--dx-breakpoint-lg', px: 1024, device: '노트북', usage: '사이드바 노출' },
  { name: 'xl', token: '--dx-breakpoint-xl', px: 1280, device: '데스크탑', usage: '페이지 폭 확대' },
  { name: '2xl', token: '--dx-breakpoint-2xl', px: 1536, device: '대형 모니터', usage: '최대 폭 도달' },
];

export const Breakpoints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '반응형 분기점 5단계. 값은 Tailwind 기본값과 동일하므로 `md:` 유틸을 쓰는 소비자와 자동 정렬된다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${BREAKPOINTS.map(
        (b) => html`
          <div
            style="
              display: grid;
              grid-template-columns: 60px 1fr 80px 180px 1fr;
              gap: 16px;
              align-items: center;
              padding: 12px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-foreground);">
              ${b.name}
            </code>
            <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              var(${b.token})
            </code>
            <div style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
              ${b.px}px
            </div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground);">${b.device}</div>
            <div style="font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.5;">
              ${b.usage}
            </div>
          </div>
        `,
      )}
    </div>
  `,
};

/* ========================================================================
 *  2. Container — 각 breakpoint의 max-width 시각화
 * ======================================================================== */

const CONTAINERS = [
  { name: 'sm', token: '--dx-container-sm', px: 640 },
  { name: 'md', token: '--dx-container-md', px: 768 },
  { name: 'lg', token: '--dx-container-lg', px: 1024 },
  { name: 'xl', token: '--dx-container-xl', px: 1280 },
  { name: '2xl', token: '--dx-container-2xl', px: 1536 },
];

export const Container: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '각 breakpoint에서 활성화되는 container max-width. 회색 배경 + 중앙 정렬 박스로 나란히 표시한다. ' +
          '실제 활성 container 는 Storybook viewport toolbar 로 크기를 바꿔가며 확인.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${CONTAINERS.map(
        (c) => html`
          <div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 6px;
              "
            >
              <code style="font-family: var(--dx-font-mono); font-size: 12px; color: var(--dx-color-muted-foreground);">
                var(${c.token})
              </code>
              <span style="font-size: 12px; color: var(--dx-color-muted-foreground);">${c.px}px</span>
            </div>
            <div
              style="
                position: relative;
                height: 48px;
                background: var(--dx-color-muted);
                border-radius: 4px;
                overflow: hidden;
              "
            >
              <div
                style="
                  width: min(100%, var(${c.token}));
                  height: 100%;
                  margin: 0 auto;
                  background: var(--dx-color-primary-subtle);
                  border-left: 2px solid var(--dx-color-primary);
                  border-right: 2px solid var(--dx-color-primary);
                "
              ></div>
            </div>
          </div>
        `,
      )}
    </div>
  `,
};

/* ========================================================================
 *  3. Grid Overlay — 12 columns + 24px gutter 시각화
 * ======================================================================== */

export const GridOverlay: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '12 columns + 24px gutter 가 실제로 어떻게 보이는지 오버레이로 시연. ' +
          '컬럼 개수는 `--dx-grid-columns`, gutter 는 `--dx-grid-gutter` (=`--dx-space-6`) 토큰으로 제어.',
      },
    },
  },
  render: () => html`
    <div
      style="
        display: grid;
        grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
        gap: var(--dx-grid-gutter);
        padding: 16px;
        border: 1px dashed var(--dx-color-border);
        border-radius: 8px;
      "
    >
      ${Array.from({ length: 12 }, (_, i) => i + 1).map(
        (i) => html`
          <div
            style="
              background: var(--dx-color-primary-subtle);
              border: 1px solid var(--dx-color-primary);
              border-radius: 4px;
              padding: 16px 8px;
              text-align: center;
              font-family: var(--dx-font-mono);
              font-size: 12px;
              color: var(--dx-color-primary-hover);
            "
          >
            ${i}
          </div>
        `,
      )}
    </div>
    <div style="margin-top: 16px; font-size: 12px; color: var(--dx-color-muted-foreground); line-height: 1.6;">
      <strong>columns:</strong> <code>var(--dx-grid-columns)</code> = 12<br />
      <strong>gutter:</strong> <code>var(--dx-grid-gutter)</code> = <code>var(--dx-space-6)</code> = 24px
    </div>
  `,
};

/* ========================================================================
 *  4. Usage Guide — 3가지 사용법 코드 예시
 * ======================================================================== */

const USAGE_EXAMPLES = [
  {
    title: '1. @media 리터럴',
    note: '가장 흔한 경우. CSS 변수는 @media 인자로 쓸 수 없으므로 리터럴 값을 직접 입력.',
    lang: 'css',
    code: `@media (min-width: 768px) {
  .my-layout {
    display: grid;
    grid-template-columns: repeat(var(--dx-grid-columns), 1fr);
    gap: var(--dx-grid-gutter);
  }
}`,
  },
  {
    title: '2. Tailwind 유틸 클래스',
    note: 'Tailwind 를 설치한 소비자 전용. 접두사(`md:`)가 `--dx-breakpoint-md` 와 같은 지점에서 반응.',
    lang: 'html',
    code: `<div class="md:grid md:grid-cols-12 md:gap-6">
  <!-- ... -->
</div>`,
  },
  {
    title: '3. JavaScript 참조',
    note: '브라우저 전용. Next.js RSC / Thymeleaf 서버 렌더 중에는 window 가 없으므로 반드시 가드.',
    lang: 'ts',
    code: `if (typeof window !== 'undefined') {
  const md = parseInt(
    getComputedStyle(document.documentElement)
      .getPropertyValue('--dx-breakpoint-md'),
  );
  if (window.innerWidth >= md) { /* ... */ }
}`,
  },
];

export const UsageGuide: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Breakpoint / Grid 토큰을 쓰는 3가지 방법. ' +
          '환경(CSS / Tailwind / JS)별로 골라 쓴다.',
      },
    },
  },
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 24px;">
      ${USAGE_EXAMPLES.map(
        (ex) => html`
          <div
            style="
              padding: 16px;
              border: 1px solid var(--dx-color-border);
              border-radius: 8px;
            "
          >
            <div
              style="
                font-size: 14px;
                font-weight: var(--dx-font-weight-semibold);
                color: var(--dx-color-foreground);
                margin-bottom: 6px;
              "
            >
              ${ex.title}
            </div>
            <div
              style="
                font-size: 12px;
                color: var(--dx-color-muted-foreground);
                line-height: 1.6;
                margin-bottom: 12px;
              "
            >
              ${ex.note}
            </div>
            <pre
              style="
                background: var(--dx-color-muted);
                padding: 12px;
                border-radius: 4px;
                font-family: var(--dx-font-mono);
                font-size: 12px;
                line-height: 1.6;
                overflow-x: auto;
                margin: 0;
              "
            ><code>${ex.code}</code></pre>
          </div>
        `,
      )}
    </div>
  `,
};
