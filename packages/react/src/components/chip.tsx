import React from 'react';
import { createComponent } from '@lit/react';
import { DsChip } from '@dx/core';

export const Chip = createComponent({
  tagName: 'ds-chip',
  elementClass: DsChip,
  react: React,
  events: { onDsRemove: 'ds-remove' },
});
