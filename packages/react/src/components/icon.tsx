import React from 'react';
import { createComponent } from '@lit/react';
import { DsIcon as DsIconElement } from '@dx/core';

export interface IconProps extends Omit<React.ComponentProps<'span'>, 'ref'> {
  /** Lucide 아이콘 이름 (kebab-case). 예: "check", "chevron-down". */
  name?: string;
  ref?: React.Ref<DsIconElement>;
}

const IconComponent = createComponent({
  tagName: 'ds-icon',
  elementClass: DsIconElement,
  react: React,
  events: {},
});

export const Icon = IconComponent as unknown as React.FC<IconProps>;
