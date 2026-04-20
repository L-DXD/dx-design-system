import React from 'react';
import { createComponent } from '@lit/react';
import { DsRadioGroup as DsRadioGroupElement } from '@dx/core';

export interface RadioGroupProps
  extends Omit<React.ComponentProps<'fieldset'>, 'onChange' | 'ref'> {
  size?: 'small' | 'medium' | 'large';
  label?: string;
  helpText?: string;
  /** ds-change 이벤트. 선택된 radio 가 바뀔 때 발생. */
  onChange?: (e: CustomEvent) => void;
  ref?: React.Ref<DsRadioGroupElement>;
}

const RadioGroupComponent = createComponent({
  tagName: 'ds-radio-group',
  elementClass: DsRadioGroupElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onChange: 'ds-change',
  },
});

export const RadioGroup = RadioGroupComponent as unknown as React.FC<RadioGroupProps>;
