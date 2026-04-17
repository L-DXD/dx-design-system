import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsCheckbox extends SlCheckbox {
  createRenderRoot() { return this; }
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-checkbox')) {
  customElements.define('ds-checkbox', DsCheckbox);
}
