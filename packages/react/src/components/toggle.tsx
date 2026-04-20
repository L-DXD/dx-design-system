import React from 'react';
import { createComponent } from '@lit/react';
import { DsToggle as DsToggleElement } from '@dx/core';

export interface ToggleProps
  extends Omit<React.ComponentProps<'input'>, 'type' | 'size' | 'onChange' | 'onBlur' | 'onFocus' | 'ref'> {
  size?: 'small' | 'medium' | 'large';
  /** ds-change 이벤트. 토글 상태가 바뀔 때 발생. */
  onChange?: (e: CustomEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsToggleElement>;
}

const ToggleComponent = createComponent({
  tagName: 'ds-toggle',
  elementClass: DsToggleElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onChange: 'ds-change',
    onBlur: 'sl-blur',
    onFocus: 'sl-focus',
  },
});

export const Toggle = ToggleComponent as unknown as React.FC<ToggleProps>;
