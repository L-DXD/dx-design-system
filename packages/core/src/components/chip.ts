import SlTag from '@shoelace-style/shoelace/dist/components/tag/tag.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsChip extends SlTag {
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-remove': 'ds-remove' });
  }
}
if (!customElements.get('ds-chip')) {
  customElements.define('ds-chip', DsChip);
}
