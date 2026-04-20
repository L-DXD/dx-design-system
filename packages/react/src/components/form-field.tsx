import React from 'react';
import { createComponent } from '@lit/react';
import { DsFormField as DsFormFieldElement } from '@dx/core';

export interface FormFieldProps extends Omit<React.ComponentProps<'div'>, 'ref'> {
  /** 자식 배치. 기본 vertical. horizontal 은 체크박스/토글 + 라벨 조립에 사용. */
  orientation?: 'vertical' | 'horizontal';
  ref?: React.Ref<DsFormFieldElement>;
}

const FormFieldComponent = createComponent({
  tagName: 'ds-form-field',
  elementClass: DsFormFieldElement,
  react: React,
  events: {},
});

export const FormField = FormFieldComponent as unknown as React.FC<FormFieldProps>;
