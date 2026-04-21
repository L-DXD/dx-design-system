import { DxElement } from './base-element.js';
import { labelBaseClasses } from '@dx/ui/styles/label';

export class DsLabel extends DxElement {
  protected getBaseClasses(): string {
    return labelBaseClasses;
  }
  protected renderInternal(): HTMLElement {
    return document.createElement('label');
  }
}
