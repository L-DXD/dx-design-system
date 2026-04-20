import React from 'react';
import { createComponent } from '@lit/react';
import { DsErrorMessage as DsErrorMessageElement } from '@dx/core';

export interface ErrorMessageProps extends Omit<React.ComponentProps<'span'>, 'ref'> {
  ref?: React.Ref<DsErrorMessageElement>;
}

const ErrorMessageComponent = createComponent({
  tagName: 'ds-error-message',
  elementClass: DsErrorMessageElement,
  react: React,
  events: {},
});

export const ErrorMessage = ErrorMessageComponent as unknown as React.FC<ErrorMessageProps>;
