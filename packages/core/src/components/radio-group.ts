import SlRadioGroup from '@shoelace-style/shoelace/dist/components/radio-group/radio-group.component.js';
import { remapEvents } from '../utils/remap-events.js';

export class DsRadioGroup extends SlRadioGroup {
  connectedCallback() {
    super.connectedCallback();
    remapEvents(this, { 'sl-change': 'ds-change' });
  }
}
if (!customElements.get('ds-radio-group')) {
  customElements.define('ds-radio-group', DsRadioGroup);
}
