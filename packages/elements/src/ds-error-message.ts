import { DxElement } from './base-element.js';
import { errorMessageClasses } from '@dx/ui/styles/form-field';

export class DsErrorMessage extends DxElement {
  protected getBaseClasses(): string {
    return errorMessageClasses;
  }
  protected renderInternal(): HTMLElement {
    const p = document.createElement('p');
    p.setAttribute('role', 'alert');
    return p;
  }
}
