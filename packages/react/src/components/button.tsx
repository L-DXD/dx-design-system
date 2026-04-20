import React from 'react';
import { createComponent } from '@lit/react';
import { DsButton as DsButtonElement } from '@dx/core';

/**
 * ds-button 은 네이티브 <button> + <a>(href) 속성을 모두 받는다.
 * Shoelace 추가 스타일 prop(variant/size/outline/pill/...)만 수동 선언.
 */
export interface ButtonProps
  extends Omit<React.ComponentProps<'button'>, 'onBlur' | 'onFocus' | 'ref'> {
  /** 의미적 variant. 색상이 아니라 역할로 선택한다. */
  variant?: 'default' | 'primary' | 'success' | 'neutral' | 'warning' | 'danger' | 'text';
  size?: 'small' | 'medium' | 'large';
  outline?: boolean;
  pill?: boolean;
  circle?: boolean;
  caret?: boolean;
  loading?: boolean;
  /** 링크 버튼. 설정되면 <a href> 로 렌더. */
  href?: string;
  target?: '_blank' | '_parent' | '_self' | '_top';
  rel?: string;
  download?: string;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsButtonElement>;
}

const ButtonComponent = createComponent({
  tagName: 'ds-button',
  elementClass: DsButtonElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onClick: 'click',
    onBlur: 'sl-blur',
    onFocus: 'sl-focus',
  },
});

export const Button = ButtonComponent as unknown as React.FC<ButtonProps>;
