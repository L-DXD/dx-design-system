import React from 'react';
import { createComponent } from '@lit/react';
import { DsBadge } from '@dx/core';

export const Badge = createComponent({
  tagName: 'ds-badge',
  elementClass: DsBadge,
  react: React,
  events: {},
});
