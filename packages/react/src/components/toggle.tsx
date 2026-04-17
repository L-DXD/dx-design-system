import React from 'react';
import { createComponent } from '@lit/react';
import { DsToggle } from '@dx/core';

export const Toggle = createComponent({
  tagName: 'ds-toggle',
  elementClass: DsToggle,
  react: React,
  events: { onDsChange: 'ds-change' },
});
