import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { syncAccessibleName } from '../utils/sync-accessible-name.js';

export class DsCheckbox extends SlCheckbox {
  #disposeA11y?: () => void;

  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }

  firstUpdated(changed: Map<string, unknown>) {
    super.firstUpdated?.(changed);
    this.#disposeA11y = syncAccessibleName(this, 'input[type="checkbox"]');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disposeA11y?.();
  }
}
if (!customElements.get('ds-checkbox')) {
  customElements.define('ds-checkbox', DsCheckbox);
}
