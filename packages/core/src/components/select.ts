import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsSelect extends SlSelect {
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-select')) {
  customElements.define('ds-select', DsSelect);
}
