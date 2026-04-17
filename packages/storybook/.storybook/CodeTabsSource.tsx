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

type CodeTabsMap = Partial<Record<(typeof TAB_ORDER)[number], string>>;

/**
 * 특정 스토리의 codeTabs를 4탭 UI로 렌더.
 * CustomDocsPage에서 <Stories /> 대신 직접 사용한다.
 */
export const CodeTabsForStory: React.FC<{ of: unknown }> = ({ of }) => {
  const [activeTab, setActiveTab] = useState<string>('wc');
  const [copied, setCopied] = useState(false);

  let codeTabs: CodeTabsMap | undefined;
  try {
    // @ts-expect-error useOf flexible arg
    const resolved = useOf(of, ['story', 'meta']);
    if (resolved.type === 'story') {
      codeTabs = resolved.story.parameters?.codeTabs as CodeTabsMap | undefined;
    } else if (resolved.type === 'meta') {
      codeTabs = resolved.preparedMeta?.parameters?.codeTabs as CodeTabsMap | undefined;
    }
  } catch {
    codeTabs = undefined;
  }

  if (!codeTabs) return null;

  const availableTabs = TAB_ORDER.filter((k) => Boolean(codeTabs?.[k]));
  if (availableTabs.length === 0) return null;

  const current = availableTabs.includes(activeTab as (typeof TAB_ORDER)[number])
    ? activeTab
    : availableTabs[0];
  const currentCode = (codeTabs?.[current as keyof CodeTabsMap] ?? '').trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
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
        margin: '16px 0 24px 0',
      },
    },
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
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
              borderBottom:
                current === key ? '2px solid #1ea7fd' : '2px solid transparent',
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
    React.createElement(
      SyntaxHighlighter,
      {
        language: TAB_LANGUAGES[current] ?? 'html',
        copyable: false,
        format: false,
      },
      currentCode,
    ),
  );
};
