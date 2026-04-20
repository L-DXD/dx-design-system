import React from 'react';
import { createComponent } from '@lit/react';
import { DsChip as DsChipElement } from '@dx/core';

export interface ChipProps extends Omit<React.ComponentProps<'span'>, 'ref'> {
  variant?: 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  pill?: boolean;
  removable?: boolean;
  /** ds-remove 이벤트. removable chip 의 X 버튼 클릭 시 발생. */
  onRemove?: (e: CustomEvent) => void;
  ref?: React.Ref<DsChipElement>;
}

const ChipComponent = createComponent({
  tagName: 'ds-chip',
  elementClass: DsChipElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onRemove: 'ds-remove',
  },
});

export const Chip = ChipComponent as unknown as React.FC<ChipProps>;
