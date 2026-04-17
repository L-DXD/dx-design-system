import React, { useState } from 'react';
import { useOf } from '@storybook/blocks';
import { SyntaxHighlighter } from '@storybook/components';

const TAB_ORDER = ['html', 'wc', 'thymeleaf', 'react'] as const;
const TAB_LABELS: Record<string, string> = {
  html: 'HTML/CSS',
  wc: 'Web Component',
  thymeleaf: 'Thymeleaf',
  react: 'React',
};
const TAB_LANGUAGES: Record<string, string> = {
  html: 'html',
  wc: 'html',
  thymeleaf: 'html',
  react: 'tsx',
};

/**
 * Docs 페이지에서 스토리의 "Show code" 영역을 4탭 버전으로 교체.
 * parameters.codeTabs에 { html, wc, thymeleaf, react } 문자열이 있으면 탭으로 렌더.
 * 없으면 기본 동작(Storybook이 자동 생성하는 단일 코드)으로 폴백.
 */
export const CodeTabsSource: React.FC<{ of?: unknown; code?: string; language?: string }> = (
  props,
) => {
  const [activeTab, setActiveTab] = useState<string>('wc');
  const [copied, setCopied] = useState(false);

  // Storybook 컨텍스트에서 현재 스토리의 parameters를 가져온다
  let codeTabs: Record<string, string> | undefined;
  try {
    // @ts-expect-error Storybook's useOf accepts 'story' type resolver
    const resolved = useOf(props.of ?? 'story', ['story', 'meta']);
    if (resolved.type === 'story') {
      codeTabs = resolved.story.parameters?.codeTabs;
    } else if (resolved.type === 'meta') {
      codeTabs = resolved.preparedMeta?.parameters?.codeTabs;
    }
  } catch {
    codeTabs = undefined;
  }

  // codeTabs가 없으면 기본 Source 동작 (전달받은 code를 그대로 렌더)
  if (!codeTabs) {
    return React.createElement(SyntaxHighlighter, {
      language: props.language ?? 'html',
      copyable: true,
    }, props.code ?? '');
  }

  const availableTabs = TAB_ORDER.filter((k) => Boolean(codeTabs?.[k]));
  const current = availableTabs.includes(activeTab as (typeof TAB_ORDER)[number])
    ? activeTab
    : availableTabs[0];

  const handleCopy = async () => {
    if (!current || !codeTabs) return;
    await navigator.clipboard.writeText(codeTabs[current]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return React.createElement(
    'div',
    {
      style: {
        border: '1px solid rgba(0,0,0,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
        margin: '16px 0',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          gap: 0,
          background: '#f6f9fc',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        },
      },
      ...availableTabs.map((key) =>
        React.createElement(
          'button',
          {
            key,
            type: 'button',
            onClick: () => {
              setActiveTab(key);
              setCopied(false);
            },
            style: {
              padding: '10px 16px',
              border: 'none',
              background: current === key ? '#fff' : 'transparent',
              color: current === key ? '#1ea7fd' : '#666',
              borderBottom: current === key ? '2px solid #1ea7fd' : '2px solid transparent',
              fontWeight: current === key ? 600 : 400,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            },
          },
          TAB_LABELS[key] ?? key,
        ),
      ),
      React.createElement(
        'button',
        {
          type: 'button',
          onClick: handleCopy,
          style: {
            marginLeft: 'auto',
            padding: '10px 16px',
            border: 'none',
            background: 'transparent',
            color: copied ? '#1ea7fd' : '#666',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
          },
        },
        copied ? 'Copied!' : 'Copy',
      ),
    ),
    current
      ? React.createElement(
          SyntaxHighlighter,
          {
            language: TAB_LANGUAGES[current] ?? 'html',
            copyable: false,
          },
          codeTabs[current] ?? '',
        )
      : null,
  );
};
