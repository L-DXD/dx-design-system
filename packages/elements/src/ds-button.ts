import { DxElement } from './base-element.js';
import {
  buttonBaseClasses,
  buttonVariantClasses,
  buttonSizeClasses,
  type ButtonVariant,
  type ButtonSize,
} from '@dx/ui/styles/button';

export class DsButton extends DxElement {
  protected getBaseClasses(): string {
    const variant = (this.getAttribute('variant') ?? 'default') as ButtonVariant;
    const size = (this.getAttribute('size') ?? 'default') as ButtonSize;
    return [
      buttonBaseClasses,
      buttonVariantClasses[variant] ?? buttonVariantClasses.default,
      buttonSizeClasses[size] ?? buttonSizeClasses.default,
    ].join(' ');
  }
  protected renderInternal(): HTMLElement {
    return document.createElement('button');
  }
}
