import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { syncAccessibleName } from '../utils/sync-accessible-name.js';
import { defineElement } from '../utils/define-element.js';

export class DsCheckbox extends SlCheckbox {
  #disposeA11y?: () => void;

  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }

  firstUpdated() {
    super.firstUpdated?.();
    this.#disposeA11y = syncAccessibleName(this, 'input[type="checkbox"]');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disposeA11y?.();
  }
}
defineElement("ds-checkbox", DsCheckbox);
