import React from 'react';
import { createComponent } from '@lit/react';
import { DsOption as DsOptionElement } from '@dx/core';

export interface OptionProps extends Omit<React.ComponentProps<'option'>, 'ref'> {
  ref?: React.Ref<DsOptionElement>;
}

const OptionComponent = createComponent({
  tagName: 'ds-option',
  elementClass: DsOptionElement as unknown as { new (): HTMLElement },
  react: React,
  events: {},
});

export const Option = OptionComponent as unknown as React.FC<OptionProps>;
