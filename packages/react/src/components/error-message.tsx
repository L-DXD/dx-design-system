import React from 'react';
import { createComponent } from '@lit/react';
import { DsErrorMessage } from '@dx/core';

export const ErrorMessage = createComponent({
  tagName: 'ds-error-message',
  elementClass: DsErrorMessage,
  react: React,
  events: {},
});
