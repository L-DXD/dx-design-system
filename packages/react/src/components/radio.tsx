import React from 'react';
import { createComponent } from '@lit/react';
import { DsRadio as DsRadioElement } from '@dx/core';

export interface RadioProps
  extends Omit<React.ComponentProps<'input'>, 'type' | 'size' | 'onBlur' | 'onFocus' | 'ref'> {
  size?: 'small' | 'medium' | 'large';
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsRadioElement>;
}

const RadioComponent = createComponent({
  tagName: 'ds-radio',
  elementClass: DsRadioElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onBlur: 'sl-blur',
    onFocus: 'sl-focus',
  },
});

export const Radio = RadioComponent as unknown as React.FC<RadioProps>;
