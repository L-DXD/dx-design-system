import React from 'react';
import { createComponent } from '@lit/react';
import { DsCheckbox as DsCheckboxElement } from '@dx/core';

export interface CheckboxProps
  extends Omit<React.ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'onBlur' | 'onFocus' | 'ref'> {
  size?: 'small' | 'medium' | 'large';
  indeterminate?: boolean;
  /** ds-change 이벤트. 체크 상태가 바뀔 때 발생. */
  onChange?: (e: CustomEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsCheckboxElement>;
}

const CheckboxComponent = createComponent({
  tagName: 'ds-checkbox',
  elementClass: DsCheckboxElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onChange: 'ds-change',
    onBlur: 'sl-blur',
    onFocus: 'sl-focus',
  },
});

export const Checkbox = CheckboxComponent as unknown as React.FC<CheckboxProps>;
