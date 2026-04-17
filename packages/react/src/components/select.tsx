import React from 'react';
import { createComponent } from '@lit/react';
import { DsSelect } from '@dx/core';

export const Select = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelect,
  react: React,
  events: { onDsChange: 'ds-change' },
});
