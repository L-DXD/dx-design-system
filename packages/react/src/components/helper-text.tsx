import React from 'react';
import { createComponent } from '@lit/react';
import { DsHelperText as DsHelperTextElement } from '@dx/core';

export interface HelperTextProps extends Omit<React.ComponentProps<'span'>, 'ref'> {
  ref?: React.Ref<DsHelperTextElement>;
}

const HelperTextComponent = createComponent({
  tagName: 'ds-helper-text',
  elementClass: DsHelperTextElement,
  react: React,
  events: {},
});

export const HelperText = HelperTextComponent as unknown as React.FC<HelperTextProps>;
