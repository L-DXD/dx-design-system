import React from 'react';
import { createComponent } from '@lit/react';
import { DsRadio } from '@dx/core';

export const Radio = createComponent({
  tagName: 'ds-radio',
  elementClass: DsRadio,
  react: React,
  events: {},
});
