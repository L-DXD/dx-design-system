import React from 'react';
import { createComponent } from '@lit/react';
import { DsInput } from '@dx/core';

export const Input = createComponent({
  tagName: 'ds-input',
  elementClass: DsInput,
  react: React,
  events: { onDsInput: 'ds-input', onDsChange: 'ds-change' },
});
