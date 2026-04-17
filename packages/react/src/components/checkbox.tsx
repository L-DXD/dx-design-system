import React from 'react';
import { createComponent } from '@lit/react';
import { DsCheckbox } from '@dx/core';

export const Checkbox = createComponent({
  tagName: 'ds-checkbox',
  elementClass: DsCheckbox,
  react: React,
  events: { onDsChange: 'ds-change' },
});
