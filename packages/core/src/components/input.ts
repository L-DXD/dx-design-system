import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsInput extends SlInput {
  createRenderRoot() { return this; }
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-input': 'ds-input', 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-input')) {
  customElements.define('ds-input', DsInput);
}
