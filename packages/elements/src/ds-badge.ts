import { DxElement } from './base-element.js';
import {
  badgeBaseClasses,
  badgeVariantClasses,
  type BadgeVariant,
} from '@dx/ui/styles/badge';

export class DsBadge extends DxElement {
  protected getBaseClasses(): string {
    const variant = (this.getAttribute('variant') ?? 'default') as BadgeVariant;
    return `${badgeBaseClasses} ${badgeVariantClasses[variant] ?? badgeVariantClasses.default}`;
  }
  protected renderInternal(): HTMLElement {
    return document.createElement('span');
  }
}
