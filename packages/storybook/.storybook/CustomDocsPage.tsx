import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Canvas,
  Heading,
  useOf,
  Markdown,
} from '@storybook/blocks';
import { CodeTabsForStory } from './CodeTabsSource';

/**
 * 기본 autodocs 페이지를 대체. 각 스토리를 Canvas(소스 숨김) + 4탭 CodeTabsForStory로 렌더.
 */
export const CustomDocsPage: React.FC = () => {
  // meta에서 stories 목록 얻기
  // @ts-expect-error useOf flexible arg
  const resolvedMeta = useOf('meta', ['meta']);
  const csfFile = (resolvedMeta as { csfFile?: { stories?: Record<string, unknown> } })
    .csfFile;
  const stories = csfFile?.stories ? Object.values(csfFile.stories) : [];

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Title, null),
    React.createElement(Subtitle, null),
    React.createElement(Description, null),
    React.createElement(Primary, { sourceState: 'hidden' } as React.ComponentProps<
      typeof Primary
    >),
    React.createElement(CodeTabsForStory, { of: 'meta' }),
    React.createElement(Controls, null),
    stories.length > 1
      ? React.createElement(Heading, null, 'Stories')
      : null,
    ...stories.slice(1).map((story) => {
      const s = story as { id: string; name: string };
      return React.createElement(
        'section',
        { key: s.id, style: { marginTop: 24 } },
        React.createElement('h3', { style: { marginBottom: 8 } }, s.name),
        React.createElement(Canvas, {
          of: s,
          sourceState: 'hidden',
        } as React.ComponentProps<typeof Canvas>),
        React.createElement(CodeTabsForStory, { of: s }),
      );
    }),
  );
};
