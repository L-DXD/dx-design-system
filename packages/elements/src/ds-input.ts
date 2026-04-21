import { DxElement } from './base-element.js';
import { inputBaseClasses } from '@dx/ui/styles/input';

export class DsInput extends DxElement {
  protected getBaseClasses(): string {
    return inputBaseClasses;
  }
  protected renderInternal(): HTMLElement {
    return document.createElement('input');
  }
}
