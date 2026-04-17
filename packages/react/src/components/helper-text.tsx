import React from 'react';
import { createComponent } from '@lit/react';
import { DsHelperText } from '@dx/core';

export const HelperText = createComponent({
  tagName: 'ds-helper-text',
  elementClass: DsHelperText,
  react: React,
  events: {},
});
