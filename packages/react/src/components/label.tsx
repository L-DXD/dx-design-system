import React from 'react';
import { createComponent } from '@lit/react';
import { DsLabel as DsLabelElement } from '@dx/core';

/**
 * ds-label 은 네이티브 <label> 의 속성을 그대로 받는다.
 * `htmlFor` 는 React.ComponentProps<'label'> 에 포함되어 있다.
 * `required` 만 ds 고유 추가 prop.
 */
export interface LabelProps extends Omit<React.ComponentProps<'label'>, 'ref'> {
  /** 필수 입력 표시(*). */
  required?: boolean;
  ref?: React.Ref<DsLabelElement>;
}

const LabelComponent = createComponent({
  tagName: 'ds-label',
  elementClass: DsLabelElement,
  react: React,
  events: {},
});

export const Label = LabelComponent as unknown as React.FC<LabelProps>;
