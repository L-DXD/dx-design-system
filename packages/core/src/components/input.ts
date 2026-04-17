import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { syncAccessibleName } from '../utils/sync-accessible-name.js';

export class DsInput extends SlInput {
  #disposeA11y?: () => void;

  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-input': 'ds-input', 'sl-change': 'ds-change' });
  }

  firstUpdated(changed: Map<string, unknown>) {
    super.firstUpdated?.(changed);
    this.#disposeA11y = syncAccessibleName(this, 'input.input__control');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disposeA11y?.();
  }
}
if (!customElements.get('ds-input')) {
  customElements.define('ds-input', DsInput);
}
