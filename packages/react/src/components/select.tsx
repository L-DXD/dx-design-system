import React from 'react';
import { createComponent } from '@lit/react';
import { DsSelect as DsSelectElement } from '@dx/core';

export interface SelectProps
  extends Omit<React.ComponentProps<'select'>, 'size' | 'onChange' | 'onBlur' | 'onFocus' | 'ref'> {
  size?: 'small' | 'medium' | 'large';
  placeholder?: string;
  clearable?: boolean;
  filled?: boolean;
  pill?: boolean;
  hoist?: boolean;
  placement?: 'top' | 'bottom';
  /** ds-change 이벤트. 선택 변경 시 발생. */
  onChange?: (e: CustomEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsSelectElement>;
}

const SelectComponent = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelectElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onChange: 'ds-change',
    onBlur: 'sl-blur',
    onFocus: 'sl-focus',
  },
});

export const Select = SelectComponent as unknown as React.FC<SelectProps>;
