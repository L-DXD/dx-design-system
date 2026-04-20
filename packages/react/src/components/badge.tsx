import React from 'react';
import { createComponent } from '@lit/react';
import { DsBadge as DsBadgeElement } from '@dx/core';

export interface BadgeProps extends Omit<React.ComponentProps<'span'>, 'ref'> {
  variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger';
  pill?: boolean;
  pulse?: boolean;
  ref?: React.Ref<DsBadgeElement>;
}

const BadgeComponent = createComponent({
  tagName: 'ds-badge',
  elementClass: DsBadgeElement as unknown as { new (): HTMLElement },
  react: React,
  events: {},
});

export const Badge = BadgeComponent as unknown as React.FC<BadgeProps>;
