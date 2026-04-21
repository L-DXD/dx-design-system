import { DxElement } from './base-element.js';
import { helperTextClasses } from '@dx/ui/styles/form-field';

export class DsHelperText extends DxElement {
  protected getBaseClasses(): string {
    return helperTextClasses;
  }
  protected renderInternal(): HTMLElement {
    return document.createElement('p');
  }
}
