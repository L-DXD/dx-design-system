import React from 'react';
import { createComponent } from '@lit/react';
import { DsRadioGroup } from '@dx/core';

export const RadioGroup = createComponent({
  tagName: 'ds-radio-group',
  elementClass: DsRadioGroup,
  react: React,
  events: { onDsChange: 'ds-change' },
});
