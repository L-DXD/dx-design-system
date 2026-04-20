import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { syncAccessibleName } from '../utils/sync-accessible-name.js';
import { defineElement } from '../utils/define-element.js';

export class DsInput extends SlInput {
  #disposeA11y?: () => void;

  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-input': 'ds-input', 'sl-change': 'ds-change' });
  }

  firstUpdated() {
    super.firstUpdated?.();
    this.#disposeA11y = syncAccessibleName(this, 'input.input__control');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disposeA11y?.();
  }
}
defineElement("ds-input", DsInput);
