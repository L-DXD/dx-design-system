import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsToggle extends SlSwitch {
  createRenderRoot() { return this; }
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-toggle')) {
  customElements.define('ds-toggle', DsToggle);
}
