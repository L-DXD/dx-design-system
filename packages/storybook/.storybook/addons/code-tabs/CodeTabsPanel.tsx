import React, { useState } from 'react';
import { useParameter } from '@storybook/manager-api';

const TAB_LABELS: Record<string, string> = {
  html: 'HTML/CSS',
  wc: 'Web Component',
  thymeleaf: 'Thymeleaf',
  react: 'React',
};

export const CodeTabsPanel: React.FC<{ active: boolean }> = ({ active }) => {
  const codeTabs = useParameter<Record<string, string>>('codeTabs', {});
  const tabKeys = Object.keys(codeTabs);
  const [activeTab, setActiveTab] = useState(tabKeys[0] || 'html');
  const [copied, setCopied] = useState(false);

  if (!active || tabKeys.length === 0) {
    return React.createElement('div', { style: { padding: 16 } }, 'No code tabs defined for this story.');
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeTabs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return React.createElement('div', { style: { padding: 16 } },
    React.createElement('div', { style: { display: 'flex', gap: 4, marginBottom: 12 } },
      ...tabKeys.map((key) =>
        React.createElement('button', {
          key,
          onClick: () => { setActiveTab(key); setCopied(false); },
          style: {
            padding: '6px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            background: activeTab === key ? '#1ea7fd' : '#fff',
            color: activeTab === key ? '#fff' : '#333',
            cursor: 'pointer',
            fontSize: 13,
          },
        }, TAB_LABELS[key] || key)
      ),
      React.createElement('button', {
        onClick: handleCopy,
        style: { marginLeft: 'auto', padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
      }, copied ? 'Copied!' : 'Copy')
    ),
    React.createElement('pre', {
      style: {
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: 16,
        borderRadius: 8,
        overflow: 'auto',
        fontSize: 13,
        lineHeight: 1.5,
      },
    }, React.createElement('code', null, codeTabs[activeTab]))
  );
};
