import React from 'react';
import { createComponent } from '@lit/react';
import { DsButton } from '@dx/core';

export const Button = createComponent({
  tagName: 'ds-button',
  elementClass: DsButton,
  react: React,
  events: { onClick: 'click' },
});
