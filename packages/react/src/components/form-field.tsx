import React from 'react';
import { createComponent } from '@lit/react';
import { DsFormField } from '@dx/core';

export const FormField = createComponent({
  tagName: 'ds-form-field',
  elementClass: DsFormField,
  react: React,
  events: {},
});
