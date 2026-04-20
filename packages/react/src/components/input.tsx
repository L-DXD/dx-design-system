import React from 'react';
import { createComponent } from '@lit/react';
import { DsInput as DsInputElement } from '@dx/core';

/**
 * ds-input 은 네이티브 <input> 의 속성 대부분을 그대로 받는다.
 * React.ComponentProps<'input'> 로 모든 표준 속성(type, placeholder, value, pattern 등)을
 * autocomplete 대상으로 노출하고, ds-* 커스텀 이벤트만 CustomEvent 타입으로 재정의한다.
 */
export interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'onInput' | 'onChange' | 'onBlur' | 'onFocus' | 'ref'> {
  /** ds-input 이벤트. 값이 변경되는 동안 매번 발생. */
  onInput?: (e: CustomEvent) => void;
  /** ds-change 이벤트. 값 확정 시 발생 (blur 또는 Enter). */
  onChange?: (e: CustomEvent) => void;
  onBlur?: (e: FocusEvent) => void;
  onFocus?: (e: FocusEvent) => void;
  ref?: React.Ref<DsInputElement>;
}

const InputComponent = createComponent({
  tagName: 'ds-input',
  // @lit/react 는 elementClass 가 HTMLElement 생성자이길 요구하지만, SlInput.autocorrect 가
  // TS DOM lib 와 타입 충돌해 체크 실패. 런타임엔 영향 없음.
  elementClass: DsInputElement as unknown as { new (): HTMLElement },
  react: React,
  events: {
    onInput: 'ds-input',
    onChange: 'ds-change',
    onBlur: 'ds-blur',
    onFocus: 'ds-focus',
  },
});

export const Input = InputComponent as unknown as React.FC<InputProps>;
