import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { remapEvents } from '../utils/remap-events.js';
import { syncAccessibleName } from '../utils/sync-accessible-name.js';

export class DsSelect extends SlSelect {
  #disposeA11y?: () => void;

  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }

  firstUpdated(changed: Map<string, unknown>) {
    super.firstUpdated?.(changed);
    this.#disposeA11y = syncAccessibleName(this, 'input.select__display-input');
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#disposeA11y?.();
  }
}
if (!customElements.get('ds-select')) {
  customElements.define('ds-select', DsSelect);
}
